import React from 'react';

export const emptyPosition = { 
    TENCHUCVU: '', 
    MOTA: '',
};

export const PositionForm = ({ form, hc, setForm, readOnly }) => (
    <>
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
