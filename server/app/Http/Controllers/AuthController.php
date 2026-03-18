<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        if (!Auth::attempt($request->only('username', 'password'))) {
            return response()->json(['message' => 'Sai thông tin'], 401);
        }

        $user = Auth::user()->load('nhanVien.chucVu');
        $token = $user->createToken('api-token')->plainTextToken;

        $nhanVien = $user->nhanVien;

        return response()->json([
            'token' => $token,
            'user' => [
                'SOTK'   => $user->SOTK,
                'TENTK'  => $user->TENTK,
                'EMAIL'  => $user->EMAIL,
                'MANV'   => $user->MANV,
                'TENNV'  => $nhanVien?->TENNV,
                'chucVu' => [
                    'MACHUCVU' => $nhanVien?->chucVu?->MACHUCVU,
                    'CODE' => $nhanVien?->chucVu?->CODE,
                    'TENCHUCVU' => $nhanVien?->chucVu?->TENCHUCVU,
                    'MOTA' => $nhanVien?->chucVu?->MOTA,
                ],
                'role' => $nhanVien?->chucVu?->CODE, // For convenience
            ],
        ]);
    }
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Logged out']);
    }

    /**
     * Get permissions for current user's role
     */
    public function getPermissions(Request $request)
    {
        $user = $request->user()->load('nhanVien.chucVu');
        $role = $user->nhanVien?->chucVu?->CODE;

        if (!$role) {
            return response()->json([
                'message' => 'Không tìm thấy thông tin vai trò',
            ], 403);
        }

        $permissions = \App\Constants\PermissionConstants::getPermissionsByRole($role);

        return response()->json([
            'role' => $role,
            'role_name' => $user->nhanVien?->chucVu?->TENCHUCVU,
            'permissions' => $permissions,
            'total_permissions' => count($permissions),
        ]);
    }

    /**
     * Get permissions for a specific role (Admin only)
     */
    public function getRolePermissions(Request $request, string $roleCode)
    {
        // Check if user is manager
        $user = $request->user()->load('nhanVien.chucVu');
        $userRole = $user->nhanVien?->chucVu?->CODE;

        if ($userRole !== 'manager') {
            return response()->json([
                'message' => 'Bạn không có quyền xem permissons của role khác',
            ], 403);
        }

        // Get role
        $role = \App\Models\ChucVu::where('CODE', $roleCode)->first();

        if (!$role) {
            return response()->json([
                'message' => 'Không tìm thấy chức vụ',
            ], 404);
        }

        $permissions = \App\Constants\PermissionConstants::getPermissionsByRole($roleCode);

        return response()->json([
            'role' => $roleCode,
            'role_name' => $role->TENCHUCVU,
            'role_description' => $role->MOTA,
            'permissions' => $permissions,
            'total_permissions' => count($permissions),
        ]);
    }

}
