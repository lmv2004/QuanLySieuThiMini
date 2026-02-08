<?php

namespace App\Providers;

use App\Models\TaiKhoan;
use Illuminate\Auth\EloquentUserProvider;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Support\Facades\Hash;

class TaiKhoanUserProvider extends EloquentUserProvider
{
    /**
     * Retrieve a user by the given credentials.
     *
     * @param  array  $credentials
     * @return \Illuminate\Contracts\Auth\Authenticatable|null
     */
    public function retrieveByCredentials(array $credentials)
    {
        if (empty($credentials) ||
            (count($credentials) === 1 &&
             array_key_exists('password', $credentials))) {
            return;
        }

        // Query builder
        $query = $this->newModelQuery();

        foreach ($credentials as $key => $value) {
            if ($key === 'MATKHAU' || $key === 'password') {
                continue;
            }

            // Hỗ trợ login bằng TENTK
            if ($key === 'TENTK') {
                $query->where('TENTK', $value);
            } else {
                $query->where($key, $value);
            }
        }

        // Chỉ lấy tài khoản active
        $query->where('IS_DELETED', false)
              ->where('KHOA_TK', false);

        return $query->first();
    }

    /**
     * Validate a user against the given credentials.
     *
     * @param  \Illuminate\Contracts\Auth\Authenticatable  $user
     * @param  array  $credentials
     * @return bool
     */
    public function validateCredentials(Authenticatable $user, array $credentials)
    {
        // Hỗ trợ cả MATKHAU và password field
        $plain = $credentials['MATKHAU'] ?? $credentials['password'] ?? null;

        if (is_null($plain)) {
            return false;
        }

        return Hash::check($plain, $user->getAuthPassword());
    }
}
