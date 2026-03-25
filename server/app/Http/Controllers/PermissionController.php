<?php

namespace App\Http\Controllers;

use App\Models\Permission;
use Illuminate\Http\Request;

class PermissionController extends Controller
{
    /**
     * Danh sách tất cả permissions, nhóm theo MODULE
     */
    public function index(Request $request)
    {
        $permissions = Permission::active()
            ->orderBy('MODULE')
            ->orderBy('ACTION')
            ->get();

        // Group theo module
        $grouped = $permissions->groupBy('MODULE')->map(function ($items, $module) {
            return [
                'module' => $module,
                'permissions' => $items->map(fn($p) => [
                    'MAPERMISSION' => $p->MAPERMISSION,
                    'CODE'         => $p->CODE,
                    'NAME'         => $p->NAME,
                    'DESCRIPTION'  => $p->DESCRIPTION,
                    'MODULE'       => $p->MODULE,
                    'ACTION'       => $p->ACTION,
                ]),
            ];
        })->values();

        return response()->json([
            'data' => $grouped,
            'total' => $permissions->count(),
        ]);
    }

    /**
     * Chi tiết 1 permission
     */
    public function show(Permission $permission)
    {
        return response()->json(['data' => $permission]);
    }
}
