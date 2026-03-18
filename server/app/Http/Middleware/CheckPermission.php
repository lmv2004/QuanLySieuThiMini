<?php

namespace App\Http\Middleware;

use App\Constants\PermissionConstants;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermission
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Chưa xác thực'], 401);
        }

        $user = $request->user()->load('nhanVien.chucVu');
        $userRole = $user->nhanVien?->chucVu?->CODE;

        if (!$userRole) {
            return response()->json(['message' => 'Không tìm thấy thông tin vai trò'], 403);
        }

        if (!PermissionConstants::hasPermission($userRole, $permission)) {
            return response()->json([
                'message' => 'Bạn không có quyền thực hiện hành động này',
                'required_permission' => $permission,
            ], 403);
        }

        return $next($request);
    }
}
