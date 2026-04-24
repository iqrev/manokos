<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Facility;

class FacilityController extends Controller
{
    public function index()
    {
        $facilities = \Illuminate\Support\Facades\Cache::remember('facilities', 86400, function () {
            return Facility::all();
        });

        return response()->json($facilities);
    }
}
