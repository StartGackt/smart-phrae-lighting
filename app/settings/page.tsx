"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
    Users, Shield, Gauge, Radio, Save, Plus, Pencil, Trash2,
    Wifi, WifiOff, CheckCircle2, AlertTriangle, Settings as SettingsIcon,
    ChevronRight, Bell
} from 'lucide-react';
import { useDevices } from '@/contexts/DeviceContext';

type TabId = 'users' | 'thresholds' | 'gateways' | 'notifications';

interface User {
    id: string; name: string; email: string; role: 'Admin' | 'Technician' | 'Viewer';
    lastLogin: string; status: 'active' | 'inactive';
}

const initialUsers: User[] = [
    { id: '1', name: 'สมชาย วงษ์แพร่', email: 'somchai@phrae.go.th', role: 'Admin', lastLogin: '10 มี.ค. 2026', status: 'active' },
    { id: '2', name: 'สมหญิง ใจดี', email: 'somying@phrae.go.th', role: 'Technician', lastLogin: '09 มี.ค. 2026', status: 'active' },
    { id: '3', name: 'วิทยา เทคนิค', email: 'wittaya@phrae.go.th', role: 'Technician', lastLogin: '08 มี.ค. 2026', status: 'active' },
    { id: '4', name: 'ประยุทธ์ ผู้จัดการ', email: 'prayut@phrae.go.th', role: 'Admin', lastLogin: '07 มี.ค. 2026', status: 'active' },
    { id: '5', name: 'กานดา ดูข้อมูล', email: 'kanda@phrae.go.th', role: 'Viewer', lastLogin: '01 มี.ค. 2026', status: 'inactive' },
];

const initialThresholds = {
    voltageMin: 200, voltageMax: 240, voltageUnit: 'V',
    tempWarning: 55, tempCritical: 70, tempUnit: '°C',
    powerMax: 0.5, powerUnit: 'kW',
    offlineTimeout: 30, offlineUnit: 'นาที',
    tiltAngle: 10, tiltUnit: '°',
};

const roleColors: Record<string, { bg: string; fg: string }> = {
    Admin: { bg: '#eff6ff', fg: '#2563eb' },
    Technician: { bg: '#ecfdf5', fg: '#059669' },
    Viewer: { bg: '#f8fafc', fg: '#64748b' },
};

const tabs: { id: TabId; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'users', label: 'จัดการผู้ใช้', icon: Users },
    { id: 'thresholds', label: 'เกณฑ์การแจ้งเตือน', icon: Gauge },
    { id: 'gateways', label: 'LoRa Gateway', icon: Radio },
    { id: 'notifications', label: 'การแจ้งเตือน', icon: Bell },
];

export default function SettingsPage() {
    const { gateways, controllers, toggleController } = useDevices();
    const [activeTab, setActiveTab] = React.useState<TabId>('users');
    const [expandedGateway, setExpandedGateway] = React.useState<string | null>(null);
    const [users] = React.useState(initialUsers);
    const [thresholds, setThresholds] = React.useState(initialThresholds);
    const [saved, setSaved] = React.useState(false);

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
    };

    return (
        <MainLayout title="System Settings">
            <div style={{ display: 'flex', gap: '24px' }}>
                {/* Left Tabs */}
                <div style={{
                    width: '240px', flexShrink: 0, background: '#fff', borderRadius: '16px',
                    border: '1px solid #f1f5f9', padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px',
                    alignSelf: 'flex-start',
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '12px 14px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                                background: activeTab === tab.id ? '#eff6ff' : 'transparent',
                                color: activeTab === tab.id ? '#2563eb' : '#64748b',
                                fontSize: '13px', fontWeight: 600, fontFamily: 'inherit',
                                transition: 'all 0.15s', textAlign: 'left', width: '100%',
                            }}
                        >
                            <tab.icon size={18} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Right Content */}
                <div style={{ flex: 1 }}>
                    {/* Users Tab */}
                    {activeTab === 'users' && (
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
                            <div style={{
                                padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                borderBottom: '1px solid #f1f5f9',
                            }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>จัดการผู้ใช้งาน</h3>
                                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>จัดการสิทธิ์การเข้าถึงของเจ้าหน้าที่</p>
                                </div>
                                <button style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '10px 20px', borderRadius: '12px', border: 'none',
                                    background: '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 600,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                }}>
                                    <Plus size={16} /> เพิ่มผู้ใช้
                                </button>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#fafbfc' }}>
                                        {['ชื่อ-นามสกุล', 'อีเมล', 'บทบาท', 'เข้าสู่ระบบล่าสุด', 'สถานะ', 'จัดการ'].map(h => (
                                            <th key={h} style={{
                                                padding: '12px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 700,
                                                color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em',
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => {
                                        const rc = roleColors[u.role];
                                        return (
                                            <tr key={u.id} style={{ borderTop: '1px solid #f8fafc' }}>
                                                <td style={{ padding: '14px 24px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div style={{
                                                            width: '36px', height: '36px', borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            fontSize: '12px', fontWeight: 700, color: '#2563eb',
                                                        }}>{u.name[0]}</div>
                                                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{u.name}</span>
                                                    </div>
                                                </td>
                                                <td style={{ padding: '14px 24px', fontSize: '13px', color: '#64748b' }}>{u.email}</td>
                                                <td style={{ padding: '14px 24px' }}>
                                                    <span style={{
                                                        fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px',
                                                        background: rc.bg, color: rc.fg,
                                                    }}>{u.role}</span>
                                                </td>
                                                <td style={{ padding: '14px 24px', fontSize: '13px', color: '#94a3b8' }}>{u.lastLogin}</td>
                                                <td style={{ padding: '14px 24px' }}>
                                                    <span style={{
                                                        width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block',
                                                        background: u.status === 'active' ? '#22c55e' : '#cbd5e1', marginRight: '6px',
                                                    }} />
                                                    <span style={{ fontSize: '13px', color: u.status === 'active' ? '#059669' : '#94a3b8', fontWeight: 600 }}>
                                                        {u.status === 'active' ? 'Active' : 'Inactive'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: '14px 24px', display: 'flex', gap: '4px' }}>
                                                    <button style={{ padding: '6px', borderRadius: '8px', border: 'none', background: '#f8fafc', cursor: 'pointer', color: '#64748b' }}><Pencil size={14} /></button>
                                                    <button style={{ padding: '6px', borderRadius: '8px', border: 'none', background: '#f8fafc', cursor: 'pointer', color: '#ef4444' }}><Trash2 size={14} /></button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Thresholds Tab */}
                    {activeTab === 'thresholds' && (
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '28px' }}>
                            <div style={{ marginBottom: '28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>เกณฑ์การแจ้งเตือน (Threshold)</h3>
                                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>กำหนดค่าที่ยอมรับได้ เมื่อค่าเกินจะส่งแจ้งเตือนอัตโนมัติ</p>
                                </div>
                                <button onClick={handleSave} style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '10px 20px', borderRadius: '12px', border: 'none',
                                    background: saved ? '#059669' : '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 600,
                                    cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.3s',
                                }}>
                                    {saved ? <><CheckCircle2 size={16} /> บันทึกแล้ว!</> : <><Save size={16} /> บันทึกการเปลี่ยนแปลง</>}
                                </button>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {/* Voltage */}
                                <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '20px' }}>
                                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#2563eb', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Gauge size={16} /> แรงดันไฟฟ้า
                                    </p>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>ค่าต่ำสุด (V)</label>
                                            <input type="number" value={thresholds.voltageMin} onChange={(e) => setThresholds({ ...thresholds, voltageMin: +e.target.value })}
                                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, outline: 'none', fontFamily: 'inherit' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>ค่าสูงสุด (V)</label>
                                            <input type="number" value={thresholds.voltageMax} onChange={(e) => setThresholds({ ...thresholds, voltageMax: +e.target.value })}
                                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, outline: 'none', fontFamily: 'inherit' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Temperature */}
                                <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '20px' }}>
                                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#f59e0b', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <AlertTriangle size={16} /> อุณหภูมิ
                                    </p>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>ระดับเตือน (°C)</label>
                                            <input type="number" value={thresholds.tempWarning} onChange={(e) => setThresholds({ ...thresholds, tempWarning: +e.target.value })}
                                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, outline: 'none', fontFamily: 'inherit' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>ระดับวิกฤต (°C)</label>
                                            <input type="number" value={thresholds.tempCritical} onChange={(e) => setThresholds({ ...thresholds, tempCritical: +e.target.value })}
                                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, outline: 'none', fontFamily: 'inherit' }} />
                                        </div>
                                    </div>
                                </div>

                                {/* Power */}
                                <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '20px' }}>
                                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#059669', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <Gauge size={16} /> กำลังไฟฟ้าสูงสุด
                                    </p>
                                    <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>ค่าสูงสุดต่อจุด (kW)</label>
                                    <input type="number" step="0.01" value={thresholds.powerMax} onChange={(e) => setThresholds({ ...thresholds, powerMax: +e.target.value })}
                                        style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, outline: 'none', fontFamily: 'inherit' }} />
                                </div>

                                {/* Offline Timeout */}
                                <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '20px' }}>
                                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#dc2626', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <WifiOff size={16} /> เวลาตัดการเชื่อมต่อ
                                    </p>
                                    <div style={{ display: 'flex', gap: '12px' }}>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>Timeout (นาที)</label>
                                            <input type="number" value={thresholds.offlineTimeout} onChange={(e) => setThresholds({ ...thresholds, offlineTimeout: +e.target.value })}
                                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, outline: 'none', fontFamily: 'inherit' }} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <label style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: '6px' }}>มุมเอียงสูงสุด (°)</label>
                                            <input type="number" value={thresholds.tiltAngle} onChange={(e) => setThresholds({ ...thresholds, tiltAngle: +e.target.value })}
                                                style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '14px', fontWeight: 600, outline: 'none', fontFamily: 'inherit' }} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Gateways Tab */}
                    {activeTab === 'gateways' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{
                                background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9',
                                padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            }}>
                                <div>
                                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>LoRa Gateway Status</h3>
                                    <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0' }}>ตรวจสอบสถานะอุปกรณ์แม่ข่ายที่กระจายอยู่ทั่วเมืองแพร่</p>
                                </div>
                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <div style={{
                                        padding: '8px 16px', borderRadius: '10px', background: '#ecfdf5',
                                        fontSize: '13px', fontWeight: 700, color: '#059669',
                                    }}>🟢 Online: {gateways.filter(g => g.status === 'online').length}</div>
                                    <div style={{
                                        padding: '8px 16px', borderRadius: '10px', background: '#fffbeb',
                                        fontSize: '13px', fontWeight: 700, color: '#d97706',
                                    }}>🟡 Warning: {gateways.filter(g => g.status === 'warning').length}</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                                {gateways.map(gw => (
                                    <div key={gw.id} style={{
                                        background: '#fff', borderRadius: '16px', border: `1px solid ${gw.status === 'warning' ? '#fde68a' : '#f1f5f9'}`,
                                        padding: '24px', transition: 'all 0.3s',
                                        gridColumn: expandedGateway === gw.id ? 'span 2' : 'span 1',
                                        cursor: 'pointer',
                                    }} onClick={() => setExpandedGateway(expandedGateway === gw.id ? null : gw.id)}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{
                                                width: '52px', height: '52px', borderRadius: '14px', flexShrink: 0,
                                                background: gw.status === 'online' ? '#ecfdf5' : '#fffbeb',
                                                color: gw.status === 'online' ? '#059669' : '#d97706',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            }}>
                                                <Radio size={24} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{gw.name}</h4>
                                                    <span style={{
                                                        fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                                                        background: gw.status === 'online' ? '#dcfce7' : '#fef3c7',
                                                        color: gw.status === 'online' ? '#15803d' : '#b45309',
                                                        textTransform: 'uppercase',
                                                    }}>{gw.status}</span>
                                                </div>
                                                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{gw.location} • IP: {gw.ip} • FW: {gw.firmware}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '24px', textAlign: 'center' }}>
                                                <div>
                                                    <p style={{ fontSize: '18px', fontWeight: 800, color: gw.signal > 70 ? '#059669' : '#d97706', margin: 0 }}>{gw.signal}%</p>
                                                    <p style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', margin: '1px 0 0' }}>Signal</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb', margin: 0 }}>{gw.connectedNodes}</p>
                                                    <p style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', margin: '1px 0 0' }}>Nodes</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', margin: 0 }}>{gw.uptime}</p>
                                                    <p style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', margin: '1px 0 0' }}>Uptime</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded Controllers for Gateway */}
                                        {expandedGateway === gw.id && (
                                            <div onClick={(e) => e.stopPropagation()} style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', cursor: 'default' }}>
                                                <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '12px' }}>
                                                    โคมไฟอัจฉริยะในเครือข่ายนี้ (ดึงข้อมูลล่าสุด)
                                                </h4>
                                                <div style={{
                                                    display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                                    gap: '10px'
                                                }}>
                                                    {controllers.filter(c => gw.zoneIds.includes(c.zoneId)).map(ctrl => (
                                                        <div key={ctrl.id} style={{
                                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                            padding: '12px 14px', borderRadius: '12px',
                                                            background: ctrl.isOn ? '#f8fafc' : '#fafafa',
                                                            border: ctrl.status === 'fault' ? '1px solid #fecaca' : '1px solid #f1f5f9',
                                                        }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                                <div style={{
                                                                    width: '8px', height: '8px', borderRadius: '50%',
                                                                    background: ctrl.status === 'fault' ? '#ef4444' : ctrl.isOn ? '#22c55e' : '#cbd5e1',
                                                                }} />
                                                                <div>
                                                                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#334155', margin: 0 }}>{ctrl.id}</p>
                                                                    <p style={{ fontSize: '10px', color: '#94a3b8', margin: '1px 0 0' }}>
                                                                        {ctrl.zone} • {ctrl.voltage}V • {ctrl.power}kW
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <label style={{ position: 'relative', cursor: ctrl.status === 'fault' ? 'not-allowed' : 'pointer' }}>
                                                                <input type="checkbox" checked={ctrl.isOn}
                                                                    onChange={(e) => { e.stopPropagation(); toggleController(ctrl.id); }}
                                                                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                                                                />
                                                                <div style={{
                                                                    width: '36px', height: '20px', borderRadius: '10px',
                                                                    background: ctrl.isOn ? '#2563eb' : '#e2e8f0',
                                                                    transition: 'background 0.25s', position: 'relative',
                                                                }}>
                                                                    <div style={{
                                                                        width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                                                                        position: 'absolute', top: '2px', left: ctrl.isOn ? '18px' : '2px',
                                                                        transition: 'left 0.25s', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                                                    }} />
                                                                </div>
                                                            </label>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Notifications Tab */}
                    {activeTab === 'notifications' && (
                        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', padding: '28px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }}>ตั้งค่าการแจ้งเตือน</h3>
                            <p style={{ fontSize: '13px', color: '#94a3b8', margin: '0 0 24px' }}>เลือกประเภทการแจ้งเตือนที่ต้องการรับ</p>
                            {[
                                { label: 'แจ้งเตือนเมื่อเสาไฟดับ', desc: 'ส่ง Notification เมื่อ Node ขาดการเชื่อมต่อ', default: true },
                                { label: 'แจ้งเตือนแรงดันผิดปกติ', desc: 'ส่งเมื่อแรงดันเกินเกณฑ์ที่ตั้งไว้', default: true },
                                { label: 'แจ้งเตือนอุณหภูมิสูง', desc: 'ส่งเมื่ออุณหภูมิบอร์ดเกินเกณฑ์', default: true },
                                { label: 'แจ้งเตือน Gateway Offline', desc: 'ส่งเมื่อ LoRa Gateway หยุดทำงาน', default: true },
                                { label: 'สรุปรายวัน', desc: 'ส่งอีเมลสรุปสถานะระบบทุกวัน 08:00', default: false },
                                { label: 'สรุปรายสัปดาห์', desc: 'ส่งรายงานพลังงานทุกวันจันทร์', default: true },
                                { label: 'แจ้งเตือนการบำรุงรักษา', desc: 'ส่งล่วงหน้าก่อนถึงกำหนดตรวจสอบ 7 วัน', default: false },
                            ].map((item, i) => (
                                <div key={i} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '16px 0', borderTop: i > 0 ? '1px solid #f8fafc' : 'none',
                                }}>
                                    <div>
                                        <p style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b', margin: 0 }}>{item.label}</p>
                                        <p style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', margin: '2px 0 0' }}>{item.desc}</p>
                                    </div>
                                    <ToggleSwitch defaultOn={item.default} />
                                </div>
                            ))}
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                                <button onClick={handleSave} style={{
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                    padding: '10px 20px', borderRadius: '12px', border: 'none',
                                    background: saved ? '#059669' : '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 600,
                                    cursor: 'pointer', fontFamily: 'inherit', transition: 'background 0.3s',
                                }}>
                                    {saved ? <><CheckCircle2 size={16} /> บันทึกแล้ว!</> : <><Save size={16} /> บันทึก</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}

function ToggleSwitch({ defaultOn }: { defaultOn: boolean }) {
    const [on, setOn] = React.useState(defaultOn);
    return (
        <label style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', cursor: 'pointer' }}>
            <input type="checkbox" checked={on} onChange={() => setOn(!on)} style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }} />
            <div style={{
                width: '44px', height: '24px', borderRadius: '12px',
                background: on ? '#2563eb' : '#e2e8f0', transition: 'background 0.3s', position: 'relative',
            }}>
                <div style={{
                    width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                    position: 'absolute', top: '2px', left: on ? '22px' : '2px',
                    transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                }} />
            </div>
        </label>
    );
}
