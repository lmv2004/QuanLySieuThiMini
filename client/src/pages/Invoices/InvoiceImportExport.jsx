import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Ico } from '../../components/Manage/Icons';
import { fmtVND, fmtDateTime } from '../../components/Manage/Shared';

export const InvoiceImportExport = ({ onRefresh, addToast, data, columns }) => {
    const [isExporting, setIsExporting] = useState(false);

    const handleExportExcel = async () => {
        if (!data || data.length === 0) {
            addToast?.('error', 'Không có dữ liệu để xuất');
            return;
        }

        try {
            setIsExporting(true);

            // Prepare data for Excel
            const exportData = data.map((invoice) => ({
                'Mã HĐ': invoice.MAHD || '—',
                'Ngày giờ lập': fmtDateTime(invoice.NGAYHD),
                'Nhân viên': invoice.nhanVien?.TENNV || '—',
                'Khách hàng': invoice.khachHang?.TENKH || 'Khách lẻ',
                'Hình thức': invoice.HINHTHUC || '—',
                'Tổng tiền hàng': invoice.TONGTIEN_HANG || 0,
                'Voucher': invoice.voucher?.MA_VOUCHER || 'Không dùng',
                'Tiền giảm': invoice.TIEN_GIAM_VOUCHER || 0,
                'Tổng thanh toán': invoice.TONG_THANHTOAN || 0,
                'Trạng thái': Number(invoice.TRANGTHAI) === 0 ? 'Chờ thanh toán' : 'Đã thanh toán',
            }));

            // Create workbook and worksheet
            const ws = XLSX.utils.json_to_sheet(exportData);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Danh sách hóa đơn');

            // Auto-size columns
            ws['!cols'] = [
                { wch: 12 },  // Mã HĐ
                { wch: 20 },  // Ngày giờ lập
                { wch: 15 },  // Nhân viên
                { wch: 15 },  // Khách hàng
                { wch: 12 },  // Hình thức
                { wch: 15 },  // Tổng tiền hàng
                { wch: 12 },  // Voucher
                { wch: 12 },  // Tiền giảm
                { wch: 15 },  // Tổng thanh toán
                { wch: 15 },  // Trạng thái
            ];

            // Format numeric columns
            const range = XLSX.utils.decode_range(ws['!ref']);
            for (let row = range.s.r + 1; row <= range.e.r; row++) {
                // Tổng tiền hàng (F)
                const cellF = XLSX.utils.encode_cell({ r: row, c: 5 });
                if (ws[cellF]) ws[cellF].z = '#,##0';
                
                // Tiền giảm (H)
                const cellH = XLSX.utils.encode_cell({ r: row, c: 7 });
                if (ws[cellH]) ws[cellH].z = '#,##0';
                
                // Tổng thanh toán (I)
                const cellI = XLSX.utils.encode_cell({ r: row, c: 8 });
                if (ws[cellI]) ws[cellI].z = '#,##0';
            }

            // Generate filename with timestamp
            const timestamp = new Date().toISOString().slice(0, 10);
            const filename = `Danh_sach_hoa_don_${timestamp}.xlsx`;

            // Write file
            XLSX.writeFile(wb, filename);
            addToast?.('success', `Đã xuất file "${filename}" thành công`);
        } catch (error) {
            console.error('Export error:', error);
            addToast?.('error', 'Lỗi khi xuất file Excel');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="invoice-export">
            <button 
                className="btn-secondary btn-export" 
                onClick={handleExportExcel}
                disabled={isExporting}
            >
                {Ico.download} <span>{isExporting ? 'Đang xuất...' : 'Xuất Excel'}</span>
            </button>
        </div>
    );
};
