"use client";

import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Info } from 'lucide-react';

const activities = [
    { id: 1, event: 'Node #F128 Dimming Set', location: 'Yantrakit Koson Rd.', status: 'Success', time: '14:20:05', type: 'success' },
    { id: 2, event: 'Device Offline Detected', location: 'Charoen Muang Rd.', status: 'Critical', time: '13:15:22', type: 'danger' },
    { id: 3, event: 'Power Surge Alert', location: 'Phra Ruang Road', status: 'Warning', time: '12:45:10', type: 'warning' },
    { id: 4, event: 'Schedule Update: Festive', location: 'System Wide', status: 'Info', time: '10:00:00', type: 'info' },
    { id: 5, event: 'Maintenance Scheduled', location: 'Chumphon Road', status: 'Pending', time: '09:30:45', type: 'info' },
];

const typeStyles: Record<string, { bg: string; fg: string; badgeBg: string; badgeFg: string }> = {
    success: { bg: '#f0fdf4', fg: '#16a34a', badgeBg: '#dcfce7', badgeFg: '#15803d' },
    danger: { bg: '#fef2f2', fg: '#dc2626', badgeBg: '#fee2e2', badgeFg: '#b91c1c' },
    warning: { bg: '#fffbeb', fg: '#d97706', badgeBg: '#fef3c7', badgeFg: '#b45309' },
    info: { bg: '#eff6ff', fg: '#2563eb', badgeBg: '#dbeafe', badgeFg: '#1d4ed8' },
};

const iconMap: Record<string, React.ReactNode> = {
    success: <CheckCircle2 size={16} />,
    danger: <AlertCircle size={16} />,
    warning: <Info size={16} />,
    info: <Clock size={16} />,
};

const ActivityTable = () => {
    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #f1f5f9',
            overflow: 'hidden',
        }}>
            {/* Header */}
            <div style={{
                padding: '24px 28px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #f1f5f9',
            }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>System Activity</h3>
                <button style={{
                    fontSize: '13px', fontWeight: 600, color: '#2563eb', background: '#eff6ff',
                    border: 'none', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer',
                    transition: 'background 0.2s',
                }}>
                    View All Logs
                </button>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#fafbfc' }}>
                        {['Event', 'Location', 'Status', 'Time'].map((h) => (
                            <th key={h} style={{
                                padding: '12px 28px', textAlign: 'left',
                                fontSize: '11px', fontWeight: 700, color: '#94a3b8',
                                textTransform: 'uppercase' as const, letterSpacing: '0.08em',
                            }}>{h}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {activities.map((a) => {
                        const s = typeStyles[a.type];
                        return (
                            <tr
                                key={a.id}
                                style={{
                                    borderTop: '1px solid #f8fafc',
                                    transition: 'background 0.15s',
                                    cursor: 'pointer',
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.background = '#fafbfc'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                            >
                                <td style={{ padding: '16px 28px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{
                                            width: '32px', height: '32px', borderRadius: '10px',
                                            background: s.bg, color: s.fg,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            flexShrink: 0,
                                        }}>
                                            {iconMap[a.type]}
                                        </div>
                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{a.event}</span>
                                    </div>
                                </td>
                                <td style={{ padding: '16px 28px', fontSize: '14px', fontWeight: 500, color: '#64748b' }}>
                                    {a.location}
                                </td>
                                <td style={{ padding: '16px 28px' }}>
                                    <span style={{
                                        fontSize: '11px', fontWeight: 700, padding: '4px 12px',
                                        borderRadius: '20px', background: s.badgeBg, color: s.badgeFg,
                                        textTransform: 'uppercase' as const, letterSpacing: '0.03em',
                                    }}>
                                        {a.status}
                                    </span>
                                </td>
                                <td style={{ padding: '16px 28px', fontSize: '14px', fontWeight: 600, color: '#94a3b8', fontVariantNumeric: 'tabular-nums' }}>
                                    {a.time}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ActivityTable;
