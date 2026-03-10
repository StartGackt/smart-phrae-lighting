"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
    AlertTriangle, AlertCircle, Info, CheckCircle2, X, Bell,
    Filter, Search, MapPin, Clock, ChevronRight, ArrowUpRight,
    Zap, WifiOff, Thermometer, ShieldAlert
} from 'lucide-react';
import { useDevices } from '@/contexts/DeviceContext';

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
    const { controllers, gateways, zones } = useDevices();

    // Generate alerts from real device data
    const generatedAlerts = React.useMemo<Alert[]>(() => {
        const items: Alert[] = [];
        let seq = 1;

        // Fault controllers → Critical alerts
        controllers.filter(c => c.status === 'fault').forEach((c, i) => {
            items.push({
                id: `ALT-${String(seq++).padStart(3, '0')}`,
                title: `ไฟดับต่อเนื่อง — ${c.id}`,
                description: `ตรวจพบเสาไฟ ${c.id} (${c.zone}) ไม่ตอบสนอง สถานะ Fault — แรงดัน ${c.voltage}V, อุณหภูมิ ${c.temperature}°C`,
                severity: 'critical',
                status: 'active',
                location: c.zone,
                zone: `Zone ${c.zoneId}`,
                timestamp: `10 มี.ค. 2026 — ${String(9 - (i % 8)).padStart(2, '0')}:${String(15 + i * 7).padStart(2, '0').slice(0, 2)}`,
                category: 'Power Outage',
                poleId: c.id,
            });
        });

        // High-temperature controllers → Warning alerts
        controllers.filter(c => c.status === 'warning' && parseFloat(c.temperature) > 55).slice(0, 6).forEach((c, i) => {
            items.push({
                id: `ALT-${String(seq++).padStart(3, '0')}`,
                title: `อุณหภูมิบอร์ดควบคุมสูงผิดปกติ — ${c.id}`,
                description: `อุณหภูมิบอร์ดควบคุม ${c.id} สูงถึง ${c.temperature}°C (เกณฑ์เตือน 55°C) ควรตรวจสอบระบบระบายความร้อน — แรงดัน ${c.voltage}V กำลังไฟ ${c.power}kW`,
                severity: 'warning',
                status: 'active',
                location: c.zone,
                zone: `Zone ${c.zoneId}`,
                timestamp: `10 มี.ค. 2026 — ${String(7 - (i % 6)).padStart(2, '0')}:${String(30 + i * 5).padStart(2, '0').slice(0, 2)}`,
                category: 'Temperature',
                poleId: c.id,
            });
        });

        // Warning controllers (low voltage) → Warning alerts  
        controllers.filter(c => c.status === 'warning' && parseFloat(c.voltage) < 210).slice(0, 3).forEach((c, i) => {
            items.push({
                id: `ALT-${String(seq++).padStart(3, '0')}`,
                title: `แรงดันไฟฟ้าต่ำกว่าเกณฑ์ — ${c.id}`,
                description: `แรงดันไฟฟ้าที่ ${c.id} ลดลงเหลือ ${c.voltage}V (เกณฑ์ต่ำสุด 210V) อาจส่งผลให้โคมไฟสว่างไม่เต็มประสิทธิภาพ`,
                severity: 'warning',
                status: 'active',
                location: c.zone,
                zone: `Zone ${c.zoneId}`,
                timestamp: `10 มี.ค. 2026 — ${String(6 - i).padStart(2, '0')}:15`,
                category: 'Voltage',
                poleId: c.id,
            });
        });

        // Gateway warnings
        gateways.filter(g => g.status === 'warning' || g.signal < 60).slice(0, 2).forEach((g, i) => {
            items.push({
                id: `ALT-${String(seq++).padStart(3, '0')}`,
                title: `Gateway ${g.name} สัญญาณอ่อน (${g.signal}%)`,
                description: `LoRa Gateway ${g.name} บริเวณ${g.location} มีสัญญาณ ${g.signal}% ครอบคลุม ${g.coverage} เสาไฟ อาจเกิดจากสภาพอากาศหรือสิ่งกีดขวาง`,
                severity: 'warning',
                status: 'acknowledged',
                location: g.location,
                zone: `Zone ${g.zoneIds.join(', ')}`,
                timestamp: `10 มี.ค. 2026 — 06:${String(15 + i * 20).padStart(2, '0')}`,
                category: 'Gateway',
            });
        });

        // Info alerts (system-level)
        items.push({
            id: `ALT-${String(seq++).padStart(3, '0')}`,
            title: 'สรุปสถานะระบบประจำวัน',
            description: `ระบบมีเสาไฟทั้งหมด ${controllers.length} ต้น, เปิดอยู่ ${controllers.filter(c => c.isOn).length} ต้น, Gateway ${gateways.length} ชุด — พลังงานรวม ${controllers.filter(c => c.isOn).reduce((s, c) => s + parseFloat(c.power), 0).toFixed(1)} kW`,
            severity: 'info',
            status: 'active',
            location: 'ทั่วพื้นที่เมืองแพร่',
            zone: `All ${zones.length} Zones`,
            timestamp: '10 มี.ค. 2026 — 06:00',
            category: 'System',
        });

        items.push({
            id: `ALT-${String(seq++).padStart(3, '0')}`,
            title: `Firmware Update พร้อมติดตั้ง v2.4.0`,
            description: `มีเฟิร์มแวร์เวอร์ชัน 2.4.0 พร้อมอัปเดตสำหรับอุปกรณ์ ${controllers.length} ชุด — แก้ไขปัญหาการรายงานค่า Dimming`,
            severity: 'info',
            status: 'active',
            location: 'ระบบรวม',
            zone: 'All',
            timestamp: '09 มี.ค. 2026 — 22:00',
            category: 'System Update',
        });

        return items;
    }, [controllers, gateways, zones]);

    const [alerts, setAlerts] = React.useState<Alert[]>([]);
    React.useEffect(() => { setAlerts(generatedAlerts); }, [generatedAlerts]);

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
