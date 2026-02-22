<?php
// app/Http/Controllers/AIController.php

namespace App\Http\Controllers;

use App\Models\Resource;
use App\Models\Subject;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class AIController extends Controller
{
    private $apiKey;
    
    public function __construct()
    {
        $this->apiKey = env('GEMINI_API_KEY');
    }

    /**
     * AI Chat Assistant
     */
    public function chat(Request $request)
    {
        try {
            $request->validate([
                'message' => 'required|string',
                'context' => 'nullable|array'
            ]);

            $message = $request->message;
            $user = $request->user();
            
            // Build context from user data
            $context = [
                'user_role' => $user?->role ?? 'guest',
                'department' => $user?->department->name ?? null,
                'semester' => $user?->semester ?? null,
                'recent_downloads' => $user ? $this->getUserRecentTopics($user) : []
            ];

            // Search for relevant resources first
            $relevantResources = $this->searchResources($message);
            
            // Create prompt for Gemini
            $prompt = $this->buildPrompt($message, $context, $relevantResources);
            
            // Call Gemini API
            $response = $this->callGemini($prompt);
            
            // Save conversation log (optional)
            $this->logConversation($user, $message, $response, $relevantResources);
            
            return response()->json([
                'success' => true,
                'response' => $response,
                'suggested_resources' => $relevantResources,
                'timestamp' => now()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'AI service error',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Smart Search with AI
     */
    public function smartSearch(Request $request)
    {
        try {
            $request->validate([
                'query' => 'required|string'
            ]);

            $query = $request->query;
            
            // Step 1: Let Gemini understand the query
            $understanding = $this->callGemini(
                "Extract academic information from this query. Return JSON with: subject, topic, semester, type (note/pyq/etc). Query: $query"
            );
            
            // Parse AI response (assuming JSON)
            $filters = json_decode($understanding, true);
            
            // Step 2: Search with filters
            $resources = Resource::where('status', 'verified')
                ->where('visibility', 'visible');
            
            if (isset($filters['subject'])) {
                $resources->whereHas('subject', function($q) use ($filters) {
                    $q->where('name', 'LIKE', "%{$filters['subject']}%");
                });
            }
            
            if (isset($filters['semester'])) {
                $resources->where('semester', $filters['semester']);
            }
            
            if (isset($filters['type'])) {
                $resources->where('type', $filters['type']);
            }
            
            if (isset($filters['topic'])) {
                $resources->where(function($q) use ($filters) {
                    $q->where('title', 'LIKE', "%{$filters['topic']}%")
                      ->orWhere('description', 'LIKE', "%{$filters['topic']}%");
                });
            }
            
            $results = $resources->with(['subject', 'department'])
                ->orderBy('rating_avg', 'desc')
                ->take(20)
                ->get();
            
            return response()->json([
                'success' => true,
                'ai_understanding' => $filters,
                'results' => $results,
                'count' => $results->count()
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Search failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Generate study plan
     */
    public function studyPlan(Request $request)
    {
        try {
            $request->validate([
                'subject_id' => 'required|exists:subjects,id',
                'hours_per_day' => 'required|integer|min:1|max:8',
                'exam_date' => 'required|date'
            ]);

            $subject = Subject::with('modules')->find($request->subject_id);
            
            $prompt = "Create a study plan for {$subject->name} with " . 
                     count($subject->modules) . " modules. " .
                     "Study hours per day: {$request->hours_per_day}. " .
                     "Exam date: {$request->exam_date}. " .
                     "Format as JSON with daily schedule.";
            
            $plan = $this->callGemini($prompt);
            
            return response()->json([
                'success' => true,
                'subject' => $subject->name,
                'plan' => json_decode($plan, true)
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate study plan',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper: Call Gemini API
     */
    private function callGemini($prompt)
    {
        $response = Http::post("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={$this->apiKey}", [
            'contents' => [
                [
                    'parts' => [
                        ['text' => $prompt]
                    ]
                ]
            ]
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return $data['candidates'][0]['content']['parts'][0]['text'] ?? 'No response';
        }

        throw new \Exception('Gemini API error: ' . $response->body());
    }

    /**
     * Helper: Search resources
     */
    private function searchResources($query)
    {
        return Resource::where('status', 'verified')
            ->where('visibility', 'visible')
            ->where(function($q) use ($query) {
                $q->where('title', 'LIKE', "%{$query}%")
                  ->orWhere('description', 'LIKE', "%{$query}%");
            })
            ->with(['subject', 'department'])
            ->orderBy('rating_avg', 'desc')
            ->take(5)
            ->get()
            ->map(function($r) {
                return [
                    'id' => $r->id,
                    'title' => $r->title,
                    'type' => $r->type,
                    'subject' => $r->subject->name ?? 'N/A',
                    'rating' => $r->rating_avg,
                    'url' => "/resources/{$r->id}"
                ];
            });
    }

    /**
     * Helper: Get user's recent topics
     */
    private function getUserRecentTopics($user)
    {
        return $user->downloads()
            ->with('resource.subject')
            ->latest()
            ->take(5)
            ->get()
            ->pluck('resource.subject.name')
            ->filter()
            ->unique()
            ->values();
    }

    /**
     * Helper: Build prompt
     */
    private function buildPrompt($message, $context, $resources)
    {
        $prompt = "You are EMEAHub AI Assistant, helping students with their academic needs.\n\n";
        $prompt .= "User Context: " . json_encode($context) . "\n\n";
        $prompt .= "Available Resources: " . json_encode($resources) . "\n\n";
        $prompt .= "User Question: " . $message . "\n\n";
        $prompt .= "Provide helpful, accurate academic assistance. If relevant resources exist, mention them.";
        
        return $prompt;
    }

    /**
     * Helper: Log conversation
     */
    private function logConversation($user, $message, $response, $resources)
    {
        if (!$user) return;
        
        try {
            \App\Models\AILog::create([
                'user_id' => $user->id,
                'query' => $message,
                'response' => $response,
                'resources_suggested' => json_encode($resources),
                'created_at' => now()
            ]);
        } catch (\Exception $e) {
            // Silent fail
        }
    }
}