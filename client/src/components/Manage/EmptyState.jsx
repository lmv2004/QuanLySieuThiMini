import React from 'react';

export const EmptyState = ({ icon, title, desc }) => (
    <div className="empty-state">
        <div className="empty-icon">{icon}</div>
        <div className="empty-title">{title}</div>
        <div className="empty-desc">{desc}</div>
    </div>
);
