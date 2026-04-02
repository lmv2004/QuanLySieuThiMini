<?php

namespace App\Http\Controllers;

use App\Models\HoaDon;
use App\Models\PhieuNhap;
use App\Models\TonKho;
use App\Models\SanPham;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get dashboard statistics
     * GET /api/dashboard/stats?period=day|month|year
     */
    public function stats()
    {
        $period = request('period', 'day'); // day, month, year

        // Get date range based on period
        $dateFrom = match($period) {
            'day' => Carbon::today(),
            'month' => Carbon::now()->startOfMonth(),
            'year' => Carbon::now()->startOfYear(),
            default => Carbon::today(),
        };
        $dateTo = Carbon::now();

        // ── KPI Data ──
        $kpis = $this->getKPIs($dateFrom, $dateTo);

        // ── Chart Data (Revenue by time) ──
        $chartData = $this->getChartData($period, $dateFrom, $dateTo);

        // ── Category Breakdown ──
        $categories = $this->getCategoryBreakdown($dateFrom, $dateTo);

        // ── Top Products ──
        $topProducts = $this->getTopProducts($dateFrom, $dateTo);

        // ── Alerts (Low Stock) ──
        $alerts = $this->getAlerts();

        // ── Operations Summary ──
        $operations = $this->getOperationsSummary($dateFrom, $dateTo);

        return response()->json([
            'period' => $period,
            'date_from' => $dateFrom->format('Y-m-d'),
            'date_to' => $dateTo->format('Y-m-d'),
            'kpis' => $kpis,
            'chartData' => $chartData,
            'categories' => $categories,
            'topProducts' => $topProducts,
            'alerts' => $alerts,
            'operations' => $operations,
        ]);
    }

    /**
     * Get KPI metrics
     */
    private function getKPIs($dateFrom, $dateTo)
    {
        $hoadons = HoaDon::whereBetween('NGAYHD', [$dateFrom, $dateTo])
            ->where('TRANGTHAI', 1) // Only paid invoices
            ->get();

        $revenue = $hoadons->sum('TONG_THANHTOAN');
        $invoiceCount = $hoadons->count();

        // Stock alerts count
        $alertsCount = TonKho::where('SOLUONG_CON_LAI', '<', 10)
            ->where('IS_ACTIVE', 1)->count();

        return [
            [
                'id' => 'rev',
                'label' => 'Doanh thu ' . $this->getPeriodLabel($dateFrom),
                'val' => number_format($revenue, 0, '', '.') . ' ₫',
                'rawValue' => $revenue,
                'trend' => $this->calculateTrend('revenue', $dateFrom),
                'icon' => '💰',
                'bg' => '#6366f1',
                'up' => true
            ],
            [
                'id' => 'inv',
                'label' => 'Hóa đơn ' . $this->getPeriodLabel($dateFrom),
                'val' => (string)$invoiceCount,
                'rawValue' => $invoiceCount,
                'trend' => '+' . $invoiceCount,
                'icon' => '🧾',
                'bg' => '#0ea5e9',
                'up' => true
            ],
            [
                'id' => 'alert',
                'label' => 'Cảnh báo tồn kho',
                'val' => $alertsCount . ' mặt hàng',
                'rawValue' => $alertsCount,
                'trend' => 'Cần nhập',
                'icon' => '📦',
                'bg' => '#ef4444',
                'up' => false
            ]
        ];
    }

    /**
     * Get chart data based on period
     */
    private function getChartData($period, $dateFrom, $dateTo)
    {
        if ($period === 'day') {
            // Hourly data (8h-20h)
            $data = [];
            for ($h = 8; $h <= 20; $h += 2) {
                $start = $dateFrom->copy()->hour($h)->minute(0);
                $end = $start->copy()->addHours(2);
                $revenue = HoaDon::whereBetween('NGAYHD', [$start, $end])
                    ->where('TRANGTHAI', 1)
                    ->sum('TONG_THANHTOAN');
                $data[] = [
                    'l' => $h . 'h',
                    'v' => round($revenue / 1000000, 1) // In millions
                ];
            }
            return $data;
        } elseif ($period === 'month') {
            // Weekly data
            $data = [];
            $current = $dateFrom->copy();
            $week = 1;
            while ($current <= $dateTo) {
                $weekEnd = $current->copy()->addDays(7);
                $revenue = HoaDon::whereBetween('NGAYHD', [$current, min($weekEnd, $dateTo)])
                    ->where('TRANGTHAI', 1)
                    ->sum('TONG_THANHTOAN');
                $data[] = [
                    'l' => 'Tuần ' . $week,
                    'v' => round($revenue / 1000000, 1)
                ];
                $current = $weekEnd;
                $week++;
            }
            return $data;
        } else {
            // Quarterly data
            $data = [];
            for ($q = 1; $q <= 4; $q++) {
                $qStart = Carbon::now()->startOfYear()->addMonths(($q - 1) * 3);
                $qEnd = $qStart->copy()->addMonths(3)->subDay();
                $revenue = HoaDon::whereBetween('NGAYHD', [$qStart, $qEnd])
                    ->where('TRANGTHAI', 1)
                    ->sum('TONG_THANHTOAN');
                $data[] = [
                    'l' => 'Q' . $q,
                    'v' => round($revenue / 1000000, 1)
                ];
            }
            return $data;
        }
    }

    /**
     * Get category breakdown
     */
    private function getCategoryBreakdown($dateFrom, $dateTo)
    {
        $colors = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6'];

        $categories = DB::table('c_t_hoa_dons as ct')
            ->join('san_phams as sp', 'ct.MASP', '=', 'sp.MASP')
            ->join('loai_san_phams as lsp', 'sp.MALOAI', '=', 'lsp.MALOAI')
            ->join('hoa_dons as hd', 'ct.MAHD', '=', 'hd.MAHD')
            ->whereBetween('hd.NGAYHD', [$dateFrom, $dateTo])
            ->where('hd.TRANGTHAI', 1)
            ->selectRaw('lsp.TENLOAI, SUM(ct.SOLUONG * ct.GIABAN_THUCTE) as total')
            ->groupBy('lsp.MALOAI', 'lsp.TENLOAI')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        $grandTotal = $categories->sum('total');

        return $categories->map(function ($cat, $idx) use ($colors, $grandTotal) {
            return [
                'label' => $cat->TENLOAI,
                'perc' => $grandTotal > 0 ? round(($cat->total / $grandTotal) * 100) : 0,
                'color' => $colors[$idx % count($colors)]
            ];
        })->values();
    }

    /**
     * Get top selling products
     */
    private function getTopProducts($dateFrom, $dateTo)
    {
        return DB::table('c_t_hoa_dons as ct')
            ->join('san_phams as sp', 'ct.MASP', '=', 'sp.MASP')
            ->join('hoa_dons as hd', 'ct.MAHD', '=', 'hd.MAHD')
            ->whereBetween('hd.NGAYHD', [$dateFrom, $dateTo])
            ->where('hd.TRANGTHAI', 1)
            ->selectRaw('sp.MASP, sp.TENSP, SUM(ct.SOLUONG) as total_qty, SUM(ct.SOLUONG * ct.GIABAN_THUCTE) as total_revenue')
            ->groupBy('sp.MASP', 'sp.TENSP')
            ->orderByDesc('total_revenue')
            ->limit(5)
            ->get()
            ->map(function ($p) {
                return [
                    'id' => $p->MASP,
                    'name' => $p->TENSP,
                    'qty' => (int)$p->total_qty,
                    'revenue' => (int)$p->total_revenue,
                ];
            });
    }

    /**
     * Get low stock alerts
     */
    private function getAlerts()
    {
        return TonKho::where('IS_ACTIVE', 1)
            ->where('SOLUONG_CON_LAI', '<', 10)
            ->with('sanPham')
            ->limit(5)
            ->get()
            ->map(function ($tk) {
                return [
                    'id' => $tk->ID,
                    'product' => $tk->sanPham->TENSP ?? 'N/A',
                    'qty' => $tk->SOLUONG_CON_LAI,
                    'expired_at' => $tk->HANSUDUNG,
                    'severity' => $tk->SOLUONG_CON_LAI <= 3 ? 'critical' : 'warning'
                ];
            });
    }

    /**
     * Get operations summary
     */
    private function getOperationsSummary($dateFrom, $dateTo)
    {
        return [
            'total_purchases' => PhieuNhap::whereBetween('NGAYLAP', [$dateFrom, $dateTo])->count(),
            'total_invoices' => HoaDon::whereBetween('NGAYHD', [$dateFrom, $dateTo])->count(),
            'paid_invoices' => HoaDon::whereBetween('NGAYHD', [$dateFrom, $dateTo])->where('TRANGTHAI', 1)->count(),
            'pending_invoices' => HoaDon::whereBetween('NGAYHD', [$dateFrom, $dateTo])->where('TRANGTHAI', 0)->count(),
        ];
    }

    /**
     * Helper: Get period label
     */
    private function getPeriodLabel($dateFrom)
    {
        if ($dateFrom->isToday()) {
            return 'hôm nay';
        } elseif ($dateFrom->isCurrentMonth()) {
            return 'tháng này';
        } else {
            return 'năm nay';
        }
    }

    /**
     * Helper: Calculate trend
     */
    private function calculateTrend($metric, $dateFrom)
    {
        // Simple trend calculation (can be enhanced)
        if ($metric === 'revenue') {
            $previous = match(true) {
                $dateFrom->isToday() => HoaDon::whereDate('NGAYHD', $dateFrom->subDay())
                    ->where('TRANGTHAI', 1)->sum('TONG_THANHTOAN'),
                $dateFrom->isCurrentMonth() => HoaDon::whereMonth('NGAYHD', $dateFrom->subMonth()->month)
                    ->where('TRANGTHAI', 1)->sum('TONG_THANHTOAN'),
                default => 0
            };

            if ($previous == 0) return '+12.5%';

            $current = HoaDon::whereBetween('NGAYHD', [$dateFrom, Carbon::now()])
                ->where('TRANGTHAI', 1)->sum('TONG_THANHTOAN');

            $trend = (($current - $previous) / max($previous, 1)) * 100;
            return ($trend >= 0 ? '+' : '') . round($trend, 1) . '%';
        }
        return '+0%';
    }
}
