import React, { useRef, useState } from 'react';
import { Ico } from '../../components/Manage/Icons';
import { Modal } from '../../components/Manage/Modal';

export const InvoiceImportExport = ({ onRefresh, addToast, data, columns }) => {
    const fileRef = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
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

    const handleOpen = () => { resetForm(); setIsOpen(true); };
    const handleClose = () => { setIsOpen(false); setTimeout(resetForm, 300); };
    const handleFileSelect = (e) => { const file = e.target.files[0]; if (file) setImportFile(file); };

    const handleSubmit = () => {
        if (mode === 'import') {
            if (!importFile) {
                addToast?.('error', 'Vui lòng chọn file dữ liệu!');
                return;
            }
            addToast?.('success', `Đã nhận file ${importFile.name} (Chức năng import đang mô phỏng)`);
            if (onRefresh) onRefresh();
            handleClose();
        } else {
            if (!data || data.length === 0) {
                addToast?.('error', 'Không có dữ liệu để xuất');
                return;
            }
            addToast?.('success', `Đã xuất dữ liệu ra file (Chức năng export đang mô phỏng)`);
            handleClose();
        }
    };

    return (
        <div className="invoice-import-export">
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
                                    <label className="form-label">Chọn tệp tải lên</label>
                                    <div className="ie-upload-area" onClick={() => fileRef.current?.click()}>
                                        <input type="file" ref={fileRef} style={{ display: 'none' }} onChange={handleFileSelect} accept=".xlsx, .xls, .csv, .json" />
                                        <div className="ie-upload-icon">{Ico.upload}</div>
                                        {importFile ? (
                                            <div className="ie-file-selected">
                                                <strong>{importFile.name}</strong><span>{(importFile.size / 1024).toFixed(1)} KB</span>
                                            </div>
                                       ) : (
                                            <div className="ie-upload-text">
                                                <strong>Nhấn để chọn hoặc kéo thả file vào đây</strong>
                                                <span>Hỗ trợ định dạng: .xlsx, .csv, .json</span>
                                            </div>
                                       )}
                                    </div>
                                    <p className="form-help-text">Lưu ý: Tệp dữ liệu cần có cấu trúc cột theo quy chuẩn gốc.</p>
                                </div>
                            ) : (
                                <div className="ie-form-section">
                                    <div className="form-group">
                                        <label className="form-label" style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', display: 'block' }}>Tên tệp xuất</label>
                                        <input type="text" className="ie-input" placeholder={`invoices_${new Date().getTime()}`} value={exportName} onChange={(e) => setExportName(e.target.value)} />
                                    </div>

                                    <div className="form-group" style={{ marginTop: '16px' }}>
                                        <label className="form-label">Định dạng file</label>
                                        <div className="ie-format-grid">
                                            <div className={`ie-format-card excel-card ${exportType === 'xlsx' ? 'selected' : ''}`} onClick={() => setExportType('xlsx')}>{Ico.fileExcel}<span>Excel</span></div>
                                            <div className={`ie-format-card csv-card ${exportType === 'csv' ? 'selected' : ''}`} onClick={() => setExportType('csv')}>{Ico.fileCsv}<span>CSV</span></div>
                                            <div className={`ie-format-card json-card ${exportType === 'json' ? 'selected' : ''}`} onClick={() => setExportType('json')}>{Ico.fileJson}<span>JSON</span></div>
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
