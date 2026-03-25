<?php

namespace App\Http\Controllers;

use App\Models\StoreInfo;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class StoreInfoController extends Controller
{
    /**
     * Get store information
     */
    public function index(): JsonResponse
    {
        $storeInfo = StoreInfo::first();

        if (!$storeInfo) {
            return response()->json([
                'success' => false,
                'message' => 'Store information not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $storeInfo
        ]);
    }

    /**
     * Create or update store information
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|max:20',
            'tax_code' => 'nullable|string|max:50',
            'note' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $storeInfo = StoreInfo::first();

        if ($storeInfo) {
            $storeInfo->update($request->all());
        } else {
            $storeInfo = StoreInfo::create($request->all());
        }

        return response()->json([
            'success' => true,
            'message' => 'Store information saved successfully',
            'data' => $storeInfo
        ]);
    }

    /**
     * Get specific store information
     */
    public function show($id): JsonResponse
    {
        $storeInfo = StoreInfo::find($id);

        if (!$storeInfo) {
            return response()->json([
                'success' => false,
                'message' => 'Store information not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $storeInfo
        ]);
    }

    /**
     * Update store information
     */
    public function update(Request $request, $id): JsonResponse
    {
        $storeInfo = StoreInfo::find($id);

        if (!$storeInfo) {
            return response()->json([
                'success' => false,
                'message' => 'Store information not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'address' => 'required|string|max:500',
            'phone' => 'required|string|max:20',
            'tax_code' => 'nullable|string|max:50',
            'note' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $storeInfo->update($request->all());

        return response()->json([
            'success' => true,
            'message' => 'Store information updated successfully',
            'data' => $storeInfo
        ]);
    }

    /**
     * Delete store information
     */
    public function destroy($id): JsonResponse
    {
        $storeInfo = StoreInfo::find($id);

        if (!$storeInfo) {
            return response()->json([
                'success' => false,
                'message' => 'Store information not found'
            ], 404);
        }

        $storeInfo->delete();

        return response()->json([
            'success' => true,
            'message' => 'Store information deleted successfully'
        ]);
    }
}
