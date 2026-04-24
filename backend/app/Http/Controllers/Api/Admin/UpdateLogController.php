<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\UpdateLog;
use Illuminate\Http\Request;

class UpdateLogController extends Controller
{
    public function index()
    {
        return response()->json(
            UpdateLog::orderBy('release_date', 'desc')->get()
        );
    }

    public function publicIndex()
    {
        return response()->json(
            UpdateLog::where('is_published', true)
                ->orderBy('release_date', 'desc')
                ->get()
        );
    }

    public function store(Request $request)
    {
        $request->validate([
            'version'      => 'required|string|max:20',
            'title'        => 'required|string|max:255',
            'description'  => 'required|string',
            'type'         => 'required|in:feature,fix,improvement,breaking',
            'release_date' => 'required|date',
            'is_published' => 'boolean',
        ]);

        $log = UpdateLog::create($request->all());

        return response()->json([
            'message' => 'Update log berhasil ditambahkan.',
            'log' => $log,
        ]);
    }

    public function update(Request $request, $id)
    {
        $log = UpdateLog::findOrFail($id);

        $request->validate([
            'version'      => 'string|max:20',
            'title'        => 'string|max:255',
            'description'  => 'string',
            'type'         => 'in:feature,fix,improvement,breaking',
            'release_date' => 'date',
            'is_published' => 'boolean',
        ]);

        $log->update($request->all());

        return response()->json([
            'message' => 'Update log berhasil diperbarui.',
            'log' => $log,
        ]);
    }

    public function destroy($id)
    {
        UpdateLog::findOrFail($id)->delete();
        return response()->json(['message' => 'Update log dihapus.']);
    }
}
