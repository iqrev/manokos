<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use App\Models\PropertyStat;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $query = Property::with(['facilities', 'owner'])
            ->where('status', 'active');

        // Filter by Area
        if ($request->has('area') && $request->area != '') {
            $query->where('area', $request->area);
        }

        // Filter by Type
        if ($request->has('type') && $request->type != '') {
            $query->where('type', $request->type);
        }

        // Filter by Price Range
        if ($request->has('min_price')) {
            $query->where('price_monthly', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price_monthly', '<=', $request->max_price);
        }

        // Sort: Boosted first, then by latest
        $properties = $query->orderBy('is_boosted', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 12));

        return response()->json($properties);
    }

    public function show($id)
    {
        $property = Property::with(['facilities', 'owner'])->findOrFail($id);

        // Record a view stat (deferred to avoid blocking response)
        $today = now()->toDateString();
        defer(fn () => PropertyStat::updateOrCreate(
            ['property_id' => $property->id, 'date' => $today],
            ['views' => \DB::raw('views + 1')]
        ));

        return response()->json($property);
    }

    public function recordClick($id)
    {
        $property = Property::findOrFail($id);
        
        $today = now()->toDateString();
        defer(fn () => PropertyStat::updateOrCreate(
            ['property_id' => $property->id, 'date' => $today],
            ['whatsapp_clicks' => \DB::raw('whatsapp_clicks + 1')]
        ));

        return response()->json(['message' => 'Click tracked']);
    }
}
