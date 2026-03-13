<?php
// app/Http/Controllers/SubjectController.php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\Module;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SubjectController extends Controller
{
    /**
     * Get all subjects for admin
     */
    public function index()
    {
        $subjects = Subject::with('department:id,name')->orderBy('name')->get();
        return response()->json([
            'success' => true,
            'subjects' => $subjects
        ]);
    }
    /**
     * Get subjects by department and semester
     */
    public function getByDepartment(Request $request)
    {
        $request->validate([
            'department_id' => 'required|exists:departments,id',
            'semester' => 'required|integer|min:1|max:8'
        ]);

        $subjects = Subject::where('department_id', $request->department_id)
            ->where('semester', $request->semester)
            ->where('is_active', true)
            ->select('id', 'name', 'code', 'type', 'syllabus_path')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'subjects' => $subjects
        ]);
    }

    /**
     * Get modules for a subject
     */
    public function getModules($subjectId)
    {
        $modules = Module::where('subject_id', $subjectId)
            ->orderBy('module_number')
            ->select('id', 'name', 'module_number')
            ->get();

        return response()->json([
            'success' => true,
            'modules' => $modules
        ]);
    }

  public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'code' => 'required|string|max:50',
        'type' => 'required|in:major,minor,mdc,aec,sec,vac',
        'department_id' => 'required|exists:departments,id',
        'semester' => 'required|integer|min:1|max:8'
    ]);

    $data = [
        'name' => $request->name,
        'code' => $request->code,
        'type' => $request->type,
        'department_id' => $request->department_id,
        'semester' => $request->semester,
        'is_active' => true
    ];

    if ($request->hasFile('syllabus_file')) {
        $file = $request->file('syllabus_file');
        $fileName = time() . '_' . Str::slug($request->name) . '_syllabus.' . $file->getClientOriginalExtension();
        $path = $file->storeAs('syllabuses', $fileName, 'public');
        $data['syllabus_path'] = Storage::url($path);
    }

    $subject = Subject::create($data);

    return response()->json([
        'success' => true,
        'subject' => $subject
    ]);
  }

  public function update(Request $request, $id)
  {
      $request->validate([
          'name' => 'required|string|max:255',
          'code' => 'required|string|max:50',
          'type' => 'required|in:major,minor,mdc,aec,sec,vac',
          'department_id' => 'required|exists:departments,id',
          'semester' => 'required|integer|min:1|max:8'
      ]);

      $subject = Subject::findOrFail($id);
      
      $data = [
          'name' => $request->name,
          'code' => $request->code,
          'type' => $request->type,
          'department_id' => $request->department_id,
          'semester' => $request->semester
      ];

      if ($request->hasFile('syllabus_file')) {
          // Delete old syllabus if exists
          if ($subject->syllabus_path) {
              $oldPath = str_replace('/storage/', '', parse_url($subject->syllabus_path, PHP_URL_PATH));
              Storage::disk('public')->delete($oldPath);
          }

          $file = $request->file('syllabus_file');
          $fileName = time() . '_' . Str::slug($request->name) . '_syllabus.' . $file->getClientOriginalExtension();
          $path = $file->storeAs('syllabuses', $fileName, 'public');
          $data['syllabus_path'] = Storage::url($path);
      }

      $subject->update($data);

      return response()->json([
          'success' => true,
          'subject' => $subject
      ]);
  }

  public function destroy($id)
  {
      $subject = Subject::findOrFail($id);
      $subject->delete();

      return response()->json([
          'success' => true,
          'message' => 'Subject deleted successfully'
      ]);
  }
}