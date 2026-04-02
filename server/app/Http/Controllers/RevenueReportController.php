<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\HoaDon;
use App\Models\CTHoaDon;
use Illuminate\Support\Facades\DB;

class RevenueReportController extends Controller
{
    /**
     * Báo cáo tổng quát doanh thu
     * GET /api/reports/revenue/summary
     */
    public function summary(Request $request)
    {
        $year = $request->query('year', now()->year);

        // Tổng doanh thu theo tháng trong năm
        $monthlyRevenue = HoaDon::whereYear('NGAYHD', $year)
            ->where('TRANGTHAI', 1)
            ->selectRaw('MONTH(NGAYHD) as month, SUM(TONG_THANHTOAN) as total')
            ->groupByRaw('MONTH(NGAYHD)')
            ->orderBy('month')
            ->get()
            ->map(fn($item) => [
                'month' => (int)$item->month,
                'total' => (float)$item->total,
            ]);

        // Tổng doanh thu năm
        $yearlyTotal = HoaDon::whereYear('NGAYHD', $year)
            ->where('TRANGTHAI', 1)
            ->sum('TONG_THANHTOAN');

        // Số lượng hóa đơn
        $invoiceCount = HoaDon::whereYear('NGAYHD', $year)
            ->where('TRANGTHAI', 1)
            ->count();

        // Doanh thu trung bình mỗi hóa đơn
        $avgRevenue = $invoiceCount > 0 ? $yearlyTotal / $invoiceCount : 0;

        return response()->json([
            'year' => $year,
            'yearlyTotal' => (float)$yearlyTotal,
            'invoiceCount' => $invoiceCount,
            'avgRevenue' => (float)$avgRevenue,
            'monthlyRevenue' => $monthlyRevenue,
        ]);
    }

    /**
     * Báo cáo theo tháng
     * GET /api/reports/revenue/monthly?year=2026&month=3
     */
    public function monthly(Request $request)
    {
        $year = $request->query('year', now()->year);
        $month = $request->query('month', now()->month);

        // Doanh thu theo ngày trong tháng
        $dailyRevenue = HoaDon::whereYear('NGAYHD', $year)
            ->whereMonth('NGAYHD', $month)
            ->where('TRANGTHAI', 1)
            ->selectRaw('DATE(NGAYHD) as date, SUM(TONG_THANHTOAN) as total, COUNT(*) as count')
            ->groupByRaw('DATE(NGAYHD)')
            ->orderBy('date')
            ->get()
            ->map(fn($item) => [
                'date' => $item->date,
                'total' => (float)$item->total,
                'count' => (int)$item->count,
            ]);

        // Tổng doanh thu tháng
        $monthlyTotal = HoaDon::whereYear('NGAYHD', $year)
            ->whereMonth('NGAYHD', $month)
            ->where('TRANGTHAI', 1)
            ->sum('TONG_THANHTOAN');

        // Số lượng hóa đơn
        $invoiceCount = HoaDon::whereYear('NGAYHD', $year)
            ->whereMonth('NGAYHD', $month)
            ->where('TRANGTHAI', 1)
            ->count();

        // Doanh thu cao nhất và thấp nhất trong ngày
        $maxDay = $dailyRevenue->max('total') ?? 0;
        $minDay = $dailyRevenue->filter(fn($d) => $d['total'] > 0)->min('total') ?? 0;

        return response()->json([
            'year' => $year,
            'month' => $month,
            'monthlyTotal' => (float)$monthlyTotal,
            'invoiceCount' => $invoiceCount,
            'avgPerDay' => $dailyRevenue->count() > 0 ? $monthlyTotal / $dailyRevenue->count() : 0,
            'maxDayRevenue' => (float)$maxDay,
            'minDayRevenue' => (float)$minDay,
            'dailyRevenue' => $dailyRevenue,
        ]);
    }

    /**
     * Báo cáo theo năm
     * GET /api/reports/revenue/yearly?startYear=2023&endYear=2026
     */
    public function yearly(Request $request)
    {
        $startYear = $request->query('startYear', now()->year - 2);
        $endYear = $request->query('endYear', now()->year);

        // Doanh thu theo năm
        $yearlyRevenue = HoaDon::whereBetween(DB::raw('YEAR(NGAYHD)'), [$startYear, $endYear])
            ->where('TRANGTHAI', 1)
            ->selectRaw('YEAR(NGAYHD) as year, SUM(TONG_THANHTOAN) as total, COUNT(*) as count')
            ->groupByRaw('YEAR(NGAYHD)')
            ->orderBy('year')
            ->get()
            ->map(fn($item) => [
                'year' => (int)$item->year,
                'total' => (float)$item->total,
                'invoiceCount' => (int)$item->count,
                'avgPerInvoice' => (int)$item->count > 0 ? (float)$item->total / (int)$item->count : 0,
            ]);

        // Tổng cộng toàn bộ
        $totalAll = $yearlyRevenue->sum('total');

        return response()->json([
            'startYear' => $startYear,
            'endYear' => $endYear,
            'totalAll' => (float)$totalAll,
            'yearlyRevenue' => $yearlyRevenue,
        ]);
    }

    /**
     * Báo cáo nâng cao với nhiều filters
     * GET /api/reports/revenue/advanced
     * Query params: startDate, endDate, paymentMethod, productId, customerId
     */
    public function advanced(Request $request)
    {
        $startDate = $request->query('startDate');
        $endDate = $request->query('endDate');
        $paymentMethod = $request->query('paymentMethod');
        $productId = $request->query('productId');
        $customerId = $request->query('customerId');

        $query = HoaDon::where('TRANGTHAI', 1);

        // Filter by date range
        if ($startDate) {
            $query->whereDate('NGAYHD', '>=', $startDate);
        }
        if ($endDate) {
            $query->whereDate('NGAYHD', '<=', $endDate);
        }

        // Filter by payment method
        if ($paymentMethod) {
            $query->where('HINHTHUC', $paymentMethod);
        }

        // Filter by customer
        if ($customerId) {
            $query->where('MAKH', $customerId);
        }

        // Get all invoices matching filters
        $invoices = $query->with(['chiTiets', 'khachHang', 'nhanVien'])
            ->orderBy('NGAYHD', 'desc')
            ->get();

        // If productId filter, filter by product in details
        if ($productId) {
            $invoices = $invoices->filter(function($invoice) use ($productId) {
                return $invoice->chiTiets->contains('MASP', $productId);
            });
        }

        // Calculate summary
        $totalRevenue = (float)$invoices->sum('TONG_THANHTOAN');
        $totalDiscount = (float)$invoices->sum('TIEN_GIAM_VOUCHER');
        $invoiceCount = $invoices->count();

        // Revenue by payment method
        $byPaymentMethod = $invoices->groupBy('HINHTHUC')
            ->map(fn($group) => [
                'method' => $group->first()->HINHTHUC,
                'total' => (float)$group->sum('TONG_THANHTOAN'),
                'count' => $group->count(),
            ])
            ->values();

        // Top products
        $topProducts = [];
        $productSales = [];
        foreach ($invoices as $invoice) {
            foreach ($invoice->chiTiets as $detail) {
                $key = $detail->MASP;
                if (!isset($productSales[$key])) {
                    $productSales[$key] = [
                        'MASP' => $detail->MASP,
                        'TENSP' => $detail->TENSP ?? 'Unknown',
                        'quantity' => 0,
                        'revenue' => 0,
                    ];
                }
                $productSales[$key]['quantity'] += $detail->SOLUONG ?? 0;
                $productSales[$key]['revenue'] += (float)($detail->THANHTIEN ?? 0);
            }
        }
        $topProducts = array_values(array_sort($productSales, function($a, $b) {
            return $b['revenue'] <=> $a['revenue'];
        }));
        $topProducts = array_slice($topProducts, 0, 10);

        return response()->json([
            'filters' => [
                'startDate' => $startDate,
                'endDate' => $endDate,
                'paymentMethod' => $paymentMethod,
                'productId' => $productId,
                'customerId' => $customerId,
            ],
            'summary' => [
                'totalRevenue' => $totalRevenue,
                'totalDiscount' => $totalDiscount,
                'invoiceCount' => $invoiceCount,
                'avgPerInvoice' => $invoiceCount > 0 ? $totalRevenue / $invoiceCount : 0,
            ],
            'byPaymentMethod' => $byPaymentMethod,
            'topProducts' => $topProducts,
            'invoices' => $invoices->map(fn($inv) => [
                'MAHD' => $inv->MAHD,
                'NGAYHD' => $inv->NGAYHD,
                'HINHTHUC' => $inv->HINHTHUC,
                'TONG_THANHTOAN' => (float)$inv->TONG_THANHTOAN,
                'TIEN_GIAM_VOUCHER' => (float)$inv->TIEN_GIAM_VOUCHER,
                'khachHang' => $inv->khachHang?->TENKH ?? 'Walk-in',
                'nhanVien' => $inv->nhanVien?->TENNV ?? 'Unknown',
            ]),
        ]);
    }

    /**
     * Doanh thu theo giờ trong ngày (phân tích 24h)
     * GET /api/reports/revenue/hourly?date=2026-03-31
     */
    public function hourly(Request $request)
    {
        $date = $request->query('date', now()->format('Y-m-d'));

        $hourlyRevenue = HoaDon::whereDate('NGAYHD', $date)
            ->where('TRANGTHAI', 1)
            ->selectRaw('HOUR(NGAYHD) as hour, SUM(TONG_THANHTOAN) as total, COUNT(*) as count')
            ->groupByRaw('HOUR(NGAYHD)')
            ->orderBy('hour')
            ->get()
            ->map(fn($item) => [
                'hour' => (int)$item->hour,
                'total' => (float)$item->total,
                'count' => (int)$item->count,
                'label' => str_pad((int)$item->hour, 2, '0', STR_PAD_LEFT) . ':00',
            ]);

        // Fill missing hours with 0
        $fullHours = [];
        for ($i = 0; $i < 24; $i++) {
            $existing = $hourlyRevenue->firstWhere('hour', $i);
            $fullHours[] = $existing ?? [
                'hour' => $i,
                'total' => 0,
                'count' => 0,
                'label' => str_pad($i, 2, '0', STR_PAD_LEFT) . ':00',
            ];
        }

        $totalDay = collect($fullHours)->sum('total');
        $busiestHour = collect($fullHours)->sortByDesc('total')->first();

        return response()->json([
            'date' => $date,
            'totalDay' => (float)$totalDay,
            'busiestHour' => $busiestHour,
            'hourlyRevenue' => $fullHours,
        ]);
    }

    /**
     * Doanh thu theo loại sản phẩm
     * GET /api/reports/revenue/by-category?year=2026&month=3
     */
    public function byCategory(Request $request)
    {
        $year = $request->query('year', now()->year);
        $month = $request->query('month', now()->month);

        $query = DB::table('cthoadons')
            ->join('sanphams', 'cthoadons.MASP', '=', 'sanphams.MASP')
            ->join('loaisanphams', 'sanphams.MALOAI', '=', 'loaisanphams.MALOAI')
            ->join('hoadons', 'cthoadons.MAHD', '=', 'hoadons.MAHD')
            ->where('hoadons.TRANGTHAI', 1)
            ->whereYear('hoadons.NGAYHD', $year)
            ->whereMonth('hoadons.NGAYHD', $month)
            ->selectRaw('loaisanphams.TENLOAI as category, SUM(cthoadons.SOLUONG) as quantity, SUM(cthoadons.THANHTIEN) as total')
            ->groupBy('loaisanphams.TENLOAI')
            ->orderByDesc('total')
            ->get();

        $categoryData = $query->map(fn($item) => [
            'category' => $item->category,
            'quantity' => (int)$item->quantity,
            'total' => (float)$item->total,
        ]);

        $totalRevenue = $categoryData->sum('total');

        return response()->json([
            'year' => $year,
            'month' => $month,
            'totalRevenue' => (float)$totalRevenue,
            'categories' => $categoryData,
        ]);
    }

    /**
     * Xu hướng doanh thu (so sánh tuần qua vs tuần này, tháng trước vs tháng này)
     * GET /api/reports/revenue/trends
     */
    public function trends(Request $request)
    {
        $now = now();
        $today = $now->format('Y-m-d');
        $yesterday = $now->copy()->subDay()->format('Y-m-d');
        $weekAgo = $now->copy()->subDays(7)->format('Y-m-d');
        $monthAgo = $now->copy()->subMonth()->format('Y-m-d');

        // Today vs Yesterday
        $revenueToday = HoaDon::whereDate('NGAYHD', $today)->where('TRANGTHAI', 1)->sum('TONG_THANHTOAN');
        $revenueYesterday = HoaDon::whereDate('NGAYHD', $yesterday)->where('TRANGTHAI', 1)->sum('TONG_THANHTOAN');
        $dayGrowth = $revenueYesterday > 0 ? (($revenueToday - $revenueYesterday) / $revenueYesterday) * 100 : 0;

        // This week vs Last week
        $thisWeekStart = $now->copy()->startOfWeek()->format('Y-m-d');
        $lastWeekStart = $now->copy()->subWeek()->startOfWeek()->format('Y-m-d');
        $lastWeekEnd = $now->copy()->copy()->subWeek()->endOfWeek()->format('Y-m-d');

        $revenueThisWeek = HoaDon::whereBetween('NGAYHD', [$thisWeekStart, $today])->where('TRANGTHAI', 1)->sum('TONG_THANHTOAN');
        $revenueLastWeek = HoaDon::whereBetween('NGAYHD', [$lastWeekStart, $lastWeekEnd])->where('TRANGTHAI', 1)->sum('TONG_THANHTOAN');
        $weekGrowth = $revenueLastWeek > 0 ? (($revenueThisWeek - $revenueLastWeek) / $revenueLastWeek) * 100 : 0;

        // This month vs Last month
        $thisMonthStart = $now->copy()->startOfMonth()->format('Y-m-d');
        $lastMonthStart = $now->copy()->subMonth()->startOfMonth()->format('Y-m-d');
        $lastMonthEnd = $now->copy()->subMonth()->endOfMonth()->format('Y-m-d');

        $revenueThisMonth = HoaDon::whereBetween('NGAYHD', [$thisMonthStart, $today])->where('TRANGTHAI', 1)->sum('TONG_THANHTOAN');
        $revenueLastMonth = HoaDon::whereBetween('NGAYHD', [$lastMonthStart, $lastMonthEnd])->where('TRANGTHAI', 1)->sum('TONG_THANHTOAN');
        $monthGrowth = $revenueLastMonth > 0 ? (($revenueThisMonth - $revenueLastMonth) / $revenueLastMonth) * 100 : 0;

        // Last 30 days trend
        $last30Days = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = $now->copy()->subDays($i)->format('Y-m-d');
            $revenue = HoaDon::whereDate('NGAYHD', $date)->where('TRANGTHAI', 1)->sum('TONG_THANHTOAN');
            $last30Days[] = [
                'date' => $date,
                'revenue' => (float)$revenue,
                'label' => $now->copy()->subDays($i)->format('d/m'),
            ];
        }

        return response()->json([
            'trends' => [
                'dayGrowth' => round($dayGrowth, 1),
                'weekGrowth' => round($weekGrowth, 1),
                'monthGrowth' => round($monthGrowth, 1),
                'today' => (float)$revenueToday,
                'yesterday' => (float)$revenueYesterday,
                'thisWeek' => (float)$revenueThisWeek,
                'thisMonth' => (float)$revenueThisMonth,
            ],
            'last30Days' => $last30Days,
        ]);
    }

    /**
     * Helper to sort array by value DESC
     */
    private static function array_sort(&$array, $callback)
    {
        uasort($array, $callback);
        return $array;
    }
}
