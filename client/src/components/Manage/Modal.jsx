import React from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({ title, onClose, children, actions, size }) => {
    const modalContent = (
        <div className="modal-overlay" onClick={onClose}>
            <div className={`modal-box ${size === 'xl' ? 'modal-xl' : ''}`} onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">{title}</div>
                </div>
                <div className="modal-content">{children}</div>
                <div className="modal-actions">{actions}</div>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
