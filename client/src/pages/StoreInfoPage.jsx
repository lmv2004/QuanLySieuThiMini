import React, { useState, useEffect } from 'react';
import { Ico } from '../components/Manage/Icons';
import { Toast } from '../components/Manage/Toast';
import api from '../services/api';
import './StoreInfoPage.css';

const StoreInfoPage = () => {
    const [companyInfo, setCompanyInfo] = useState({
        name: 'Siêu Thị Mini',
        address: '123 Đường ABC, Quận 1, TP.HCM',
        phone: 'Hotline: 0123 456 789',
        taxCode: 'MST: 0123456789',
        note: 'Cảm ơn quý khách và hẹn gặp lại!'
    });
    const [toasts, setToasts] = useState([]);
    const [loading, setLoading] = useState(false);

    const addToast = (type, message) => {
        const id = Date.now();
        setToasts(p => [...p, { id, type, message }]);
    };

    const removeToast = (id) => setToasts(p => p.filter(t => t.id !== id));

    useEffect(() => {
        // Load store info from API
        const loadStoreInfo = async () => {
            try {
                const response = await api.get('/store-info');
                if (response.data.success && response.data.data) {
                    setCompanyInfo({
                        name: response.data.data.name || '',
                        address: response.data.data.address || '',
                        phone: response.data.data.phone || '',
                        taxCode: response.data.data.tax_code || '',
                        note: response.data.data.note || ''
                    });
                }
            } catch (error) {
                console.error('Error loading store info:', error);
                // Fallback to localStorage if API fails
                const savedInfo = localStorage.getItem('storeInfo');
                if (savedInfo) {
                    try {
                        setCompanyInfo(JSON.parse(savedInfo));
                    } catch (e) {
                        console.error('Error parsing stored company info:', e);
                    }
                }
            }
        };

        loadStoreInfo();
    }, []);

    const handleSave = async () => {
        setLoading(true);
        try {
            const dataToSend = {
                name: companyInfo.name,
                address: companyInfo.address,
                phone: companyInfo.phone,
                tax_code: companyInfo.taxCode,
                note: companyInfo.note
            };

            const response = await api.post('/store-info', dataToSend);

            if (response.data.success) {
                addToast('success', 'Đã lưu thông tin cửa hàng thành công');
                // Also save to localStorage as backup
                localStorage.setItem('storeInfo', JSON.stringify(companyInfo));
            } else {
                throw new Error(response.data.message || 'Lỗi khi lưu thông tin');
            }
        } catch (error) {
            console.error('Error saving store info:', error);
            addToast('error', 'Lỗi khi lưu thông tin cửa hàng: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async () => {
        if (window.confirm('Bạn có chắc muốn khôi phục về mặc định?')) {
            const defaultInfo = {
                name: 'Siêu Thị Mini',
                address: '123 Đường ABC, Quận 1, TP.HCM',
                phone: 'Hotline: 0123 456 789',
                taxCode: 'MST: 0123456789',
                note: 'Cảm ơn quý khách và hẹn gặp lại!'
            };

            setLoading(true);
            try {
                const dataToSend = {
                    name: defaultInfo.name,
                    address: defaultInfo.address,
                    phone: defaultInfo.phone,
                    tax_code: defaultInfo.taxCode,
                    note: defaultInfo.note
                };

                const response = await api.post('/store-info', dataToSend);

                if (response.data.success) {
                    setCompanyInfo(defaultInfo);
                    localStorage.setItem('storeInfo', JSON.stringify(defaultInfo));
                    addToast('success', 'Đã khôi phục về mặc định');
                } else {
                    throw new Error(response.data.message || 'Lỗi khi khôi phục');
                }
            } catch (error) {
                console.error('Error resetting store info:', error);
                // Fallback to local update if API fails
                setCompanyInfo(defaultInfo);
                localStorage.setItem('storeInfo', JSON.stringify(defaultInfo));
                addToast('warning', 'Đã khôi phục cục bộ, vui lòng đồng bộ lại với server');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="store-info-page">
            <div className="toast-container">
                {toasts.map(t => (
                    <Toast key={t.id} type={t.type} message={t.message} onClose={() => removeToast(t.id)} />
                ))}
            </div>

            <div className="page-header">
                <div className="page-header-left">
                    <div className="page-icon">{Ico.store}</div>
                    <div>
                        <h1 className="page-title">Thông Tin Cửa Hàng</h1>
                        <p className="page-subtitle">Quản lý thông tin cửa hàng hiển thị trên hóa đơn</p>
                    </div>
                </div>
                <div className="page-header-actions">
                    <button
                        className="btn btn-secondary"
                        onClick={handleReset}
                        disabled={loading}
                    >
                        🔄 Khôi phục mặc định
                    </button>
                    <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                    </button>
                </div>
            </div>

            <div className="store-info-content">
                <div className="store-info-form">
                    <div className="form-section">
                        <h3 className="section-title">📋 Thông tin cơ bản</h3>
                        <div className="form-grid">
                            <div className="form-group">
                                <label>Tên cửa hàng *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={companyInfo.name}
                                    onChange={(e) => setCompanyInfo(p => ({ ...p, name: e.target.value }))}
                                    placeholder="Nhập tên cửa hàng"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Địa chỉ</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={companyInfo.address}
                                    onChange={(e) => setCompanyInfo(p => ({ ...p, address: e.target.value }))}
                                    placeholder="Nhập địa chỉ"
                                />
                            </div>
                            <div className="form-group">
                                <label>Số điện thoại</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={companyInfo.phone}
                                    onChange={(e) => setCompanyInfo(p => ({ ...p, phone: e.target.value }))}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                            <div className="form-group">
                                <label>Mã số thuế</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={companyInfo.taxCode}
                                    onChange={(e) => setCompanyInfo(p => ({ ...p, taxCode: e.target.value }))}
                                    placeholder="Nhập mã số thuế (nếu có)"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h3 className="section-title">💬 Ghi chú hóa đơn</h3>
                        <div className="form-group">
                            <label>Lời cảm ơn / Chính sách</label>
                            <textarea
                                className="form-textarea"
                                value={companyInfo.note}
                                onChange={(e) => setCompanyInfo(p => ({ ...p, note: e.target.value }))}
                                placeholder="Nhập lời cảm ơn hoặc chính sách đổi trả..."
                                rows={4}
                            />
                        </div>
                    </div>
                </div>

                <div className="store-info-preview">
                    <h3 className="preview-title">🖨️ Xem trước hóa đơn</h3>
                    <div className="invoice-preview">
                        <div className="invoice-header">
                            <div className="invoice-brand">
                                <div className="brand-name">{companyInfo.name || 'Tên cửa hàng'}</div>
                                {companyInfo.address && <div className="brand-line">{companyInfo.address}</div>}
                                {companyInfo.phone && <div className="brand-line">{companyInfo.phone}</div>}
                                {companyInfo.taxCode && <div className="brand-line">{companyInfo.taxCode}</div>}
                            </div>
                            <div className="invoice-meta">
                                <div>Mã hóa đơn: <strong>#HD-0001</strong></div>
                                <div>Ngày: {new Date().toLocaleDateString('vi-VN')}</div>
                            </div>
                        </div>

                        <div className="invoice-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên hàng</th>
                                        <th>SL</th>
                                        <th>Đơn giá</th>
                                        <th>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td>Sản phẩm mẫu</td>
                                        <td>1</td>
                                        <td>50,000</td>
                                        <td>50,000</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="invoice-summary">
                            <div className="summary-row">
                                <span>Tổng thanh toán</span>
                                <span>50,000 VND</span>
                            </div>
                        </div>

                        {companyInfo.note && (
                            <div className="invoice-note">{companyInfo.note}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreInfoPage;