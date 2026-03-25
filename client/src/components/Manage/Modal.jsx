import React from 'react';

export const Modal = ({ title, onClose, children, actions }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <div className="modal-title">{title}</div>
            </div>
            <div className="modal-content">{children}</div>
            <div className="modal-actions">{actions}</div>
        </div>
    </div>
);
