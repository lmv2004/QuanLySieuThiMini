import React from 'react';
import { EmptyState } from '../../components/Manage/EmptyState';
import { Ico } from '../../components/Manage/Icons';

export const ReportsPage = () => (
    <EmptyState 
        icon={Ico.chart} 
        title="Báo cáo doanh thu" 
        desc="Tính năng đang được phát triển" 
    />
);
