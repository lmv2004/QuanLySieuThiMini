import React, { useState, useRef, useEffect } from 'react';
import { FaChevronDown, FaCheckCircle, FaLock, FaClock } from 'react-icons/fa';

export const EliteSelect = ({ options, value, onChange, disabled, placeholder = 'Chọn...' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const containerRef = useRef(null);
    const searchInputRef = useRef(null);

    const selectedOption = options.find(opt => opt.value === value);

    const filteredOptions = options.filter(opt => 
        String(opt.label).toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => searchInputRef.current.focus(), 50);
            setSearchTerm('');
        }
    }, [isOpen]);

    return (
        <div className="elite-select-container" ref={containerRef}>
            <div 
                className={`elite-select-trigger ${isOpen ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
            >
                <div className="elite-select-value">
                    {selectedOption ? (
                        <>
                            <span className={selectedOption.iconClass}>{selectedOption.icon}</span>
                            {selectedOption.label}
                        </>
                    ) : (
                        <span style={{ color: 'var(--text-muted)' }}>{placeholder}</span>
                    )}
                </div>
                <FaChevronDown style={{ fontSize: 12, opacity: 0.5 }} />
            </div>

            {isOpen && (
                <div className="elite-select-dropdown">
                    <div className="elite-select-search-wrap">
                        <input 
                            ref={searchInputRef}
                            type="text" 
                            className="elite-select-search" 
                            placeholder="Tìm kiếm nhanh..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="elite-select-options">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((opt) => (
                                <div 
                                    key={opt.value}
                                    className={`elite-select-option ${value === opt.value ? 'selected' : ''}`}
                                    onClick={() => {
                                        onChange(opt.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className={opt.iconClass}>{opt.icon}</span>
                                    {opt.label}
                                </div>
                            ))
                        ) : (
                            <div className="elite-select-no-data">Không tìm thấy kết quả</div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
