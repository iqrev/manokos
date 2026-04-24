<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Bookmark;
use Illuminate\Http\Request;

class BookmarkController extends Controller
{
    /**
     * Get all bookmarked properties for the authenticated user.
     */
    public function index(Request $request)
    {
        $bookmarks = $request->user()
            ->bookmarkedProperties()
            ->with(['facilities', 'owner'])
            ->where('status', 'active')
            ->get();

        return response()->json($bookmarks);
    }

    /**
     * Toggle bookmark for a property (add if not exists, remove if exists).
     */
    public function toggle(Request $request, $propertyId)
    {
        $user = $request->user();

        $existing = Bookmark::where('user_id', $user->id)
            ->where('property_id', $propertyId)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'bookmarked' => false,
                'message' => 'Properti dihapus dari simpanan.',
            ]);
        }

        Bookmark::create([
            'user_id' => $user->id,
            'property_id' => $propertyId,
        ]);

        return response()->json([
            'bookmarked' => true,
            'message' => 'Properti disimpan.',
        ]);
    }

    /**
     * Check bookmark status for a single property.
     */
    public function status(Request $request, $propertyId)
    {
        $bookmarked = Bookmark::where('user_id', $request->user()->id)
            ->where('property_id', $propertyId)
            ->exists();

        return response()->json(['bookmarked' => $bookmarked]);
    }
}
