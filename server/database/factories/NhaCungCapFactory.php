<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NhaCungCap>
 */
class NhaCungCapFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'TENNCC' => fake()->company(),
            'DIACHI' => fake()->address(),
            'SDT' => fake()->numerify('0##########'),
            'EMAIL' => fake()->companyEmail(),
            'IS_DELETED' => 0,
        ];
    }
}
