import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { Ico } from '../../components/Manage/Icons';
import { accountService } from '../../services/accountService';
import { Modal } from '../../components/Manage/Modal';

export const AccountImportExport = ({ onRefresh, addToast, data }) => {
    const fileRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('import'); // 'import' | 'export'
    const [exportType, setExportType] = useState('xlsx');
    const [exportName, setExportName] = useState('');
    const [importFile, setImportFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const resetForm = () => {
        setMode('import');
        setExportType('xlsx');
        setExportName('');
        setImportFile(null);
        setIsLoading(false);
    };

    const handleOpen = () => { resetForm(); setIsOpen(true); };
    const handleClose = () => { setIsOpen(false); setTimeout(resetForm, 300); };
    const handleFileSelect = (e) => { const file = e.target.files[0]; if (file) setImportFile(file); };

    const downloadTemplate = () => {
        const templateData = [
            {
                'STT': 1,
                'ID Hệ thống': '',
                'Tên đăng nhập (*)': 'nv_banhang_01',
                'Email liên kết (*)': 'nv01@sieuthi.vn',
                'Mã nhân viên (*)': '1',
                'Mật khẩu (*)': '123456',
                'Họ tên nhân viên': 'Nguyễn Văn A',
                'Chức vụ': 'Nhân viên',
                'Số điện thoại': '0987654321',
                'Trạng thái': '🟢 Đang hoạt động',
                'Ngày tạo': ''
            },
            {
                'STT': 2,
                'ID Hệ thống': '',
                'Tên đăng nhập (*)': 'nv_kho_02',
                'Email liên kết (*)': 'kho02@sieuthi.vn',
                'Mã nhân viên (*)': '2',
                'Mật khẩu (*)': 'password@123',
                'Họ tên nhân viên': 'Trần Thị B',
                'Chức vụ': 'Nhân viên',
                'Số điện thoại': '0123456789',
                'Trạng thái': '🟢 Đang hoạt động',
                'Ngày tạo': ''
            }
        ];

        const ws = XLSX.utils.json_to_sheet(templateData);
        // Tối ưu độ rộng cột giống file Xuất
        ws['!cols'] = [
            { wch: 6 }, { wch: 12 }, { wch: 20 }, { wch: 30 }, 
            { wch: 15 }, { wch: 15 }, { wch: 25 }, { wch: 18 }, 
            { wch: 15 }, { wch: 20 }, { wch: 15 }
        ];
        
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Mau_Nhap_Tai_Khoan');
        XLSX.writeFile(wb, 'Mau_Nhap_Tai_Khoan.xlsx');
        addToast('success', 'Đã tải file mẫu chuẩn thành công (Khớp hoàn toàn với định dạng Xuất)');
    };

    const submitExport = () => {
        if (!data || data.length === 0) {
            addToast('error', 'Không có danh sách tài khoản để xuất');
            return;
        }

        const fileName = exportName.trim() || `Danh_Sach_Tai_Khoan_${new Date().getTime()}`;
        const finalFileName = `${fileName}.${exportType}`;

        const exportData = data.map((v, i) => {
            const emp = v.NHANVIEN || v.nhanVien || {};
            return {
                'STT': i + 1,
                'ID Hệ thống': v.SOTK,
                'Tên đăng nhập': v.TENTK,
                'Email liên kết': v.EMAIL || '—',
                'Mã nhân viên': v.MANV || '—',
                'Họ tên nhân viên': emp.TENNV || '—',
                'Chức vụ': emp.chucVu?.TENCHUCVU || emp.TENCHUCVU || 'Nhân viên',
                'Số điện thoại': emp.SODIENTHOAI || '—',
                'Trạng thái': v.KHOA_TK ? '🔴 Bị khóa' : '🟢 Đang hoạt động',
                'Ngày tạo': v.CREATED_AT ? new Date(v.CREATED_AT).toLocaleDateString('vi-VN') : '—'
            };
        });

        if (exportType === 'json') {
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = finalFileName;
            a.click();
            addToast('success', 'Đã xuất dữ liệu JSON');
            handleClose();
            return;
        }

        const ws = XLSX.utils.json_to_sheet(exportData);
        // Tối ưu độ rộng cột cho file xuất
        ws['!cols'] = [
            { wch: 6 }, { wch: 12 }, { wch: 20 }, { wch: 30 }, 
            { wch: 15 }, { wch: 25 }, { wch: 18 }, { wch: 15 }, 
            { wch: 20 }, { wch: 15 }
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Danh sách Tài khoản');

        if (exportType === 'csv') {
            XLSX.writeFile(wb, finalFileName, { bookType: 'csv' });
        } else {
            XLSX.writeFile(wb, finalFileName);
        }

        addToast('success', `Đã xuất ${data.length} tài khoản ra file ${exportType.toUpperCase()}`);
        handleClose();
    };

    const submitImport = async () => {
        if (!importFile) {
            addToast('error', 'Vui lòng chọn file Excel hoặc JSON để nhập!');
            return;
        }
        setIsLoading(true);

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

                if (jsonData.length === 0) throw new Error('File không có dữ liệu hoặc sai định dạng');

                const mappedData = jsonData.map(item => ({
                    // Mapping linh hoạt hỗ trợ cả file Export và file Template mới
                    TENTK: item['Tên đăng nhập (*)'] || item['Tên đăng nhập'] || item.TENTK,
                    EMAIL: item['Email liên kết (*)'] || item['Email liên kết'] || item.EMAIL || '',
                    MATKHAU: item['Mật khẩu (*)'] || item['Mật khẩu'] || item.MATKHAU || '123456',
                    MANV: item['Mã nhân viên (*)'] || item['Mã nhân viên'] || item.MANV || null,
                    KHOA_TK: 0
                }));

                await accountService.importBulk(mappedData);
                addToast('success', `Đã nhập thành công ${mappedData.length} tài khoản mới`);
                if (onRefresh) onRefresh();
                handleClose();
            } catch (err) {
                console.error(err);
                addToast('error', err.response?.data?.message || err.message || 'Lỗi khi xử lý file. Kiểm tra lại dữ liệu.');
            } finally {
                setIsLoading(false);
            }
        };

        if (importFile.name.endsWith('.json')) {
            reader.readAsText(importFile);
        } else {
            reader.readAsBinaryString(importFile);
        }
    };

    const handleSubmit = () => { mode === 'import' ? submitImport() : submitExport(); };

    return (
        <div className="voucher-import-export">
            <button className="btn-secondary btn-import-export" onClick={handleOpen}>
                {Ico.file} <span>Nhập/Xuất Excel</span>
            </button>

            {isOpen && (
                <Modal
                    title="Công cụ Quản lý Dữ liệu"
                    onClose={handleClose}
                    actions={
                        <>
                            <button className="btn-secondary" onClick={handleClose} disabled={isLoading}>Đóng</button>
                            <button className="btn-primary" onClick={handleSubmit} disabled={isLoading}>
                                {isLoading ? <span className="spinner"></span> : (mode === 'import' ? 'Xác nhận Nhập' : 'Thực hiện Xuất')}
                            </button>
                        </>
                    }
                >
                    <div className="ie-form">
                        {/* Tab Switcher */}
                        <div className="ie-tabs">
                            <button className={`ie-tab-btn ${mode === 'import' ? 'active' : ''}`} onClick={() => setMode('import')}>
                                {Ico.upload} <span>Nhập dữ liệu</span>
                            </button>
                            <button className={`ie-tab-btn ${mode === 'export' ? 'active' : ''}`} onClick={() => setMode('export')}>
                                {Ico.download} <span>Xuất dữ liệu</span>
                            </button>
                        </div>

                        <div className="ie-form-body">
                            {mode === 'import' ? (
                                <div className="ie-section">
                                    <div className="ie-section-title">{Ico.info} Bước 1: Chuẩn bị file mẫu</div>
                                    <p className="form-help-text" style={{ marginBottom: '16px' }}>
                                        Để đảm bảo dữ liệu chính xác, hãy sử dụng file mẫu chuẩn của hệ thống.
                                    </p>
                                    <button className="btn-secondary" onClick={downloadTemplate} style={{ gap: '8px', marginBottom: '24px', background: '#f8fafc', color: '#0f172a', borderColor: '#cbd5e1' }}>
                                        <span style={{ color: 'var(--green)' }}>{Ico.fileExcel}</span> Tải File Mẫu (.xlsx)
                                    </button>

                                    <div className="ie-section-title">{Ico.upload} Bước 2: Tải file lên</div>
                                    <div className="ie-upload-area" onClick={() => fileRef.current?.click()}>
                                        <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileSelect} accept=".xlsx, .xls, .csv, .json" />
                                        <div className="ie-upload-icon">{importFile ? Ico.fileCheck : Ico.upload}</div>
                                        {importFile ? (
                                            <div className="ie-file-selected">
                                                <strong>{importFile.name}</strong>
                                                <span>{(importFile.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                        ) : (
                                            <div className="ie-upload-text">
                                                <strong>Chọn hoặc kéo thả file vào đây</strong>
                                                <span>Hỗ trợ: Excel, CSV, JSON</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="ie-section">
                                    <div className="form-group" style={{ marginBottom: '20px' }}>
                                        <label className="form-label" style={{ fontWeight: 700 }}>Tên file khi lưu</label>
                                        <input type="text" className="ie-input" placeholder={`Tên file ngẫu nhiên...`} value={exportName} onChange={(e) => setExportName(e.target.value)} />
                                        <p className="form-help-text" style={{ marginTop: '6px' }}>Mặc định: Danh_Sach_Tai_Khoan_[Timestamp]</p>
                                    </div>

                                    <label className="form-label" style={{ fontWeight: 700 }}>Định dạng file xuất</label>
                                    <div className="ie-format-grid">
                                        <div className={`ie-format-card excel-card ${exportType === 'xlsx' ? 'selected' : ''}`} onClick={() => setExportType('xlsx')}>
                                            {Ico.fileExcel} <span>MS Excel</span>
                                        </div>
                                        <div className={`ie-format-card csv-card ${exportType === 'csv' ? 'selected' : ''}`} onClick={() => setExportType('csv')}>
                                            {Ico.fileCsv} <span>Dạng CSV</span>
                                        </div>
                                        <div className={`ie-format-card json-card ${exportType === 'json' ? 'selected' : ''}`} onClick={() => setExportType('json')}>
                                            {Ico.fileJson} <span>Dạng JSON</span>
                                        </div>
                                    </div>

                                    <div style={{ marginTop: '24px', padding: '16px', background: 'var(--primary-bg)', borderRadius: '12px', border: '1px solid var(--primary-bd)' }}>
                                        <div style={{ display: 'flex', gap: '10px', color: 'var(--primary)' }}>
                                          <span style={{ marginTop: '2px' }}>{Ico.info}</span>
                                          <span style={{ fontSize: '13.5px', lineHeight: '1.4' }}>
                                            Dữ liệu xuất sẽ bao gồm đầy đủ thông tin: Mã NV, Tên NV, Chức vụ, Số điện thoại và Trạng thái tài khoản hiện tại.
                                          </span>
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
