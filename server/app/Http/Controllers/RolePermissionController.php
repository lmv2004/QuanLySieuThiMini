<?php

namespace App\Http\Controllers;

use App\Models\ChucVu;
use App\Models\Permission;
use Illuminate\Http\Request;

class RolePermissionController extends Controller
{
    /**
     * Lấy danh sách permissions đang được gán cho 1 chức vụ
     * GET /api/positions/{position}/permissions
     */
    public function index(ChucVu $position)
    {
        $assignedIds = $position->permissions()
            ->pluck('permissions.MAPERMISSION')
            ->toArray();

        return response()->json([
            'data' => [
                'MACHUCVU'       => $position->MACHUCVU,
                'TENCHUCVU'      => $position->TENCHUCVU,
                'permission_ids' => $assignedIds,
            ],
        ]);
    }

    /**
     * Đồng bộ (sync) permissions cho 1 chức vụ
     * PUT /api/positions/{position}/permissions
     * Body: { "permission_ids": [1, 2, 3] }
     */
    public function sync(Request $request, ChucVu $position)
    {
        $request->validate([
            'permission_ids'   => 'required|array',
            'permission_ids.*' => 'integer|exists:permissions,MAPERMISSION',
        ]);

        $ids = $request->input('permission_ids', []);

        // Chỉ gán những permissions đang active
        $validIds = Permission::active()
            ->whereIn('MAPERMISSION', $ids)
            ->pluck('MAPERMISSION')
            ->toArray();

        $position->permissions()->sync($validIds);

        $assignedCount = count($validIds);

        return response()->json([
            'message' => "Đã cập nhật {$assignedCount} quyền cho chức vụ '{$position->TENCHUCVU}'",
            'data'    => [
                'MACHUCVU'       => $position->MACHUCVU,
                'TENCHUCVU'      => $position->TENCHUCVU,
                'permission_ids' => $validIds,
            ],
        ]);
    }
}
