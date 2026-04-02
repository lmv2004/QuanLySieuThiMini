<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNhanVienRequest;
use App\Http\Requests\UpdateNhanVienRequest;
use App\Http\Resources\NhanVienResource;
use App\Models\NhanVien;
use Illuminate\Http\Request;

class NhanVienController extends Controller
{
    /**
     * Display a listing of the resource with pagination, search and eager loading.
     */
    public function index(Request $request)
    {
        $query = NhanVien::active()
            ->whereHas('chucVu', function ($q) {
                $q->where('CODE', '!=', 'ADMIN');
            })
            ->latest()
            ->with('chucVu');

        // Tìm kiếm theo tên, CCCD, số điện thoại hoặc email
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('TENNV', 'like', '%' . $search . '%')
                  ->orWhere('CCCD', 'like', '%' . $search . '%')
                  ->orWhere('SODIENTHOAI', 'like', '%' . $search . '%')
                  ->orWhere('EMAIL', 'like', '%' . $search . '%');
            });
        }

        // Lọc nhân viên chưa có tài khoản (hoặc tài khoản cũ đã bị xóa)
        if ($request->has('without_account')) {
            $query->whereDoesntHave('taiKhoan', function ($q) {
                $q->where('IS_DELETED', 0);
            });
        }

        // Lọc theo chức vụ
        if ($request->has('MACHUCVU')) {
            $query->where('MACHUCVU', $request->input('MACHUCVU'));
        }

        // Phân trang (mặc định 15 items/page)
        $perPage = $request->input('per_page', 15);
        $employees = $query->paginate($perPage);

        return NhanVienResource::collection($employees);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreNhanVienRequest $request)
    {
        $data = $request->validated();
        $employee = NhanVien::create($data);
        $employee->load('chucVu');
        return new NhanVienResource($employee);
    }

    /**
     * Display the specified resource with eager loading.
     */
    public function show(NhanVien $employee)
    {
        abort_if($employee->IS_DELETED, 404);
        $employee->load('chucVu');
        return new NhanVienResource($employee);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateNhanVienRequest $request, NhanVien $employee)
    {
        $data = $request->validated();
        $employee->update($data);
        $employee->load('chucVu');
        return new NhanVienResource($employee);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(NhanVien $employee)
    {
        $employee->IS_DELETED = true;
        $employee->save();
        return response()->noContent();
    }
}
