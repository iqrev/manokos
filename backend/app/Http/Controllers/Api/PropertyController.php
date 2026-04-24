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
            
        // Filter by Facilities
        if ($request->has('facilities') && $request->facilities != '') {
            $facilitiesArray = explode(',', $request->facilities);
            foreach ($facilitiesArray as $facilityId) {
                $query->whereHas('facilities', function ($q) use ($facilityId) {
                    $q->where('facilities.id', $facilityId);
                });
            }
        }

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

        // Filter / Sort by Lat Long radius (Haversine Formula)
        if ($request->has('lat') && $request->has('lng')) {
            $lat = (float) $request->lat;
            $lng = (float) $request->lng;
            $query->selectRaw("properties.*, ( 6371 * acos( cos( radians(?) ) * cos( radians( latitude ) ) * cos( radians( longitude ) - radians(?) ) + sin( radians(?) ) * sin( radians( latitude ) ) ) ) AS distance", [$lat, $lng, $lat])
                  ->having('distance', '<', 20) // max radius 20km
                  ->orderBy('distance', 'asc');
        } else {
            // Sort: Boosted first, then by latest
            $query->orderBy('is_boosted', 'desc')
                  ->orderBy('created_at', 'desc');
        }

        $properties = $query->paginate($request->get('per_page', 12));

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

    public function report(Request $request, $id)
    {
        $request->validate([
            'reason' => 'required|string|max:100',
            'details' => 'nullable|string',
        ]);

        $property = Property::findOrFail($id);

        \App\Models\Report::create([
            'property_id' => $property->id,
            'reason' => $request->reason,
            'details' => $request->details,
            'status' => 'pending'
        ]);

        return response()->json(['message' => 'Laporan berhasil dikirim dan akan ditinjau.']);
    }
}
