import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Ico } from '../../components/Manage/Icons';
import { voucherService } from '../../services/voucherService';
import { Modal } from '../../components/Manage/Modal';

export const VoucherImportExport = ({ onRefresh, addToast, data }) => {
    const fileRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    // Form state
    const [mode, setMode] = useState('import'); // 'import' | 'export'
    const [exportType, setExportType] = useState('xlsx');
    const [exportName, setExportName] = useState('');
    const [importFile, setImportFile] = useState(null);

    const resetForm = () => {
        setMode('import');
        setExportType('xlsx');
        setExportName('');
        setImportFile(null);
    };

    const handleOpen = () => {
        resetForm();
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        setTimeout(resetForm, 300); // reset after animation
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) setImportFile(file);
    };

    const submitExport = () => {
        if (!data || data.length === 0) {
            addToast('error', 'Không có dữ liệu để xuất');
            return;
        }

        const fileName = exportName.trim() || `vouchers_${new Date().getTime()}`;
        const finalFileName = `${fileName}.${exportType}`;

        const exportData = data.map(v => {
            const isFixed = v.PTGIAM === 0;
            return {
                'Mã Voucher': v.MAVOUCHER,
                'Mô tả': v.MOTA,
                'Loại giảm giá': isFixed ? 'Số tiền cố định' : 'Phần trăm',
                'Phần trăm giảm (%)': v.PTGIAM || 0,
                'Số tiền giảm / Giảm tối đa (VNĐ)': v.KMTOIDA || 0,
                'Giảm tối thiểu (VNĐ)': v.KMTOITHIEU || 0,
                'Đơn tối thiểu (VNĐ)': v.GIATRITOITHIEU || 0,
                'Tổng lượt sử dụng': v.SOLUOTSD || 0,
                'Lượt đã dùng': v.DADUNG || 0,
                'Ngày bắt đầu': v.NGAYBD,
                'Ngày kết thúc': v.NGAYKT,
                'Trạng thái': v.TRANGTHAI === 1 ? 'Hoạt động' : 'Đã khóa'
            };
        });

        if (exportType === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = finalFileName;
            a.click();
            addToast('success', `Đã xuất file ${exportType.toUpperCase()} thành công`);
            handleClose();
            return;
        }

        const ws = XLSX.utils.json_to_sheet(exportData);
        
        // Tự động điều chỉnh độ rộng cột cho tệp xuất
        ws['!cols'] = [
            { wch: 18 }, // Mã Voucher
            { wch: 35 }, // Mô tả
            { wch: 18 }, // Loại giảm giá
            { wch: 20 }, // Phần trăm giảm
            { wch: 35 }, // Giảm tối đa
            { wch: 20 }, // Giảm tối thiểu
            { wch: 20 }, // Đơn tối thiểu
            { wch: 18 }, // Tổng lượt SD
            { wch: 15 }, // Đã dùng
            { wch: 20 }, // Ngày BD
            { wch: 20 }, // Ngày KT
            { wch: 15 }  // Trạng thái
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Vouchers');

        if (exportType === 'csv') {
            XLSX.writeFile(wb, finalFileName, { bookType: 'csv' });
        } else {
            XLSX.writeFile(wb, finalFileName);
        }

        addToast('success', `Đã xuất file ${exportType.toUpperCase()} thành công`);
        handleClose();
    };

    const submitImport = async () => {
        if (!importFile) {
            addToast('error', 'Vui lòng chọn file dữ liệu!');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (evt) => {
            try {
                const bstr = evt.target.result;
                let jsonData = [];

                if (importFile.name.endsWith('.json')) {
                    jsonData = JSON.parse(bstr);
                } else {
                    const wb = XLSX.read(bstr, { type: 'binary' });
                    const wsname = wb.SheetNames[0];
                    const ws = wb.Sheets[wsname];
                    jsonData = XLSX.utils.sheet_to_json(ws);
                }

                const mappedData = jsonData.map(item => ({
                    MAVOUCHER: item['Mã Voucher'] || item.MAVOUCHER,
                    MOTA: item['Mô tả'] || item.MOTA || '',
                    PTGIAM: Number(item['Phần trăm giảm'] || item.PTGIAM || 0),
                    KMTOIDA: Number(item['Giảm tối đa'] || item.KMTOIDA || 0),
                    NGAYBD: item['Ngày bắt đầu'] || item.NGAYBD,
                    NGAYKT: item['Ngày kết thúc'] || item.NGAYKT,
                    SOLUOTSD: Number(item['Lượt sử dụng'] || item.SOLUOTSD || 0),
                    TRANGTHAI: item['Trình trạng'] === 'Kích hoạt' ? 1 : (item.TRANGTHAI ?? 1)
                }));

                await voucherService.importBulk(mappedData);
                addToast('success', `Đã nhập thành công ${mappedData.length} voucher`);
                if (onRefresh) onRefresh();
                handleClose();
            } catch (err) {
                console.error(err);
                addToast('error', 'Lỗi khi xử lý file import. Vui lòng kiểm tra lại định dạng.');
            }
        };

        if (importFile.name.endsWith('.json')) {
            reader.readAsText(importFile);
        } else {
            reader.readAsBinaryString(importFile);
        }
    };

    const handleSubmit = () => {
        if (mode === 'import') submitImport();
        else submitExport();
    };

    return (
        <div className="voucher-import-export">
            <button className="btn-secondary btn-import-export" onClick={handleOpen}>
                {Ico.file} <span>Nhập / Xuất dữ liệu</span>
            </button>

            {isOpen && (
                <Modal
                    title="Công cụ Nhập / Xuất Dữ Liệu"
                    onClose={handleClose}
                    actions={
                        <>
                            <button className="btn-secondary" onClick={handleClose}>Hủy</button>
                            <button className="btn-primary" onClick={handleSubmit}>
                                {mode === 'import' ? 'Xác nhận Nhập' : 'Thực hiện Xuất'}
                            </button>
                        </>
                    }
                >
                    <div className="ie-form">
                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                {mode === 'import' ? Ico.upload : Ico.download}
                                Phương thức thao tác
                            </label>
                            <div className="ie-select-wrapper">
                                <select
                                    className="form-control ie-select"
                                    value={mode}
                                    onChange={(e) => setMode(e.target.value)}
                                >
                                    <option value="import">Nhập dữ liệu (Import từ file lên)</option>
                                    <option value="export">Xuất dữ liệu (Export danh sách xuống máy)</option>
                                </select>
                                <span className="ie-select-caret">{Ico.caret}</span>
                            </div>
                        </div>

                        <div className="ie-form-body">
                            {mode === 'import' ? (
                                <div className="ie-form-section">
                                    <label className="form-label">Chọn tệp tải lên</label>
                                    <div className="ie-upload-area" onClick={() => fileRef.current?.click()}>
                                        <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileSelect} accept=".xlsx, .xls, .csv, .json" />
                                        <div className="ie-upload-icon">{Ico.upload}</div>
                                        {importFile ? (
                                            <div className="ie-file-selected">
                                                <strong>{importFile.name}</strong>
                                                <span>{(importFile.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                        ) : (
                                            <div className="ie-upload-text">
                                                <strong>Nhấn để chọn hoặc kéo thả file vào đây</strong>
                                                <span>Hỗ trợ định dạng: .xlsx, .csv, .json</span>
                                            </div>
                                        )}
                                    </div>
                                    <p className="form-help-text">Lưu ý: Tệp dữ liệu cần có cấu trúc cột chuẩn (Mã Voucher, Mô tả, Phần trăm giảm, Giảm tối đa...).</p>
                                </div>
                            ) : (
                                <div className="ie-form-section">
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Tên tệp xuất</label>
                                        <input
                                            type="text"
                                            className="ie-input"
                                            placeholder={`vouchers_${new Date().getTime()}`}
                                            value={exportName}
                                            onChange={(e) => setExportName(e.target.value)}
                                        />
                                        <p className="form-help-text" style={{ marginTop: '8px' }}>Để trống hệ thống sẽ tự đặt tên ngẫu nhiên theo thời gian hiện tại.</p>
                                    </div>

                                    <div className="form-group" style={{ marginTop: '16px' }}>
                                        <label className="form-label">Định dạng file</label>
                                        <div className="ie-format-grid">
                                            <div className={`ie-format-card excel-card ${exportType === 'xlsx' ? 'selected' : ''}`} onClick={() => setExportType('xlsx')}>
                                                {Ico.fileExcel}
                                                <span>Excel (.xlsx)</span>
                                            </div>
                                            <div className={`ie-format-card csv-card ${exportType === 'csv' ? 'selected' : ''}`} onClick={() => setExportType('csv')}>
                                                {Ico.fileCsv}
                                                <span>CSV (.csv)</span>
                                            </div>
                                            <div className={`ie-format-card json-card ${exportType === 'json' ? 'selected' : ''}`} onClick={() => setExportType('json')}>
                                                {Ico.fileJson}
                                                <span>JSON (.json)</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </Modal>
            )}
        </div>
    );
};
