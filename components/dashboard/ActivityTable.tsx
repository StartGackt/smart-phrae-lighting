"use client";

import React from 'react';
import { CheckCircle2, AlertCircle, Clock, Info, Cpu, Radio, Power, PowerOff } from 'lucide-react';
import { useDevices } from '@/contexts/DeviceContext';

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
    const { controllers, gateways } = useDevices();

    // Generate activities from actual device data
    const activities = React.useMemo(() => {
        const items: { id: number; event: string; location: string; status: string; time: string; type: string; }[] = [];

        // Fault controllers → Critical events
        controllers.filter(c => c.status === 'fault').slice(0, 2).forEach((c, i) => {
            items.push({
                id: items.length + 1,
                event: `อุปกรณ์ออฟไลน์ — ${c.id}`,
                location: c.zone,
                status: 'วิกฤต',
                time: `0${9 - i}:${15 + i * 10}:00`,
                type: 'danger',
            });
        });

        // Warning controllers → Warning events
        controllers.filter(c => c.status === 'warning').slice(0, 2).forEach((c, i) => {
            items.push({
                id: items.length + 1,
                event: `อุณหภูมิผิดปกติ — ${c.id} (${c.temperature}°C)`,
                location: c.zone,
                status: 'เฝ้าระวัง',
                time: `0${8 - i}:${30 + i * 5}:00`,
                type: 'warning',
            });
        });

        // Recently toggled on → Success events  
        controllers.filter(c => c.isOn && c.status === 'online').slice(0, 2).forEach((c, i) => {
            items.push({
                id: items.length + 1,
                event: `ปรับความสว่าง ${c.intensity}% — ${c.id}`,
                location: c.zone,
                status: 'ปกติ',
                time: `${14 - i}:${20 + i * 12}:05`,
                type: 'success',
            });
        });

        // Gateway status
        const gwWarning = gateways.find(g => g.status === 'warning');
        if (gwWarning) {
            items.push({
                id: items.length + 1,
                event: `สัญญาณเกตเวย์อ่อน — ${gwWarning.name} (${gwWarning.signal}%)`,
                location: gwWarning.location,
                status: 'เฝ้าระวัง',
                time: '07:45:00',
                type: 'warning',
            });
        }

        // System info
        items.push({
            id: items.length + 1,
            event: `รายงานสถานะระบบ — ทำงานอยู่ ${controllers.filter(c => c.isOn).length}/${controllers.length} อุปกรณ์`,
            location: 'ระบบรวม',
            status: 'ข้อมูล',
            time: '06:00:00',
            type: 'info',
        });

        return items.slice(0, 6);
    }, [controllers, gateways]);

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
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>บันทึกเหตุการณ์ (System Activity)</h3>
                <button style={{
                    fontSize: '13px', fontWeight: 600, color: '#2563eb', background: '#eff6ff',
                    border: 'none', padding: '8px 18px', borderRadius: '10px', cursor: 'pointer',
                    transition: 'background 0.2s',
                }}>
                    ดูบันทึกทั้งหมด
                </button>
            </div>

            {/* Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#fafbfc' }}>
                        {['เหตุการณ์', 'ตำแหน่ง', 'สถานะ', 'เวลา'].map((h) => (
                            <th key={h} style={{
                                padding: '12px 28px', textAlign: 'left',
                                fontSize: '12px', fontWeight: 700, color: '#94a3b8',
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
