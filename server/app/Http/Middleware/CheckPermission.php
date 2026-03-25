<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * Usage: Route::middleware('permission:employees.create')->group(...)
     *        Route::middleware('permission:employees.view,employees.create')->group(...)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permissions): Response
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Chưa xác thực',
                'status' => 'unauthenticated'
            ], 401);
        }

        $user = $request->user()->load('nhanVien.chucVu');
        $chucVu = $user->nhanVien?->chucVu;

        if (!$chucVu) {
            return response()->json([
                'message' => 'Không tìm thấy thông tin vai trò',
                'status' => 'role_not_found'
            ], 403);
        }

        // Parse permissions từ parameter
        $requiredPermissions = array_map('trim', explode(',', $permissions));

        // Kiểm tra quyền - chỉ cần 1 quyền khớp là được
        $hasPermission = false;
        foreach ($requiredPermissions as $permission) {
            if ($chucVu->hasPermission($permission)) {
                $hasPermission = true;
                break;
            }
        }

        if (!$hasPermission) {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện hành động này',
                'required_permission' => count($requiredPermissions) === 1 ? $requiredPermissions[0] : $requiredPermissions,
                'status' => 'permission_denied'
            ], 403);
        }

        return $next($request);
    }
}
