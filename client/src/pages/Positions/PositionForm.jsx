import React from 'react';

export const emptyPosition = { 
    CODE: '',
    TENCHUCVU: '', 
    MOTA: '',
};

export const PositionForm = ({ form, hc, setForm, readOnly }) => (
    <>
        <div className="form-group">
            <label className="form-label">Code</label>
            <input 
                className="form-input" 
                name="CODE" 
                value={form.CODE || ''} 
                onChange={hc} 
                placeholder="manager, cashier, warehouse..." 
                readOnly={readOnly}
                style={{ fontFamily: 'var(--mono)', letterSpacing: 0.5 }}
            />
        </div>
        <div className="form-group">
            <label className="form-label">Tên chức vụ</label>
            <input 
                className="form-input" 
                name="TENCHUCVU" 
                value={form.TENCHUCVU || ''} 
                onChange={hc} 
                placeholder="Thu ngân, Thủ kho, Quản lý..." 
                readOnly={readOnly}
            />
        </div>
        <div className="form-group">
            <label className="form-label">Mô tả</label>
            <textarea 
                className="form-input" 
                name="MOTA" 
                value={form.MOTA || ''} 
                onChange={hc} 
                placeholder="Mô tả vai trò và trách nhiệm của chức vụ"
                rows={3}
                readOnly={readOnly}
                style={{ resize: 'vertical' }}
            />
        </div>
    </>
);
