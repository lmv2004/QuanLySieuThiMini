import React, { useEffect } from 'react';
import { Ico } from './Icons';

export const Toast = ({ type = 'success', message, onClose, duration = 3000 }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, duration);
        return () => clearTimeout(timer);
    }, [onClose, duration]);

    const config = {
        success: { icon: Ico.userCheck, title: 'Thành công' },
        error: { icon: Ico.ban, title: 'Lỗi hệ thống' },
        info: { icon: Ico.info, title: 'Thông báo' },
        warning: { icon: Ico.alertCircle || Ico.trash, title: 'Cảnh báo' }
    };

    const { icon, title } = config[type] || config.info;

    return (
        <div className={`toast-item toast-${type}`} style={{ '--duration': `${duration}ms` }}>
            <div className="toast-icon">{icon}</div>
            <div className="toast-body">
                <div className="toast-title">{title}</div>
                <div className="toast-msg">{message}</div>
            </div>
            <button className="toast-close" onClick={onClose}>
                {Ico.x}
            </button>
        </div>
    );
};
