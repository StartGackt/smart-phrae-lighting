"use client";

import React from 'react';
import type { SmartController } from '@/contexts/DeviceContext';
import {
    X, MapPin, Lightbulb, ChevronRight, Zap, Activity,
    BarChart3, Settings2
} from 'lucide-react';

interface Zone {
    id: number;
    name: string;
    poles: number;
    lat: number;
    lng: number;
}

interface ZoneDetailPanelProps {
    zone: Zone;
    controllers: SmartController[];
    onClose: () => void;
    onViewDevice: (id: string) => void;
}

export default function ZoneDetailPanel({ zone, controllers, onClose, onViewDevice }: ZoneDetailPanelProps) {
    const zoneControllers = controllers.filter(c => c.zoneId === zone.id);
    const onCount = zoneControllers.filter(c => c.isOn).length;
    const faultCount = zoneControllers.filter(c => c.status === 'fault').length;
    const totalPower = zoneControllers.filter(c => c.isOn).reduce((s, c) => s + parseFloat(c.power), 0).toFixed(1);

    // Mock device types distribution
    const led80w = Math.ceil(zone.poles * 0.65);
    const led160w = zone.poles - led80w;

    return (
        <div style={{
            position: 'absolute', top: '16px', right: '16px', bottom: '16px',
            width: '340px', zIndex: 1001,
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

            {/* Hero Image */}
            <div style={{ position: 'relative', height: '160px', flexShrink: 0, overflow: 'hidden' }}>
                <img
                    src="/images/zone-hero.jpg"
                    alt={zone.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(37,99,235,0.8))',
                }} />
                {/* Close button */}
                <button onClick={onClose} style={{
                    position: 'absolute', top: '12px', right: '12px',
                    width: '32px', height: '32px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                    border: 'none', cursor: 'pointer', color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}><X size={16} /></button>
                {/* Zone badge */}
                <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span style={{
                        padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700,
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                        color: '#fff',
                    }}>โซนที่ {zone.id}</span>
                </div>
                {/* Zone name */}
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>{zone.name}</h3>
                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={12} /> อ.เมืองแพร่, จ.แพร่
                    </p>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    <div style={{
                        background: '#f8fafc', borderRadius: '14px', padding: '14px', textAlign: 'center',
                    }}>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                            เสาไฟทั้งหมด
                        </p>
                        <p style={{ fontSize: '24px', fontWeight: 800, color: '#2563eb', margin: 0 }}>{zone.poles} <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>ดวง</span></p>
                    </div>
                    <div style={{
                        background: '#f8fafc', borderRadius: '14px', padding: '14px', textAlign: 'center',
                    }}>
                        <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 4px' }}>
                            สถานะเปิดใช้
                        </p>
                        <p style={{ fontSize: '24px', fontWeight: 800, color: '#059669', margin: 0 }}>{onCount} <span style={{ fontSize: '12px', fontWeight: 600, color: '#94a3b8' }}>ดวง</span></p>
                    </div>
                </div>

                {/* Power & Fault */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                    <div style={{
                        background: '#eff6ff', borderRadius: '12px', padding: '12px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                        <Zap size={16} style={{ color: '#2563eb' }} />
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{totalPower} kW</p>
                            <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>กำลังไฟรวม</p>
                        </div>
                    </div>
                    <div style={{
                        background: faultCount > 0 ? '#fef2f2' : '#ecfdf5', borderRadius: '12px', padding: '12px',
                        display: 'flex', alignItems: 'center', gap: '10px',
                    }}>
                        <Activity size={16} style={{ color: faultCount > 0 ? '#dc2626' : '#059669' }} />
                        <div>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{faultCount}</p>
                            <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>ขัดข้อง</p>
                        </div>
                    </div>
                </div>

                {/* Device Types */}
                <div style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Settings2 size={13} /> รายละเอียดโคมไฟในโซน
                    </p>
                    {[
                        { type: 'Smart LED 80W', desc: 'สำหรับถนนสายรอง', count: led80w, icon: '💡' },
                        { type: 'Smart LED 160W', desc: 'สำหรับถนนสายหลัก', count: led160w, icon: '🔦' },
                    ].map(d => (
                        <div key={d.type} style={{
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            padding: '12px 14px', borderRadius: '12px', background: '#f8fafc',
                            marginBottom: '8px',
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <span style={{ fontSize: '24px' }}>{d.icon}</span>
                                <div>
                                    <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{d.type}</p>
                                    <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{d.desc}</p>
                                </div>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <span style={{ fontSize: '18px', fontWeight: 800, color: '#2563eb' }}>{d.count}</span>
                                <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}> ดวง</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controller list preview */}
                <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Lightbulb size={13} /> เสาไฟในโซน ({zoneControllers.length})
                    </p>
                    {zoneControllers.slice(0, 5).map(c => (
                        <div
                            key={c.id}
                            onClick={() => onViewDevice(c.id)}
                            style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
                                marginBottom: '4px', transition: 'all 0.15s',
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{
                                    width: '8px', height: '8px', borderRadius: '50%',
                                    background: c.status === 'fault' ? '#ef4444' : c.isOn ? '#22c55e' : '#cbd5e1',
                                }} />
                                <div>
                                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#334155', margin: 0 }}>{c.id}</p>
                                    <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>{c.loraMode} • {c.voltage}V</p>
                                </div>
                            </div>
                            <ChevronRight size={14} style={{ color: '#cbd5e1' }} />
                        </div>
                    ))}
                    {zoneControllers.length > 5 && (
                        <p style={{ textAlign: 'center', fontSize: '11px', color: '#94a3b8', margin: '8px 0 0' }}>
                            +{zoneControllers.length - 5} รายการเพิ่มเติม
                        </p>
                    )}
                </div>
            </div>

            {/* Bottom Button */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
                <button style={{
                    width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontFamily: 'inherit',
                }}>
                    <BarChart3 size={16} /> เข้าสู่มุมมองเสาไฟรายตัว
                </button>
            </div>
        </div>
    );
}
