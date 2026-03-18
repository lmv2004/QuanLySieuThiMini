<?php
/**
 * Test Database-Driven RBAC System
 */

require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "\n========================================\n";
echo "   DATABASE-DRIVEN RBAC TEST\n";
echo "========================================\n\n";

// 1. Test Permissions Table
echo "1️⃣  PERMISSIONS TABLE\n";
echo "─────────────────────────────────────\n";
$perms = \App\Models\Permission::active()->get();
echo "Total permissions: {$perms->count()}\n\n";

$modules = \App\Models\Permission::active()
    ->select('MODULE')
    ->distinct()
    ->whereNotNull('MODULE')
    ->pluck('MODULE')
    ->unique()
    ->sort();

echo "Modules:\n";
foreach ($modules as $module) {
    $count = \App\Models\Permission::active()
        ->where('MODULE', $module)
        ->count();
    echo "  • {$module}: {$count} permissions\n";
}

// 2. Test Role Relationships
echo "\n2️⃣  ROLE-PERMISSION RELATIONSHIPS\n";
echo "─────────────────────────────────────\n";

$roles = \App\Models\ChucVu::active()->get();
foreach ($roles as $role) {
    $permCount = $role->permissions->count();
    echo "  [{$role->CODE}] {$role->TENCHUCVU}\n";
    echo "     ✓ {$permCount} permissions\n";

    // Show sample permissions
    $samples = $role->permissions->take(3)->pluck('CODE');
    echo "     Samples: " . implode(', ', $samples->toArray()) . "\n";
}

// 3. Test hasPermission Method
echo "\n3️⃣  TESTING hasPermission() METHOD\n";
echo "─────────────────────────────────────\n";

$manager = \App\Models\ChucVu::where('CODE', 'manager')->first();
$cashier = \App\Models\ChucVu::where('CODE', 'cashier')->first();

if ($manager && $cashier) {
    echo "Manager:\n";
    echo "  hasPermission('employees.create'): " . ($manager->hasPermission('employees.create') ? '✅' : '❌') . "\n";
    echo "  hasPermission('vouchers.view'): " . ($manager->hasPermission('vouchers.view') ? '✅' : '❌') . "\n";
    echo "  hasPermission('*'): " . ($manager->hasPermission('*') ? '✅' : '❌') . "\n";

    echo "\nCashier:\n";
    echo "  hasPermission('invoices.create'): " . ($cashier->hasPermission('invoices.create') ? '✅' : '❌') . "\n";
    echo "  hasPermission('employees.create'): " . ($cashier->hasPermission('employees.create') ? '✅' : '❌') . "\n";
    echo "  hasPermission('vouchers.view'): " . ($cashier->hasPermission('vouchers.view') ? '✅' : '❌') . "\n";
}

// 4. Test hasAnyPermission
echo "\n4️⃣  TESTING hasAnyPermission() METHOD\n";
echo "─────────────────────────────────────\n";

if ($cashier) {
    $result = $cashier->hasAnyPermission('employees.create', 'invoices.create', 'products.view');
    echo "Cashier hasAnyPermission('employees.create', 'invoices.create', 'products.view'):\n";
    echo "  Result: " . ($result ? '✅ true' : '❌ false') . "\n";
    echo "  Expected: ✅ true (has invoices.create)\n";
}

// 5. Test User Role Access
echo "\n5️⃣  TESTING USER ROLE ACCESS\n";
echo "─────────────────────────────────────\n";

$users = \App\Models\TaiKhoan::with('nhanVien.chucVu.permissions')->take(3)->get();
foreach ($users as $user) {
    $role = $user->nhanVien?->chucVu;
    if ($role) {
        echo "User: {$user->TENTK}\n";
        echo "  Role: {$role->CODE}\n";
        echo "  Permissions: {$role->permissions->count()}\n";

        // Test access
        if ($role->CODE === 'cashier') {
            echo "  Can create invoice: " . ($role->hasPermission('invoices.create') ? '✅' : '❌') . "\n";
            echo "  Can manage employees: " . ($role->hasPermission('employees.create') ? '✅' : '❌') . "\n";
        }
    }
}

// 6. Test Permission Sync
echo "\n6️⃣  TESTING PERMISSION MANAGEMENT METHODS\n";
echo "─────────────────────────────────────────\n";

// Create test role
$testRole = \App\Models\ChucVu::create([
    'CODE' => 'test_role_' . time(),
    'TENCHUCVU' => 'Test Role',
    'MOTA' => 'Testing permission management',
]);

echo "Created test role: {$testRole->CODE}\n";
echo "  Initial permissions: " . $testRole->permissions->count() . "\n";

// Grant single permission
$testRole->grantPermission('employees.view');
echo "  After grantPermission('employees.view'): " . $testRole->permissions->count() . "\n";

// Add more permissions
$testRole->grantPermission('products.view');
echo "  After grantPermission('products.view'): " . $testRole->permissions->count() . "\n";

// Revoke permission
$testRole->revokePermission('employees.view');
echo "  After revokePermission('employees.view'): " . $testRole->permissions->count() . "\n";

// Sync permissions
$testRole->syncPermissions('invoices.view', 'invoices.create');
echo "  After syncPermissions([invoices.view, invoices.create]): " . $testRole->permissions->count() . "\n";

$testRole->delete();
echo "  Deleted test role\n";

// 7. Summary
echo "\n7️⃣  SUMMARY\n";
echo "─────────────────────────────────────\n";
$totalPerms = \App\Models\Permission::active()->count();
$totalRoles = \App\Models\ChucVu::active()->count();
$totalAssignments = \App\Models\ChucVu::active()
    ->withCount('permissions')
    ->get()
    ->sum('permissions_count');

echo "  Total Permissions: {$totalPerms}\n";
echo "  Total Roles: {$totalRoles}\n";
echo "  Total Assignments: {$totalAssignments}\n";
echo "  Average per role: " . round($totalAssignments / $totalRoles, 2) . "\n";

// Check integrity
$orphanedAssignments = \DB::table('role_permissions')
    ->leftJoin('chuc_vus', 'role_permissions.MACHUCVU', '=', 'chuc_vus.MACHUCVU')
    ->whereNull('chuc_vus.MACHUCVU')
    ->count();

echo "\n  Orphaned assignments: {$orphanedAssignments}\n";
if ($orphanedAssignments === 0) {
    echo "  ✅ Database integrity OK\n";
}

echo "\n========================================\n";
echo "   TEST COMPLETED\n";
echo "========================================\n\n";
