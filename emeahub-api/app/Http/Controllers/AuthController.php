<?php
// app/Http/Controllers/AuthController.php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Department;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    // Register new user (student/public)
    public function register(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:6|confirmed',
                'role' => 'sometimes|in:student,public',
                'department_id' => 'required_if:role,student|exists:departments,id',
                'enrollment_no' => 'required_if:role,student|string|unique:users,enrollment_no',
                'semester' => 'required_if:role,student|integer|min:1|max:8'
            ]);

            // Default role is public if not specified
            $role = $request->role ?? 'public';

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $role,
                'department_id' => $request->department_id,
                'enrollment_no' => $request->enrollment_no,
                'semester' => $request->semester,
                'is_verified' => ($role === 'public') ? true : false // Public auto-verified
            ]);

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registration successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'is_verified' => $user->is_verified
                ],
                'token' => $token
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Login for all users
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required'
            ]);

            $user = User::where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ], 401);
            }

            // Check if user is active
            if (!$user->is_active) {
                return response()->json([
                    'success' => false,
                    'message' => 'Account is deactivated. Contact admin.'
                ], 403);
            }

            // Check verification for teachers
            if ($user->role === 'teacher' && !$user->is_verified) {
                return response()->json([
                    'success' => false,
                    'message' => 'Teacher account pending admin verification'
                ], 403);
            }

            // Delete old tokens and create new
            $user->tokens()->delete();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'department' => $user->department?->name,
                    'semester' => $user->semester,
                    'is_verified' => $user->is_verified,
                    'reputation_points' => $user->reputation_points
                ],
                'token' => $token
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Login failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Logout
    public function logout(Request $request)
    {
        try {
            $request->user()->currentAccessToken()->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Logged out successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Logout failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Get authenticated user
    public function me(Request $request)
    {
        $user = $request->user()->load('department');
        
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'department' => $user->department?->name,
                'semester' => $user->semester,
                'enrollment_no' => $user->enrollment_no,
                'is_verified' => $user->is_verified,
                'reputation_points' => $user->reputation_points,
                'total_uploads' => $user->total_uploads,
                'created_at' => $user->created_at
            ]
        ]);
    }

    // Teacher registration (requires admin approval)
    public function registerTeacher(Request $request)
    {
        try {
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|email|unique:users',
                'password' => 'required|string|min:6|confirmed',
                'department_id' => 'required|exists:departments,id'
            ]);

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'teacher',
                'department_id' => $request->department_id,
                'is_verified' => false // Needs admin approval
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Teacher registration successful. Waiting for admin approval.',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role
                ]
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], 422);
        }
    }
}