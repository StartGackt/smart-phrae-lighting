"use client";

import React from 'react';
import type { SmartController } from '@/contexts/DeviceContext';
import {
    X, ChevronLeft, MapPin, Zap, Thermometer, Search,
    Power, PowerOff, Filter, Cpu, Activity, Sun, ChevronRight
} from 'lucide-react';

interface Zone {
    id: number;
    name: string;
    poles: number;
    lat: number;
    lng: number;
}

interface ZoneDevicesPanelProps {
    zone: Zone;
    controllers: SmartController[];
    onClose: () => void;
    onBack: () => void;
    onToggle: (id: string) => void;
    onIntensityChange: (id: string, val: number) => void;
    onViewDevice: (id: string) => void;
    onToggleAll: (zoneId: number, on: boolean) => void;
}

export default function ZoneDevicesPanel({
    zone, controllers, onClose, onBack, onToggle, onIntensityChange, onViewDevice, onToggleAll,
}: ZoneDevicesPanelProps) {
    const zoneControllers = controllers.filter(c => c.zoneId === zone.id);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [filterStatus, setFilterStatus] = React.useState<'all' | 'on' | 'off' | 'fault'>('all');

    const filtered = zoneControllers.filter(c => {
        if (searchQuery && !c.id.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        if (filterStatus === 'on' && !c.isOn) return false;
        if (filterStatus === 'off' && (c.isOn || c.status === 'fault')) return false;
        if (filterStatus === 'fault' && c.status !== 'fault') return false;
        return true;
    });

    const onCount = zoneControllers.filter(c => c.isOn).length;
    const faultCount = zoneControllers.filter(c => c.status === 'fault').length;
    const allOn = zoneControllers.filter(c => c.status !== 'fault').every(c => c.isOn);

    return (
        <div style={{
            position: 'absolute', top: '16px', right: '16px', bottom: '16px',
            width: '380px', zIndex: 1001,
            background: '#fff', borderRadius: '20px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            animation: 'slideInRight 0.3s ease-out',
        }}>
            <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>

            {/* Header */}
            <div style={{
                padding: '20px', borderBottom: '1px solid #f1f5f9', flexShrink: 0,
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <button onClick={onBack} style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                        border: 'none', borderRadius: '10px', padding: '6px 12px',
                        color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    }}><ChevronLeft size={14} /> กลับ</button>
                    <button onClick={onClose} style={{
                        width: '32px', height: '32px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)',
                        border: 'none', cursor: 'pointer', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><X size={16} /></button>
                </div>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>
                    {zone.name}
                </h3>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={11} /> โซนที่ {zone.id} • {zone.poles} เสาไฟ
                </p>

                {/* Zone Stats */}
                <div style={{ display: 'flex', gap: '8px' }}>
                    {[
                        { label: 'เปิด', value: onCount, bg: 'rgba(34,197,94,0.2)', fg: '#86efac' },
                        { label: 'ปิด', value: zoneControllers.length - onCount - faultCount, bg: 'rgba(148,163,184,0.2)', fg: '#cbd5e1' },
                        { label: 'ขัดข้อง', value: faultCount, bg: 'rgba(239,68,68,0.2)', fg: '#fca5a5' },
                    ].map(s => (
                        <div key={s.label} style={{
                            flex: 1, textAlign: 'center', padding: '8px', borderRadius: '10px', background: s.bg,
                        }}>
                            <p style={{ fontSize: '18px', fontWeight: 800, color: s.fg, margin: 0 }}>{s.value}</p>
                            <p style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', margin: 0, textTransform: 'uppercase' }}>{s.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Controls Bar */}
            <div style={{
                padding: '12px 20px', borderBottom: '1px solid #f1f5f9', flexShrink: 0,
                display: 'flex', flexDirection: 'column', gap: '10px',
            }}>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input type="text" placeholder="ค้นหา ID เสาไฟ..."
                        value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%', padding: '8px 12px 8px 32px', borderRadius: '10px',
                            border: '1px solid #f1f5f9', background: '#f8fafc', fontSize: '12px',
                            fontWeight: 500, color: '#334155', outline: 'none', fontFamily: 'inherit',
                        }}
                    />
                </div>
                {/* Filters + All On/Off */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '4px' }}>
                        {[
                            { key: 'all' as const, label: 'ทั้งหมด' },
                            { key: 'on' as const, label: 'เปิด' },
                            { key: 'off' as const, label: 'ปิด' },
                            { key: 'fault' as const, label: 'ขัดข้อง' },
                        ].map(f => (
                            <button key={f.key} onClick={() => setFilterStatus(f.key)} style={{
                                padding: '4px 10px', borderRadius: '8px', border: 'none',
                                background: filterStatus === f.key ? '#2563eb' : '#f1f5f9',
                                color: filterStatus === f.key ? '#fff' : '#64748b',
                                fontSize: '10px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                            }}>{f.label}</button>
                        ))}
                    </div>
                    <button
                        onClick={() => onToggleAll(zone.id, !allOn)}
                        style={{
                            padding: '4px 10px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                            background: allOn ? '#fef2f2' : '#ecfdf5',
                            color: allOn ? '#dc2626' : '#059669',
                            fontSize: '10px', fontWeight: 700, fontFamily: 'inherit',
                            display: 'flex', alignItems: 'center', gap: '4px',
                        }}
                    >
                        {allOn ? <><PowerOff size={10} /> ปิดทั้งหมด</> : <><Power size={10} /> เปิดทั้งหมด</>}
                    </button>
                </div>
            </div>

            {/* Device List */}
            <div style={{ flex: 1, overflow: 'auto', padding: '8px 12px' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', margin: '8px 8px 10px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    แสดง {filtered.length} จาก {zoneControllers.length} รายการ
                </p>

                {filtered.map(c => (
                    <div key={c.id} style={{
                        background: '#f8fafc', borderRadius: '14px', padding: '14px',
                        marginBottom: '8px',
                        border: c.status === 'fault' ? '1px solid #fecaca' : '1px solid #f1f5f9',
                        opacity: c.isOn ? 1 : 0.7, transition: 'all 0.2s',
                    }}>
                        {/* Row 1: ID + Status + Toggle */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <div
                                onClick={() => onViewDevice(c.id)}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
                            >
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '8px',
                                    background: c.status === 'fault' ? '#fef2f2' : c.isOn ? '#eff6ff' : '#f1f5f9',
                                    color: c.status === 'fault' ? '#ef4444' : c.isOn ? '#2563eb' : '#94a3b8',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    transition: 'all 0.2s',
                                }}><Cpu size={14} /></div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{c.id}</p>
                                        <span style={{
                                            fontSize: '8px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px',
                                            textTransform: 'uppercase',
                                            background: c.status === 'fault' ? '#fef2f2' : c.isOn ? '#dcfce7' : '#f1f5f9',
                                            color: c.status === 'fault' ? '#dc2626' : c.isOn ? '#15803d' : '#94a3b8',
                                        }}>
                                            {c.status === 'fault' ? 'FAULT' : c.isOn ? 'ON' : 'OFF'}
                                        </span>
                                        <span style={{
                                            fontSize: '8px', fontWeight: 700, padding: '1px 6px', borderRadius: '4px',
                                            background: '#f5f3ff', color: '#7c3aed',
                                        }}>{c.loraMode}</span>
                                    </div>
                                    <p style={{ fontSize: '10px', color: '#94a3b8', margin: '1px 0 0' }}>
                                        {c.voltage}V • {c.temperature}°C • {c.power}kW
                                    </p>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <label style={{ cursor: c.status === 'fault' ? 'not-allowed' : 'pointer' }}>
                                    <input type="checkbox" checked={c.isOn} onChange={() => onToggle(c.id)}
                                        disabled={c.status === 'fault'}
                                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                                    />
                                    <div style={{
                                        width: '36px', height: '20px', borderRadius: '10px',
                                        background: c.isOn ? '#2563eb' : '#e2e8f0',
                                        transition: 'background 0.25s', position: 'relative',
                                    }}>
                                        <div style={{
                                            width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                                            position: 'absolute', top: '2px', left: c.isOn ? '18px' : '2px',
                                            transition: 'left 0.25s', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                        }} />
                                    </div>
                                </label>
                                <button
                                    onClick={() => onViewDevice(c.id)}
                                    style={{
                                        background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '2px',
                                    }}
                                ><ChevronRight size={14} /></button>
                            </div>
                        </div>

                        {/* Row 2: Dimming Slider (only if ON and not fault) */}
                        {c.isOn && c.status !== 'fault' && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '8px 10px', background: '#fff', borderRadius: '10px',
                            }}>
                                <Sun size={12} style={{ color: '#94a3b8', flexShrink: 0 }} />
                                <input
                                    type="range" min="0" max="100" value={c.intensity}
                                    onChange={(e) => onIntensityChange(c.id, parseInt(e.target.value))}
                                    style={{
                                        flex: 1, height: '4px', borderRadius: '2px',
                                        appearance: 'none', WebkitAppearance: 'none',
                                        background: `linear-gradient(to right, #2563eb ${c.intensity}%, #e2e8f0 ${c.intensity}%)`,
                                        cursor: 'pointer', outline: 'none',
                                    }}
                                />
                                <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', minWidth: '30px', textAlign: 'right' }}>
                                    {c.intensity}%
                                </span>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
