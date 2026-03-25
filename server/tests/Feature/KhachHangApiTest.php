<?php

use App\Models\KhachHang;

beforeEach(function (): void {
    $this->withoutMiddleware();
});

test('index returns only active customers', function () {
    KhachHang::factory()->create(['TENKH' => 'Active Customer', 'IS_DELETED' => 0]);
    KhachHang::factory()->create(['TENKH' => 'Deleted Customer', 'IS_DELETED' => 1]);

    $response = $this->getJson('/api/customers');

    $response
        ->assertOk()
        ->assertJsonPath('data.0.TENKH', 'Active Customer');

    expect(collect($response->json('data'))->pluck('TENKH')->all())
        ->not()->toContain('Deleted Customer');
});

test('store creates customer with default diemthuong', function () {
    $payload = [
        'TENKH' => 'Nguyen Van Test',
        'SODIENTHOAI' => '0912345678',
        'DIACHI' => 'Ho Chi Minh',
    ];

    $response = $this->postJson('/api/customers', $payload);

    $response
        ->assertOk()
        ->assertJsonPath('TENKH', 'Nguyen Van Test')
        ->assertJsonPath('DIEMTHUONG', 0);

    $this->assertDatabaseHas('khach_hangs', [
        'TENKH' => 'Nguyen Van Test',
        'SODIENTHOAI' => '0912345678',
        'DIEMTHUONG' => 0,
        'IS_DELETED' => 0,
    ]);
});

test('show returns 404 for soft deleted customer', function () {
    $customer = KhachHang::factory()->create(['IS_DELETED' => 1]);

    $this->getJson('/api/customers/'.$customer->MAKH)
        ->assertNotFound();
});

test('update accepts same phone number of current customer', function () {
    $customer = KhachHang::factory()->create([
        'TENKH' => 'Old Name',
        'SODIENTHOAI' => '0987654321',
    ]);

    $payload = [
        'TENKH' => 'New Name',
        'SODIENTHOAI' => '0987654321',
    ];

    $response = $this->putJson('/api/customers/'.$customer->MAKH, $payload);

    $response
        ->assertOk()
        ->assertJsonPath('TENKH', 'New Name')
        ->assertJsonPath('SODIENTHOAI', '0987654321');
});

test('update rejects duplicate phone number from another customer', function () {
    $existing = KhachHang::factory()->create(['SODIENTHOAI' => '0901111111']);
    $target = KhachHang::factory()->create(['SODIENTHOAI' => '0902222222']);

    $response = $this->putJson('/api/customers/'.$target->MAKH, [
        'SODIENTHOAI' => $existing->SODIENTHOAI,
    ]);

    $response
        ->assertUnprocessable()
        ->assertJsonValidationErrors(['SODIENTHOAI']);
});

test('destroy performs soft delete and returns no content', function () {
    $customer = KhachHang::factory()->create(['IS_DELETED' => 0]);

    $this->deleteJson('/api/customers/'.$customer->MAKH)
        ->assertNoContent();

    $this->assertDatabaseHas('khach_hangs', [
        'MAKH' => $customer->MAKH,
        'IS_DELETED' => 1,
    ]);
});

test('vietnamese route alias works for khach hang endpoints', function () {
    $customer = KhachHang::factory()->create(['TENKH' => 'Alias Test']);

    $this->getJson('/api/khach-hang/'.$customer->MAKH)
        ->assertOk()
        ->assertJsonPath('TENKH', 'Alias Test');
});
