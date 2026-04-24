<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Property;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    /**
     * GET /api/properties/{id}/reviews
     * Public: Tampilkan semua ulasan + rata-rata rating.
     */
    public function index($propertyId)
    {
        $reviews = Review::where('property_id', $propertyId)
            ->with('user:id,name')
            ->latest()
            ->get()
            ->map(function ($r) {
                return [
                    'id'         => $r->id,
                    'rating'     => $r->rating,
                    'body'       => $r->body,
                    'created_at' => $r->created_at,
                    'user'       => [
                        'id'   => $r->user?->id,
                        'name' => $r->user?->name ?? 'Anonim',
                    ],
                ];
            });

        $avg = $reviews->avg('rating');

        return response()->json([
            'avg_rating'   => $avg ? round($avg, 1) : null,
            'total'        => $reviews->count(),
            'reviews'      => $reviews,
        ]);
    }

    /**
     * POST /api/properties/{id}/reviews
     * Auth required. 1 ulasan per user per properti.
     */
    public function store(Request $request, $propertyId)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'body'   => 'nullable|string|max:500',
        ]);

        Property::findOrFail($propertyId);

        // Prevent duplicates
        $existing = Review::where('property_id', $propertyId)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Anda sudah memberikan ulasan untuk properti ini.'], 422);
        }

        $review = Review::create([
            'property_id' => $propertyId,
            'user_id'     => $request->user()->id,
            'rating'      => $request->rating,
            'body'        => $request->body,
        ]);

        return response()->json([
            'message' => 'Ulasan berhasil ditambahkan. Terima kasih!',
            'review'  => $review,
        ], 201);
    }

    /**
     * DELETE /api/reviews/{id}
     * Auth required. Hanya pemilik ulasan yang bisa hapus.
     */
    public function destroy(Request $request, $id)
    {
        $review = Review::where('id', $id)
            ->where('user_id', $request->user()->id)
            ->firstOrFail();

        $review->delete();

        return response()->json(['message' => 'Ulasan dihapus.']);
    }
}
