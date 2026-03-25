import React, { useState } from 'react';
import { TableActions } from '../../components/TableActions';
import { disposalService } from '../../services/disposalService';
import { Modal } from '../../components/Manage/Modal';
import { Ico } from '../../components/Manage/Icons';

export const DisposalActions = ({ item, openEdit, del, list, setList, addToast, openView, primaryKey = 'MAPHIEU' }) => {
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmMode, setConfirmMode] = useState('approve'); // 'approve', 'reopen', 'delete'
    const [loading, setLoading] = useState(false);

    const handleAction = async () => {
        setLoading(true);
        try {
            let res;
            let updatedItem;
            
            if (confirmMode === 'approve') {
                res = await disposalService.approve(item[primaryKey]);
                updatedItem = res.data || res;
                addToast('success', `Đã duyệt phiếu DSP-${String(item[primaryKey]).padStart(3, '0')} thành công.`);
            } else if (confirmMode === 'reopen') {
                res = await disposalService.reopen(item[primaryKey]);
                updatedItem = res.data || res;
                addToast('success', `Đã mở lại phiếu DSP-${String(item[primaryKey]).padStart(3, '0')}.`);
            } else if (confirmMode === 'delete') {
                await disposalService.delete(item[primaryKey]);
                setList(list.filter(x => x[primaryKey] !== item[primaryKey]));
                addToast('success', `Đã xóa phiếu DSP-${String(item[primaryKey]).padStart(3, '0')} thành công.`);
                setShowConfirm(false);
                return;
            }
            
            setList(list.map(x => x[primaryKey] === item[primaryKey] ? updatedItem : x));
        } catch (err) {
            console.error('Lỗi thao tác phiếu', err);
            addToast('error', err.response?.data?.message || 'Không thể thực hiện thao tác này.');
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    const isApproved = item.TRANGTHAI === 'APPROVED';

    const getModeColor = () => {
        if (confirmMode === 'approve') return '#10b981';
        if (confirmMode === 'delete') return '#ef4444';
        return '#3b82f6';
    };

    const renderIcon = () => {
        const color = getModeColor();
        const size = 56; // Reduced from 64
        if (confirmMode === 'approve') {
            return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
        }
        if (confirmMode === 'delete') {
            return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>;
        }
        return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38"/></svg>;
    };

    const id = `DSP-${String(item[primaryKey]).padStart(3, '0')}`;
    
    return (
        <>
            <TableActions
                item={item}
                primaryKey={primaryKey}
                openEdit={!isApproved ? openEdit : null}
                del={!isApproved ? () => { setConfirmMode('delete'); setShowConfirm(true); } : null}
                onApprove={!isApproved ? () => { setConfirmMode('approve'); setShowConfirm(true); } : null}
                onReopen={isApproved ? () => { setConfirmMode('reopen'); setShowConfirm(true); } : null}
                openView={openView}
            />

            {showConfirm && (
                <Modal
                    title={confirmMode === 'approve' ? "Xác nhận duyệt" : confirmMode === 'reopen' ? "Xác nhận mở lại" : "Xác nhận xóa"}
                    onClose={() => setShowConfirm(false)}
                    actions={
                        <>
                            <button className="btn-secondary" onClick={() => setShowConfirm(false)} disabled={loading}>Hủy bỏ</button>
                            <button 
                                className="btn-primary" 
                                style={{ background: getModeColor(), borderColor: getModeColor(), minWidth: '120px' }} 
                                onClick={handleAction}
                                disabled={loading}
                            >
                                {loading ? 'Đang xử lý...' : (confirmMode === 'approve' ? 'Duyệt ngay' : confirmMode === 'reopen' ? 'Mở lại ngay' : 'Xóa ngay')}
                            </button>
                        </>
                    }
                >
                    <div style={{ padding: '10px 0', textAlign: 'center' }}>
                        <div style={{ marginBottom: '12px' }}>
                            {renderIcon()}
                        </div>
                        <h3 style={{ fontSize: '17px', color: 'var(--text-main)', marginBottom: '8px' }}>
                            {confirmMode === 'approve' ? `Duyệt phiếu tiêu hủy "${id}"?` : 
                             confirmMode === 'reopen' ? `Mở lại phiếu tiêu hủy "${id}"?` : `Xoá phiếu tiêu hủy "${id}"?`}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.4', maxWidth: '380px', margin: '0 auto' }}>
                            {confirmMode === 'approve' ? 'Tồn kho sẽ bị trừ tương ứng sau khi duyệt.' : 
                             confirmMode === 'reopen' ? 'Phiếu sẽ trở lại trạng thái chờ duyệt.' : 
                             'Hành động này không thể hoàn tác.'}
                        </p>
                    </div>
                </Modal>
            )}
        </>
    );
};
