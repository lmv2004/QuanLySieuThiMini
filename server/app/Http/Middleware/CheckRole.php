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
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json(['message' => 'Chưa xác thực'], 401);
        }

        $user = $request->user()->load('nhanVien.chucVu');
        $userRole = $user->nhanVien?->chucVu?->CODE;

        if (!$userRole || !in_array($userRole, $roles)) {
            return response()->json(['message' => 'Bạn không có quyền truy cập tài nguyên này'], 403);
        }

        return $next($request);
    }
}
