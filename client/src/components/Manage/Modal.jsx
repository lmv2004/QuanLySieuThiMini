import React from 'react';

export const Modal = ({ title, onClose, children, actions }) => (
    <div className="modal-overlay" onClick={onClose}>
        <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <div className="modal-icon">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M8 1.5L2 5v5c0 3.5 2.5 6.7 6 7.5 3.5-.8 6-4 6-7.5V5L8 1.5z" stroke="#111" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                </div>
                <div className="modal-title">{title}</div>
            </div>
            <div className="form-grid">{children}</div>
            <div className="modal-actions">{actions}</div>
        </div>
    </div>
);
