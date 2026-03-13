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

            // Build context from user data - handle guest users safely
            $context = [
                'user_role' => $user?->role ?? 'guest',
                'department' => $user?->department?->name ?? null,
                'semester' => $user?->semester ?? null,
                'recent_downloads' => $user ? $this->getUserRecentTopics($user) : []
            ];

            // Search for relevant resources
            $relevantResources = $this->searchResources($message);

            // Build resource availability context (for dept/subject queries)
            $availabilityContext = $this->buildAvailabilityContext($message);

            // Create prompt for Gemini
            $prompt = $this->buildPrompt($message, $context, $relevantResources, $availabilityContext);

            // Call Gemini API
            $response = $this->callGemini($prompt);

            // Save conversation log
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
                "query" => "required|string"
            ]);

            $query = $request->input("query");

            $understanding = $this->callGemini(
                "Extract academic information from this query. 
             Return JSON with: subject, topic, semester, type.
             Query: $query"
            );

            $filters = $this->parseAIResponse($understanding);

            $resources = Resource::where("status", "verified")
                ->where("visibility", "visible");

            if (!empty($filters["subject"])) {
                $resources->whereHas("subject", function ($q) use ($filters) {
                    $q->where("name", "LIKE", "%{$filters['subject']}%");
                });
            }

            if (!empty($filters["semester"])) {
                $resources->where("semester", $filters["semester"]);
            }

            if (!empty($filters["type"])) {
                $resources->where("type", $filters["type"]);
            }

            if (!empty($filters["topic"])) {
                $resources->where(function ($q) use ($filters) {
                    $q->where("title", "LIKE", "%{$filters['topic']}%")
                        ->orWhere("description", "LIKE", "%{$filters['topic']}%");
                });
            }

            $results = $resources
                ->with(["subject", "department"])
                ->orderBy("rating_avg", "desc")
                ->take(20)
                ->get();

            return response()->json([
                "success" => true,
                "ai_understanding" => $filters,
                "results" => $results,
                "count" => $results->count()
            ]);

        } catch (\Exception $e) {

            return response()->json([
                "success" => false,
                "message" => "Search failed",
                "error" => $e->getMessage()
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
            $parsedPlan = $this->parseAIResponse($plan);

            return response()->json([
                'success' => true,
                'subject' => $subject->name,
                'plan' => $parsedPlan
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
     * Summarize Topic
     */
    public function summarize(Request $request)
    {
        try {
            $request->validate([
                'topic' => 'required|string',
                'length' => 'nullable|in:short,medium,long'
            ]);

            $topic = $request->topic;
            $length = $request->length ?? 'medium';

            $lengthInstruction = [
                'short' => 'Provide a brief 3-sentence summary.',
                'medium' => 'Provide a concise 2-paragraph overview with key points.',
                'long' => 'Provide a detailed explanation with bullet points and examples.'
            ][$length];

            $prompt = "You are helping a college student. Summarize the following academic topic: '{$topic}'. {$lengthInstruction} Format the output cleanly.";

            $summary = $this->callGemini($prompt);

            return response()->json([
                'success' => true,
                'summary' => $summary
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to summarize topic',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Recommend Resources based on user history
     */
    public function recommendResources(Request $request)
    {
        try {
            $user = $request->user();
            $recent = $this->getUserRecentTopics($user);

            // If we lack history, just suggest highly rated stuff
            if (empty($recent) || count($recent) === 0) {
                $resources = Resource::where('status', 'verified')
                    ->where('visibility', 'visible')
                    ->with(['subject', 'department'])
                    ->orderBy('rating_avg', 'desc')
                    ->take(5)
                    ->get();

                return response()->json([
                    'success' => true,
                    'reasoning' => 'Based on global popularity',
                    'recommendations' => $resources
                ]);
            }

            // For now, return heavily downloaded items in their department if no AI is strictly needed
            $resources = Resource::where('status', 'verified')
                ->where('visibility', 'visible')
                ->where('department_id', $user->department_id)
                ->with(['subject', 'department'])
                ->orderBy('rating_avg', 'desc')
                ->take(5)
                ->get();

            return response()->json([
                'success' => true,
                'reasoning' => 'Based on your department and recent activity',
                'recommendations' => $resources
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get recommendations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper: Call Gemini API
     */
    private function callGemini($prompt)
    {
        $response = Http::post(
            "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash-lite:generateContent?key={$this->apiKey}",
            [
                "contents" => [
                    [
                        "parts" => [
                            ["text" => $prompt]
                        ]
                    ]
                ]
            ]
        );

        if (!$response->successful()) {
            throw new \Exception("Gemini API error: " . $response->body());
        }

        $data = $response->json();

        if (!isset($data["candidates"][0]["content"]["parts"][0]["text"])) {
            return "Sorry, I couldn't generate a response.";
        }

        return $data["candidates"][0]["content"]["parts"][0]["text"];
    }




    public function chatHistory(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                "success" => false,
                "message" => "Unauthorized"
            ], 401);
        }

        $history = \App\Models\AILog::where("user_id", $user->id)
            ->latest()
            ->take(20)
            ->get();

        return response()->json([
            "success" => true,
            "history" => $history
        ]);
    }

    public function trendingTopics()
    {
        $topics = Resource::select("subject_id")
            ->selectRaw("count(*) as total")
            ->groupBy("subject_id")
            ->orderByDesc("total")
            ->with("subject")
            ->take(5)
            ->get();

        return response()->json([
            "success" => true,
            "topics" => $topics
        ]);
    }
    /**
     * Helper: Search resources
     */
    private function searchResources($query)
    {
        return Resource::where('status', 'verified')
            ->where('visibility', 'visible')
            ->where(function ($q) use ($query) {
                $q->where('title', 'LIKE', "%{$query}%")
                    ->orWhere('description', 'LIKE', "%{$query}%");
            })
            ->with(['subject', 'department'])
            ->orderBy('rating_avg', 'desc')
            ->take(5)
            ->get()
            ->map(function ($r) {
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
        if (!$user)
            return [];

        try {
            return $user->downloads()
                ->with('resource.subject')
                ->latest()
                ->take(5)
                ->get()
                ->pluck('resource.subject.name')
                ->filter()
                ->unique()
                ->values()
                ->toArray();
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Helper: Build prompt with resource availability context
     */
    private function buildPrompt($message, $context, $resources, $availabilityContext = [])
    {
        $prompt = "You are EMEAHub AI Assistant, helping students of Calicut University FYUGP program with their academic needs.\n\n";
        $prompt .= "User Context: " . json_encode($context) . "\n\n";

        if (!empty($availabilityContext)) {
            $prompt .= "Resource Availability in EMEAHub (IMPORTANT - use this to answer if notes/resources exist):\n";
            $prompt .= json_encode($availabilityContext) . "\n\n";
        }

        if (!empty($resources)) {
            $prompt .= "Found Resources on EMEAHub: " . json_encode($resources) . "\n\n";
        }

        $prompt .= "User Question: " . $message . "\n\n";
        $prompt .= "Instructions: Provide helpful, accurate academic assistance. ";
        $prompt .= "If the user asks if notes or resources are available for a subject, use the Resource Availability data to answer accurately.";
        $prompt .= "If relevant resources exist on EMEAHub, mention them with their titles. ";
        $prompt .= "Be concise and student-friendly.";

        return $prompt;
    }

    /**
     * Helper: Build resource availability context for AI
     */
    private function buildAvailabilityContext($message)
    {
        try {
            // Extract potential subject names from message
            $subjects = Subject::with([
                'resources' => function ($q) {
                    $q->where('status', 'verified');
                }
            ])->get();

            $availability = [];
            foreach ($subjects as $subject) {
                $resourceCount = $subject->resources->count();
                $noteCount = $subject->resources->where('type', 'note')->count();
                $pyqCount = $subject->resources->where('type', 'pyq')->count();

                // Only include if subject name appears in message or if has resources
                if ($resourceCount > 0 || stripos($message, $subject->name) !== false) {
                    $availability[] = [
                        'subject' => $subject->name,
                        'code' => $subject->code,
                        'notes' => $noteCount,
                        'pyqs' => $pyqCount,
                        'total' => $resourceCount,
                        'available' => $resourceCount > 0
                    ];
                }
            }

            return $availability;

        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Helper: Log conversation
     */
    private function logConversation($user, $message, $response, $resources)
    {
        if (!$user)
            return;

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
    /**
     * Helper: Parse AI JSON response by stripping markdown blocks
     */
    private function parseAIResponse($content)
    {
        // Remove markdown code blocks if present
        $cleaned = preg_replace('/```json\s?|\s?```/', '', $content);
        $cleaned = trim($cleaned);

        $decoded = json_decode($cleaned, true);
        return $decoded ?: $content; // Return original if decoding fails
    }
}

// Available Gemini models (from your log)

// models/gemini-2.5-flash

// models/gemini-2.5-pro

// models/gemini-2.0-flash

// models/gemini-2.0-flash-001

// models/gemini-2.0-flash-lite-001

// models/gemini-2.0-flash-lite

// models/gemini-2.5-flash-lite
// generateContent
// countTokens
// createCachedContent
// batchGenerateContent