"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
    AlertTriangle, AlertCircle, Info, CheckCircle2, X, Bell,
    Filter, Search, MapPin, Clock, ChevronRight, ArrowUpRight,
    Zap, WifiOff, Thermometer, ShieldAlert
} from 'lucide-react';

type Severity = 'critical' | 'warning' | 'info';
type AlertStatus = 'active' | 'acknowledged' | 'resolved';

interface Alert {
    id: string;
    title: string;
    description: string;
    severity: Severity;
    status: AlertStatus;
    location: string;
    zone: string;
    timestamp: string;
    category: string;
    poleId?: string;
}

const initialAlerts: Alert[] = [
    { id: 'ALT-001', title: 'ไฟดับต่อเนื่อง — Node F128', description: 'ตรวจพบเสาไฟหมายเลข F128 ไม่ตอบสนอง 3 ชั่วโมง อาจเกิดจากสายไฟขาดหรือฟิวส์ขาด', severity: 'critical', status: 'active', location: 'ถ.ยันตรกิจโกศล', zone: 'Zone 1', timestamp: '10 มี.ค. 2026 — 09:15', category: 'Power Outage', poleId: 'P1-3' },
    { id: 'ALT-002', title: 'แรงดันไฟฟ้าเกินเกณฑ์', description: 'แรงดันไฟฟ้าที่ Node C045 พุ่งสูงถึง 248V (เกณฑ์สูงสุด 240V) อาจทำให้อุปกรณ์เสียหาย', severity: 'critical', status: 'active', location: 'ถ.เจริญเมือง', zone: 'Zone 3', timestamp: '10 มี.ค. 2026 — 08:42', category: 'Voltage Surge', poleId: 'P3-1' },
    { id: 'ALT-003', title: 'อุณหภูมิบอร์ดควบคุมสูงผิดปกติ', description: 'อุณหภูมิบอร์ดควบคุม Node A012 สูงถึง 68°C (เกณฑ์เตือน 60°C) ควรตรวจสอบระบบระบายความร้อน', severity: 'warning', status: 'active', location: 'ถ.พระร่วง', zone: 'Zone 6', timestamp: '10 มี.ค. 2026 — 07:30', category: 'Temperature', poleId: 'P6-2' },
    { id: 'ALT-004', title: 'Gateway GW-04 สัญญาณอ่อน', description: 'LoRa Gateway บริเวณช่อแฮมีสัญญาณอ่อนลง 40% จากค่าปกติ อาจเกี่ยวกับสภาพอากาศ', severity: 'warning', status: 'acknowledged', location: 'ถ.ช่อแฮ', zone: 'Zone 28', timestamp: '10 มี.ค. 2026 — 06:15', category: 'Gateway' },
    { id: 'ALT-005', title: 'Node ขาดการเชื่อมต่อ 30 นาที', description: 'Node B087 ขาดการรายงานข้อมูลเกิน 30 นาที กำลังพยายามเชื่อมต่อซ้ำอัตโนมัติ', severity: 'warning', status: 'active', location: 'ถ.ชุมพล', zone: 'Zone 7', timestamp: '10 มี.ค. 2026 — 05:48', category: 'Connectivity', poleId: 'P7-4' },
    { id: 'ALT-006', title: 'การบำรุงรักษาตามกำหนด', description: 'โซน 14 (ถ.แพร่-สูงเม่น) ครบกำหนดการตรวจสอบบำรุงรักษาประจำไตรมาส', severity: 'info', status: 'active', location: 'ถ.แพร่-สูงเม่น', zone: 'Zone 14', timestamp: '10 มี.ค. 2026 — 00:00', category: 'Maintenance' },
    { id: 'ALT-007', title: 'อัปเดตเฟิร์มแวร์สำเร็จ', description: 'อุปกรณ์ 45 จุดในโซน 8 ได้รับการอัปเดตเฟิร์มแวร์เวอร์ชัน 3.2.1 เรียบร้อย', severity: 'info', status: 'resolved', location: 'ถ.ราษฎรบำรุง', zone: 'Zone 8', timestamp: '09 มี.ค. 2026 — 22:00', category: 'System Update' },
    { id: 'ALT-008', title: 'การใช้พลังงานสูงผิดปกติ', description: 'โซน 2 มีการใช้พลังงานสูงกว่าค่าเฉลี่ย 35% ในช่วง 2 ชั่วโมงที่ผ่านมา', severity: 'warning', status: 'active', location: 'ถ.ยันตรกิจโกศล (ใต้)', zone: 'Zone 2', timestamp: '10 มี.ค. 2026 — 04:20', category: 'Energy' },
    { id: 'ALT-009', title: 'สภาพอากาศแจ้งเตือน — ฝนตกหนัก', description: 'กรมอุตุนิยมวิทยาแจ้งเตือนฝนตกหนักในพื้นที่เมืองแพร่ ระวังน้ำท่วมขัง', severity: 'info', status: 'active', location: 'ทั่วพื้นที่เมืองแพร่', zone: 'All', timestamp: '10 มี.ค. 2026 — 03:00', category: 'Weather' },
    { id: 'ALT-010', title: 'เสาไฟเอียง — ตรวจพบจากเซ็นเซอร์', description: 'เซ็นเซอร์ Tilt ที่ Node D056 ตรวจพบเสาเอียง 12° จากแนวตั้ง ต้องส่งช่างตรวจสอบ', severity: 'critical', status: 'active', location: 'ถ.คำลือ', zone: 'Zone 9', timestamp: '10 มี.ค. 2026 — 02:35', category: 'Physical Damage', poleId: 'P9-1' },
];

const severityConfig: Record<Severity, { bg: string; fg: string; badgeBg: string; badgeFg: string; icon: React.ComponentType<any>; label: string }> = {
    critical: { bg: '#fef2f2', fg: '#dc2626', badgeBg: '#fee2e2', badgeFg: '#b91c1c', icon: AlertCircle, label: 'วิกฤต' },
    warning: { bg: '#fffbeb', fg: '#d97706', badgeBg: '#fef3c7', badgeFg: '#b45309', icon: AlertTriangle, label: 'เตือน' },
    info: { bg: '#eff6ff', fg: '#2563eb', badgeBg: '#dbeafe', badgeFg: '#1d4ed8', icon: Info, label: 'ข้อมูล' },
};

const statusConfig: Record<AlertStatus, { label: string; color: string; bg: string }> = {
    active: { label: 'กำลังดำเนินการ', color: '#dc2626', bg: '#fef2f2' },
    acknowledged: { label: 'รับทราบแล้ว', color: '#d97706', bg: '#fffbeb' },
    resolved: { label: 'แก้ไขแล้ว', color: '#059669', bg: '#ecfdf5' },
};

export default function AlertsPage() {
    const [alerts, setAlerts] = React.useState(initialAlerts);
    const [filterSeverity, setFilterSeverity] = React.useState<Severity | 'all'>('all');
    const [filterStatus, setFilterStatus] = React.useState<AlertStatus | 'all'>('all');
    const [expandedAlert, setExpandedAlert] = React.useState<string | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filtered = alerts.filter(a => {
        if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
        if (filterStatus !== 'all' && a.status !== filterStatus) return false;
        if (searchQuery && !a.title.toLowerCase().includes(searchQuery.toLowerCase()) && !a.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    const handleAcknowledge = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'acknowledged' as AlertStatus } : a));
    };

    const handleResolve = (id: string) => {
        setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' as AlertStatus } : a));
    };

    const criticalCount = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
    const warningCount = alerts.filter(a => a.severity === 'warning' && a.status === 'active').length;
    const infoCount = alerts.filter(a => a.severity === 'info' && a.status === 'active').length;
    const resolvedCount = alerts.filter(a => a.status === 'resolved').length;

    return (
        <MainLayout title="Alerts & Notifications">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Summary Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {[
                        { label: 'วิกฤต (Active)', value: criticalCount, color: '#dc2626', bg: '#fef2f2', icon: AlertCircle },
                        { label: 'เตือน (Active)', value: warningCount, color: '#d97706', bg: '#fffbeb', icon: AlertTriangle },
                        { label: 'ข้อมูล (Active)', value: infoCount, color: '#2563eb', bg: '#eff6ff', icon: Info },
                        { label: 'แก้ไขแล้ว', value: resolvedCount, color: '#059669', bg: '#ecfdf5', icon: CheckCircle2 },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9',
                            padding: '20px', display: 'flex', alignItems: 'center', gap: '14px',
                        }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: s.bg, color: s.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}><s.icon size={20} /></div>
                            <div>
                                <p style={{ fontSize: '24px', fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
                                <p style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', margin: '1px 0 0' }}>{s.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Filters */}
                <div style={{
                    background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9',
                    padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <Filter size={16} style={{ color: '#94a3b8' }} />
                        {(['all', 'critical', 'warning', 'info'] as const).map(s => (
                            <button key={s} onClick={() => setFilterSeverity(s)} style={{
                                padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s',
                                background: filterSeverity === s ? '#0f172a' : '#f8fafc',
                                color: filterSeverity === s ? '#fff' : '#64748b',
                            }}>
                                {s === 'all' ? 'ทั้งหมด' : s === 'critical' ? '🔴 วิกฤต' : s === 'warning' ? '🟡 เตือน' : '🔵 ข้อมูล'}
                            </button>
                        ))}
                        <span style={{ width: '1px', height: '20px', background: '#f1f5f9', margin: '0 4px' }} />
                        {(['all', 'active', 'acknowledged', 'resolved'] as const).map(s => (
                            <button key={s} onClick={() => setFilterStatus(s)} style={{
                                padding: '6px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                fontSize: '12px', fontWeight: 600, fontFamily: 'inherit', transition: 'all 0.15s',
                                background: filterStatus === s ? '#0f172a' : '#f8fafc',
                                color: filterStatus === s ? '#fff' : '#64748b',
                            }}>
                                {s === 'all' ? 'ทุกสถานะ' : statusConfig[s].label}
                            </button>
                        ))}
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text" placeholder="ค้นหาเหตุการณ์..." value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                padding: '8px 14px 8px 34px', borderRadius: '10px', border: '1px solid #f1f5f9',
                                background: '#f8fafc', fontSize: '13px', fontWeight: 500, color: '#334155',
                                outline: 'none', width: '220px', fontFamily: 'inherit',
                            }}
                        />
                    </div>
                </div>

                {/* Alert List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8' }}>
                            <Bell size={40} style={{ marginBottom: '12px', opacity: 0.3 }} />
                            <p style={{ fontSize: '14px', fontWeight: 600 }}>ไม่พบเหตุการณ์ตามเงื่อนไข</p>
                        </div>
                    )}
                    {filtered.map(alert => {
                        const sev = severityConfig[alert.severity];
                        const stat = statusConfig[alert.status];
                        const isExpanded = expandedAlert === alert.id;
                        const SevIcon = sev.icon;
                        return (
                            <div key={alert.id} style={{
                                background: '#fff', borderRadius: '16px', border: `1px solid ${alert.severity === 'critical' && alert.status === 'active' ? '#fecaca' : '#f1f5f9'}`,
                                overflow: 'hidden', transition: 'all 0.2s',
                            }}>
                                <div
                                    style={{
                                        padding: '18px 24px', display: 'flex', alignItems: 'center', gap: '16px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={() => setExpandedAlert(isExpanded ? null : alert.id)}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#fafbfc'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    {/* Icon */}
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                                        background: sev.bg, color: sev.fg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}><SevIcon size={18} /></div>

                                    {/* Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                            <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{alert.title}</h4>
                                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: sev.badgeBg, color: sev.badgeFg, textTransform: 'uppercase', flexShrink: 0 }}>{sev.label}</span>
                                            <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', background: stat.bg, color: stat.color, flexShrink: 0 }}>{stat.label}</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} /> {alert.location} ({alert.zone})</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {alert.timestamp}</span>
                                        </div>
                                    </div>

                                    <ChevronRight size={16} style={{ color: '#cbd5e1', transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
                                </div>

                                {/* Expanded */}
                                {isExpanded && (
                                    <div style={{
                                        padding: '0 24px 20px', borderTop: '1px solid #f8fafc',
                                    }}>
                                        <p style={{ fontSize: '13px', fontWeight: 500, color: '#475569', lineHeight: 1.7, margin: '14px 0' }}>
                                            {alert.description}
                                        </p>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {alert.status === 'active' && (
                                                <button onClick={(e) => { e.stopPropagation(); handleAcknowledge(alert.id); }} style={{
                                                    padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                                    background: '#fffbeb', color: '#b45309', fontSize: '12px', fontWeight: 700, fontFamily: 'inherit',
                                                }}>
                                                    📋 รับทราบ
                                                </button>
                                            )}
                                            {alert.status !== 'resolved' && (
                                                <button onClick={(e) => { e.stopPropagation(); handleResolve(alert.id); }} style={{
                                                    padding: '8px 18px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                                    background: '#ecfdf5', color: '#15803d', fontSize: '12px', fontWeight: 700, fontFamily: 'inherit',
                                                }}>
                                                    ✅ แก้ไขแล้ว
                                                </button>
                                            )}
                                            {alert.poleId && (
                                                <button style={{
                                                    padding: '8px 18px', borderRadius: '10px', border: '1px solid #f1f5f9', cursor: 'pointer',
                                                    background: '#fff', color: '#2563eb', fontSize: '12px', fontWeight: 700, fontFamily: 'inherit',
                                                    display: 'flex', alignItems: 'center', gap: '4px',
                                                }}>
                                                    <MapPin size={12} /> ดูบนแผนที่
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </MainLayout>
    );
}
