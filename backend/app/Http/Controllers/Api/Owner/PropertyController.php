<?php

namespace App\Http\Controllers\Api\Owner;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PropertyController extends Controller
{
    public function index(Request $request)
    {
        $properties = $request->user()->properties()->with('facilities')->get();
        return response()->json($properties);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|in:putra,putri,campur',
            'price_monthly' => 'required|numeric',
            'price_yearly' => 'nullable|numeric',
            'address' => 'required|string',
            'area' => 'required|string',
            'latitude' => 'nullable|string',
            'longitude' => 'nullable|string',
            'whatsapp_number' => 'required|string',
            'main_image' => 'required|image|max:2048',
            'gallery'    => 'nullable|array|max:8',
            'gallery.*'  => 'image|max:2048',
            'facilities' => 'nullable|array',
        ]);

        $mainImagePath = $request->file('main_image')->store('properties/main', 'public');

        $property = Property::create([
            'owner_id' => $request->user()->id,
            'title' => $request->title,
            'slug' => Str::slug($request->title) . '-' . time(),
            'description' => $request->description,
            'type' => $request->type,
            'price_monthly' => $request->price_monthly,
            'price_yearly' => $request->price_yearly,
            'address' => $request->address,
            'area' => $request->area,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
            'whatsapp_number' => $request->whatsapp_number,
            'main_image'  => $mainImagePath,
            'gallery'     => [],
            'status'      => 'active',
        ]);

        // Upload gallery photos
        if ($request->hasFile('gallery')) {
            $galleryPaths = [];
            foreach ($request->file('gallery') as $file) {
                $galleryPaths[] = $file->store('properties/gallery', 'public');
            }
            $property->update(['gallery' => $galleryPaths]);
        }

        if ($request->has('facilities')) {
            $property->facilities()->sync($request->facilities);
        }

        return response()->json([
            'message' => 'Properti berhasil ditambahkan.',
            'property' => $property
        ]);
    }

    public function show(Request $request, $id)
    {
        $property = $request->user()->properties()->with('facilities')->findOrFail($id);
        return response()->json($property);
    }

    public function update(Request $request, $id)
    {
        $property = $request->user()->properties()->findOrFail($id);

        $request->validate([
            'title' => 'string|max:255',
            'status' => 'in:active,inactive',
            'price_monthly' => 'numeric',
            'whatsapp_number' => 'string',
        ]);

        $data = $request->except(['main_image', 'facilities']);
        
        if ($request->has('title')) {
            $data['slug'] = Str::slug($request->title) . '-' . time();
        }

        if ($request->hasFile('main_image')) {
            $data['main_image'] = $request->file('main_image')->store('properties/main', 'public');
        }

        $property->update($data);

        if ($request->has('facilities')) {
            $property->facilities()->sync($request->facilities);
        }

        return response()->json([
            'message' => 'Properti berhasil diperbarui.',
            'property' => $property
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $property = $request->user()->properties()->findOrFail($id);
        $property->delete();

        return response()->json(['message' => 'Properti berhasil dihapus.']);
    }

    public function stats(Request $request)
    {
        $propertyIds = $request->user()->properties()->pluck('id');
        
        $stats = \App\Models\PropertyStat::whereIn('property_id', $propertyIds)
            ->orderBy('date', 'desc')
            ->get();
            
        return response()->json($stats);
    }
}
