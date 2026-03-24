import React, { useState } from 'react';
import { TableActions } from '../../components/TableActions';
import { accountService } from '../../services/accountService';
import { Modal } from '../../components/Manage/Modal';

export const AccountActions = ({ item, openEdit, del, list, setList, addToast, openView }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Toggle User Lock Status
    const toggleLock = async () => {
        setLoading(true);
        try {
            const newStatus = !item.KHOA_TK;
            await accountService.update(item.SOTK, { KHOA_TK: newStatus });
            setList(list.map(x => x.SOTK === item.SOTK ? { ...x, KHOA_TK: newStatus } : x));
            addToast('success', newStatus ? 'Đã khóa tài khoản thành công' : 'Đã mở khóa tài khoản thành công');
        } catch (err) {
            console.error('Lỗi khóa tài khoản', err);
            addToast('error', 'Chỉ tài khoản admin mới có quyền thực hiện thao tác này');
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    const isLocking = !item.KHOA_TK;

    return (
        <>
            <TableActions
                item={item}
                primaryKey="SOTK"
                openEdit={openEdit}
                del={del}
                onLock={() => setShowConfirm(true)}
                isLocked={item.KHOA_TK}
                openView={openView}
            />

            {showConfirm && (
                <Modal
                    title={isLocking ? "Xác nhận khóa tài khoản" : "Xác nhận mở khóa"}
                    onClose={() => setShowConfirm(false)}
                    actions={
                        <>
                            <button className="btn-secondary" onClick={() => setShowConfirm(false)} disabled={loading}>Hủy bỏ</button>
                            <button 
                                className="btn-primary" 
                                style={{ background: isLocking ? '#f59e0b' : '#10b981', borderColor: isLocking ? '#f59e0b' : '#10b981', minWidth: '120px' }} 
                                onClick={toggleLock}
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : (isLocking ? 'Khóa ngay' : 'Mở khóa ngay')}
                            </button>
                        </>
                    }
                >
                    <div style={{ padding: '20px 0', textAlign: 'center' }}>
                        <div style={{ color: isLocking ? '#f59e0b' : '#10b981', marginBottom: '16px' }}>
                            {isLocking ? (
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                            ) : (
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                            )}
                        </div>
                        <h3 style={{ fontSize: '18px', color: 'var(--text-main)', marginBottom: '8px' }}>
                            Bạn muốn {isLocking ? 'khóa' : 'mở khóa'} tài khoản của "{item.nhanVien?.TENNV || item.TENTK}"?
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '15px', lineHeight: '1.5' }}>
                            {isLocking ? 
                                'Sau khi khóa, nhân viên này sẽ không thể đăng nhập hoặc thực hiện bất kỳ thao tác nào trên hệ thống.' : 
                                'Nhân viên sẽ có thể đăng nhập và làm việc lại ngay lập tức sau khi được mở khóa.'
                            }
                        </p>
                    </div>
                </Modal>
            )}
        </>
    );
};
