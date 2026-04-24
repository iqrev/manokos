<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Property;
use App\Models\PropertyStat;
use App\Models\Kyc;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get overview statistics for the admin dashboard.
     */
    public function stats()
    {
        $totalUsers = User::count();
        $totalOwners = User::where('role', 'owner')->count();
        $totalProperties = Property::count();
        $pendingKyc = Kyc::where('status', 'pending')->count();
        $totalClicks = PropertyStat::sum('whatsapp_clicks');

        // Stats for the last 7 days (Daily Views & Clicks)
        $dailyStats = PropertyStat::select(
            'date',
            DB::raw('SUM(views) as total_views'),
            DB::raw('SUM(whatsapp_clicks) as total_clicks')
        )
        ->where('date', '>=', now()->subDays(6))
        ->groupBy('date')
        ->orderBy('date', 'asc')
        ->get();

        // Property type distribution
        $typeStats = Property::select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->get();

        return response()->json([
            'overview' => [
                'total_users' => $totalUsers,
                'total_owners' => $totalOwners,
                'total_properties' => $totalProperties,
                'pending_kyc' => $pendingKyc,
                'total_clicks' => $totalClicks,
            ],
            'charts' => [
                'daily' => $dailyStats,
                'types' => $typeStats,
            ]
        ]);
    }

    /**
     * List all users with their roles and kyc status.
     */
    public function users(Request $request)
    {
        $query = User::with('kyc');

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        return response()->json($query->orderBy('created_at', 'desc')->get());
    }

    /**
     * Delete a user.
     */
    public function deleteUser($id)
    {
        $user = User::findOrFail($id);

        // Prevent self-deletion
        if (auth()->id() == $user->id) {
            return response()->json(['message' => 'Anda tidak bisa menghapus akun sendiri.'], 403);
        }

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus.']);
    }

    /**
     * Update user role.
     */
    public function updateUserRole(Request $request, $id)
    {
        $request->validate([
            'role' => 'required|in:user,owner,admin',
        ]);

        $user = User::findOrFail($id);
        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'Role user berhasil diperbarui.', 'user' => $user]);
    }
}
