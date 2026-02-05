<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LoginDetail>
 */
class LoginDetailFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'SOTK' => \App\Models\TaiKhoan::factory(),
            'IP_ADDRESS' => fake()->ipv4(),
            'LOGIN_TIME' => fake()->dateTimeBetween('-1 month', 'now'),
            'LOGOUT_TIME' => fake()->optional()->dateTimeBetween('-1 month', 'now'),
        ];
    }
}
