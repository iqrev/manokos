<?php

namespace App\Http\Controllers\Api\Owner;

use App\Http\Controllers\Controller;
use App\Models\Kyc;
use Illuminate\Http\Request;

class KycController extends Controller
{
    public function submit(Request $request)
    {
        $request->validate([
            'ktp_image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
            'document_proof' => 'required|file|mimes:pdf,jpeg,png,jpg|max:5120',
        ]);

        $user = $request->user();

        // Check if already has KYC
        if ($user->kyc()->exists()) {
            return response()->json(['message' => 'Anda sudah mengajukan KYC.'], 400);
        }

        $ktpPath = $request->file('ktp_image')->store('kyc/ktp', 'public');
        $docPath = $request->file('document_proof')->store('kyc/proof', 'public');

        $kyc = Kyc::create([
            'owner_id' => $user->id,
            'ktp_path' => $ktpPath,
            'document_path' => $docPath,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'KYC berhasil diajukan dan sedang menunggu verifikasi.',
            'kyc' => $kyc
        ]);
    }

    public function status(Request $request)
    {
        $kyc = $request->user()->kyc;
        return response()->json($kyc);
    }
}
