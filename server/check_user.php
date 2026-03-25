<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();
$u = App\Models\TaiKhoan::first();
if($u) {
    echo 'TENTK: ' . $u->TENTK . PHP_EOL;
    echo 'EMAIL: ' . $u->EMAIL . PHP_EOL;
    echo 'MANV: ' . $u->MANV . PHP_EOL;
} else {
    echo 'No user found' . PHP_EOL;
}
