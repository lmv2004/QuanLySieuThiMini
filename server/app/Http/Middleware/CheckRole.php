<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * Usage: Route::middleware('role:manager')->group(...)
     *        Route::middleware('role:manager,cashier')->group(...)
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $roles): Response
    {
        if (!$request->user()) {
            return response()->json([
                'message' => 'Chưa xác thực',
                'status' => 'unauthenticated'
            ], 401);
        }

        // Load user dengan vai trò
        $user = $request->user()->load('nhanVien.chucVu');
        $userRole = $user->nhanVien?->chucVu?->CODE;

        if (!$userRole) {
            return response()->json([
                'message' => 'Không tìm thấy thông tin vai trò của người dùng',
                'status' => 'role_not_found'
            ], 403);
        }

        // Parse roles từ parameter (comma-separated)
        $allowedRoles = array_map('trim', explode(',', $roles));

        if (!in_array($userRole, $allowedRoles)) {
            return response()->json([
                'message' => 'Bạn không có quyền truy cập tài nguyên này',
                'user_role' => $userRole,
                'required_roles' => $allowedRoles,
                'status' => 'insufficient_role'
            ], 403);
        }

        // Attach user role và permissions
        $request->merge([
            'user_role' => $userRole,
            'user_permissions' => $user->nhanVien?->chucVu?->permissions()->pluck('CODE')->toArray() ?? [],
        ]);

        return $next($request);
    }
}
