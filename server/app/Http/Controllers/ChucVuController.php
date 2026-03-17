<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreChucVuRequest;
use App\Http\Requests\UpdateChucVuRequest;
use App\Http\Resources\ChucVuResource;
use App\Models\ChucVu;
use Illuminate\Http\Request;

class ChucVuController extends Controller
{
    /**
     * Display a listing of the resource with pagination and search.
     */
    public function index(Request $request)
    {
        $query = ChucVu::active();

        // Tìm kiếm theo tên chức vụ
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where('TENCHUCVU', 'like', '%' . $search . '%');
        }

        // Phân trang (mặc định 15 items/page)
        $perPage = $request->input('per_page', 15);
        $positions = $query->paginate($perPage);

        return ChucVuResource::collection($positions);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreChucVuRequest $request)
    {
        $data = $request->validated();
        $position = ChucVu::create($data);
        return new ChucVuResource($position);
    }

    /**
     * Display the specified resource.
     */
    public function show(ChucVu $position)
    {
        abort_if($position->IS_DELETED, 404);
        return new ChucVuResource($position);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateChucVuRequest $request, ChucVu $position)
    {
        $data = $request->validated();
        $position->update($data);
        return new ChucVuResource($position);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ChucVu $position)
    {
        $position->IS_DELETED = true;
        $position->save();
        return response()->noContent();
    }
}
