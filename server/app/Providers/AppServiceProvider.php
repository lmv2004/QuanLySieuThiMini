<?php

namespace App\Providers;

use App\Models\SanPham;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::bind('product', function ($value) {
            return SanPham::where('IS_DELETED', false)->findOrFail($value);
        });
    }
}
