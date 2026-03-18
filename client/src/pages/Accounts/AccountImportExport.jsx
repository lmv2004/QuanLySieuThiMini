import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Ico } from '../../components/Manage/Icons';
import { accountService } from '../../services/accountService';
import { Modal } from '../../components/Manage/Modal';

export const AccountImportExport = ({ onRefresh, addToast, data }) => {
    const fileRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);

    // Form state
    const [mode, setMode] = useState('import');
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
        setTimeout(resetForm, 300);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) setImportFile(file);
    };

    const downloadTemplate = () => {
        const templateData = [
            {
                'Tên đăng nhập': 'nguyenvana',
                'Email': 'nva@example.com',
                'Mật khẩu': '123456',
                'Mã nhân viên (Sở hữu)': '1',
            },
            {
                'Tên đăng nhập': 'tranthib',
                'Email': 'ttb@example.com',
                'Mật khẩu': 'password123',
                'Mã nhân viên (Sở hữu)': '2',
            }
        ];

        const ws = XLSX.utils.json_to_sheet(templateData);
        ws['!cols'] = [{ wch: 20 }, { wch: 30 }, { wch: 15 }, { wch: 25 }];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Template');
        XLSX.writeFile(wb, 'Accounts_Template.xlsx');
    };

    const submitExport = () => {
        if (!data || data.length === 0) {
            addToast('error', 'Không có dữ liệu để xuất');
            return;
        }

        const fileName = exportName.trim() || `accounts_${new Date().getTime()}`;
        const finalFileName = `${fileName}.${exportType}`;

        const exportData = data.map(v => ({
            'ID / Số TK': v.SOTK,
            'Tên đăng nhập': v.TENTK,
            'Email': v.EMAIL || '',
            'Mã nhân viên (Sở hữu)': v.MANV || '',
            'Tên nhân viên': v.NHANVIEN?.TENNV || '',
            'Trạng thái': v.KHOA_TK ? 'Bị khóa' : 'Đang hoạt động'
        }));

        if (exportType === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = finalFileName;
            a.click();
            addToast('success', `Đã xuất file ${exportType.toUpperCase()}`);
            handleClose();
            return;
        }

        const ws = XLSX.utils.json_to_sheet(exportData);
        ws['!cols'] = [
            { wch: 12 }, { wch: 20 }, { wch: 30 }, { wch: 25 }, { wch: 25 }, { wch: 18 }
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Accounts');

        if (exportType === 'csv') {
            XLSX.writeFile(wb, finalFileName, { bookType: 'csv' });
        } else {
            XLSX.writeFile(wb, finalFileName);
        }

        addToast('success', `Đã xuất file ${exportType.toUpperCase()}`);
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

                // Map dữ liệu Excel về đúng cấu trúc DB
                const mappedData = jsonData.map(item => ({
                    TENTK: item['Tên đăng nhập'] || item.TENTK,
                    EMAIL: item['Email'] || item.EMAIL || '',
                    MATKHAU: item['Mật khẩu'] || item.MATKHAU || '123456', // Mật khẩu mặc định nếu trống
                    MANV: item['Mã nhân viên (Sở hữu)'] || item.MANV || null,
                    KHOA_TK: 0
                }));

                await accountService.importBulk(mappedData);
                addToast('success', `Đã thêm thành công ${mappedData.length} tài khoản`);
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
                {Ico.file} <span>Nhập/Xuất Excel</span>
            </button>

            {isOpen && (
                <Modal
                    title="Công cụ Nhập / Xuất Tài Khoản"
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
                                <select className="form-control ie-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                                    <option value="import">Nhập dữ liệu (Import từ file lên)</option>
                                    <option value="export">Xuất dữ liệu (Export danh sách xuống máy)</option>
                                </select>
                                <span className="ie-select-caret">{Ico.caret}</span>
                            </div>
                        </div>

                        <div className="ie-form-body">
                            {mode === 'import' ? (
                                <div className="ie-form-section">
                                    <label className="form-label">Tải xuống File Mẫu (Nên dùng)</label>
                                    <p className="form-help-text" style={{ marginBottom: '12px' }}>
                                        Để tránh lỗi sai cấu trúc các cột (Tên đăng nhập, Email, ...), vui lòng tải file mẫu dưới đây, điền dữ liệu của bạn rồi mới Upload lên hệ thống.
                                    </p>
                                    <button 
                                        className="btn-secondary" 
                                        onClick={downloadTemplate}
                                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '24px', background: '#f8fafc', color: '#0f172a', borderColor: '#cbd5e1' }}
                                    >
                                        <span style={{ color: 'var(--green)' }}>{Ico.fileExcel}</span> Tải File Mẫu (Template)
                                    </button>

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
                                </div>
                            ) : (
                                <div className="ie-form-section">
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Tên tệp xuất</label>
                                        <input
                                            type="text"
                                            className="ie-input"
                                            placeholder={`accounts_${new Date().getTime()}`}
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
