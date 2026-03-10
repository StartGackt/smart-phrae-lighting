"use client";

import React from 'react';
import { TrendingUp, TrendingDown, LucideIcon } from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon: LucideIcon;
    trend?: { value: string; isUp: boolean };
    color: 'blue' | 'green' | 'orange' | 'red';
    description?: string;
}

const colorConfig = {
    blue: { bg: '#eff6ff', fg: '#2563eb' },
    green: { bg: '#ecfdf5', fg: '#059669' },
    orange: { bg: '#fffbeb', fg: '#d97706' },
    red: { bg: '#fef2f2', fg: '#dc2626' },
};

const StatCard = ({ title, value, subValue, icon: Icon, trend, color, description }: StatCardProps) => {
    const c = colorConfig[color];

    return (
        <div
            style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid #f1f5f9',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div
                    style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: c.bg,
                        color: c.fg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Icon size={22} strokeWidth={2} />
                </div>
                <span
                    style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#94a3b8',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                    }}
                >
                    {title}
                </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '4px' }}>
                <span style={{ fontSize: '36px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em', lineHeight: 1 }}>
                    {value}
                </span>
                {subValue && (
                    <span style={{ fontSize: '18px', fontWeight: 600, color: '#cbd5e1' }}>/ {subValue}</span>
                )}
            </div>

            <p style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', margin: '0 0 16px 0' }}>
                {description}
            </p>

            {trend && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {trend.isUp ? (
                        <TrendingUp size={14} style={{ color: '#059669' }} />
                    ) : (
                        <TrendingDown size={14} style={{ color: '#dc2626' }} />
                    )}
                    <span
                        style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            color: trend.isUp ? '#059669' : '#dc2626',
                        }}
                    >
                        {trend.value}
                    </span>
                </div>
            )}
        </div>
    );
};

export default StatCard;
