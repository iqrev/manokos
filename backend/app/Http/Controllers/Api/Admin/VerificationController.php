<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Kyc;
use App\Models\Property;
use Illuminate\Http\Request;

class VerificationController extends Controller
{
    public function listKyc()
    {
        $kycs = Kyc::with('owner')->orderBy('created_at', 'desc')->get();
        return response()->json($kycs);
    }

    public function verifyKyc(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:verified,rejected',
            'admin_notes' => 'nullable|string',
        ]);

        $kyc = Kyc::findOrFail($id);
        $kyc->update([
            'status' => $request->status,
            'admin_notes' => $request->admin_notes,
        ]);

        return response()->json([
            'message' => 'Status KYC berhasil diperbarui.',
            'kyc' => $kyc
        ]);
    }

    public function listProperties()
    {
        $properties = Property::with('owner')->orderBy('created_at', 'desc')->get();
        return response()->json($properties);
    }

    public function verifyProperty(Request $request, $id)
    {
        $request->validate([
            'is_verified' => 'required|boolean',
            'is_boosted' => 'nullable|boolean',
        ]);

        $property = Property::findOrFail($id);
        $property->update($request->only(['is_verified', 'is_boosted']));

        return response()->json([
            'message' => 'Status properti berhasil diperbarui.',
            'property' => $property
        ]);
    }
}
