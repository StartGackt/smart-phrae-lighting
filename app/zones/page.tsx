"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
    MapPin, Layers, Search, X, Zap, Thermometer, Gauge,
    Activity, Clock, ChevronRight, Eye, EyeOff, Radio, Navigation
} from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamically import the map component (Leaflet requires window)
const MapComponent = dynamic(() => import('@/components/zones/ZoneMap'), { ssr: false });

// 34 zones data — real GPS coordinates in Phrae city
const zones = [
    { id: 1, name: 'ถ.ยันตรกิจโกศล (เหนือ)', poles: 42, lat: 18.1520, lng: 100.1390, color: '#2563eb' },
    { id: 2, name: 'ถ.ยันตรกิจโกศล (ใต้)', poles: 38, lat: 18.1440, lng: 100.1410, color: '#2563eb' },
    { id: 3, name: 'ถ.เจริญเมือง (เหนือ)', poles: 28, lat: 18.1535, lng: 100.1420, color: '#3b82f6' },
    { id: 4, name: 'ถ.เจริญเมือง (กลาง)', poles: 30, lat: 18.1480, lng: 100.1430, color: '#3b82f6' },
    { id: 5, name: 'ถ.เจริญเมือง (ใต้)', poles: 27, lat: 18.1425, lng: 100.1440, color: '#3b82f6' },
    { id: 6, name: 'ถ.พระร่วง', poles: 22, lat: 18.1510, lng: 100.1460, color: '#60a5fa' },
    { id: 7, name: 'ถ.ชุมพล', poles: 32, lat: 18.1460, lng: 100.1475, color: '#60a5fa' },
    { id: 8, name: 'ถ.ราษฎรบำรุง', poles: 35, lat: 18.1400, lng: 100.1350, color: '#93c5fd' },
    { id: 9, name: 'ถ.คำลือ', poles: 25, lat: 18.1405, lng: 100.1400, color: '#93c5fd' },
    { id: 10, name: 'ถ.ไชยบูรณ์', poles: 20, lat: 18.1390, lng: 100.1450, color: '#dbeafe' },
    { id: 11, name: 'ถ.น้ำคือ', poles: 28, lat: 18.1385, lng: 100.1490, color: '#10b981' },
    { id: 12, name: 'ถ.ศรีบุตร', poles: 18, lat: 18.1370, lng: 100.1320, color: '#10b981' },
    { id: 13, name: 'ถ.เมืองหิต', poles: 22, lat: 18.1365, lng: 100.1370, color: '#059669' },
    { id: 14, name: 'ถ.แพร่-สูงเม่น', poles: 45, lat: 18.1350, lng: 100.1430, color: '#059669' },
    { id: 15, name: 'ตลาดรองเกสรี', poles: 12, lat: 18.1475, lng: 100.1445, color: '#f59e0b' },
    { id: 16, name: 'ซ.บ้านทุ่ง 1', poles: 15, lat: 18.1530, lng: 100.1510, color: '#818cf8' },
    { id: 17, name: 'ซ.บ้านทุ่ง 2', poles: 14, lat: 18.1505, lng: 100.1520, color: '#818cf8' },
    { id: 18, name: 'ซ.ป่าแดง', poles: 18, lat: 18.1490, lng: 100.1540, color: '#a78bfa' },
    { id: 19, name: 'ถ.วังหงษ์', poles: 20, lat: 18.1440, lng: 100.1550, color: '#c4b5fd' },
    { id: 20, name: 'ถ.มหาไชย', poles: 16, lat: 18.1340, lng: 100.1310, color: '#f97316' },
    { id: 21, name: 'ซ.วัดศรีชุม', poles: 14, lat: 18.1335, lng: 100.1360, color: '#f97316' },
    { id: 22, name: 'ถ.รอบเวียง (เหนือ)', poles: 30, lat: 18.1470, lng: 100.1420, color: '#14b8a6' },
    { id: 23, name: 'ถ.รอบเวียง (ใต้)', poles: 28, lat: 18.1445, lng: 100.1425, color: '#14b8a6' },
    { id: 24, name: 'ซ.ร่องฟอง', poles: 20, lat: 18.1320, lng: 100.1470, color: '#06b6d4' },
    { id: 25, name: 'ถ.เหมืองหิต-ดอนมูล', poles: 32, lat: 18.1310, lng: 100.1510, color: '#0891b2' },
    { id: 26, name: 'สวนสุขภาพ', poles: 10, lat: 18.1325, lng: 100.1330, color: '#84cc16' },
    { id: 27, name: 'วัดจอมสวรรค์', poles: 8, lat: 18.1460, lng: 100.1395, color: '#84cc16' },
    { id: 28, name: 'ถ.ช่อแฮ', poles: 35, lat: 18.1290, lng: 100.1340, color: '#eab308' },
    { id: 29, name: 'ถ.บ้านกวาว', poles: 22, lat: 18.1285, lng: 100.1390, color: '#eab308' },
    { id: 30, name: 'ถ.พญาพล', poles: 18, lat: 18.1280, lng: 100.1440, color: '#e11d48' },
    { id: 31, name: 'ซ.ทุ่งกวาว-หนองม่วง', poles: 25, lat: 18.1270, lng: 100.1500, color: '#e11d48' },
    { id: 32, name: 'ถ.แม่จั๊ว', poles: 20, lat: 18.1260, lng: 100.1540, color: '#f43f5e' },
    { id: 33, name: 'บ้านน้ำชำ', poles: 16, lat: 18.1240, lng: 100.1530, color: '#a855f7' },
    { id: 34, name: 'บ้านทุ่งโฮ้ง', poles: 24, lat: 18.1250, lng: 100.1460, color: '#a855f7' },
];

// Generate mock poles around each zone center
function generatePoles(zone: typeof zones[0]) {
    const poles = [];
    const count = Math.min(zone.poles, 6);
    for (let i = 0; i < count; i++) {
        const seed = zone.id * 7 + i;
        const latOffset = ((seed * 13 % 100) - 50) * 0.0002;
        const lngOffset = ((seed * 17 % 100) - 50) * 0.0002;
        const statuses = ['online', 'online', 'online', 'online', 'online', 'warning', 'fault'] as const;
        poles.push({
            id: `P${zone.id}-${i + 1}`,
            zone: zone.name,
            lat: zone.lat + latOffset,
            lng: zone.lng + lngOffset,
            status: statuses[seed % statuses.length],
            voltage: (220 + (seed % 10) - 5).toFixed(1),
            temperature: (35 + (seed % 15)).toFixed(1),
            power: (0.05 + (seed % 20) * 0.01).toFixed(2),
            lastSeen: `${10 + (i % 12)}:${String((15 + i * 7) % 60).padStart(2, '0')}`,
            uptime: `${90 + (seed % 10)}%`,
        });
    }
    return poles;
}

const allPoles = zones.flatMap(z => generatePoles(z));

const gateways = [
    { id: 'GW-01', name: 'Gateway ศาลากลาง', lat: 18.1480, lng: 100.1400, status: 'online' as const },
    { id: 'GW-02', name: 'Gateway ตลาดรองเกสรี', lat: 18.1470, lng: 100.1450, status: 'online' as const },
    { id: 'GW-03', name: 'Gateway บ้านทุ่ง', lat: 18.1525, lng: 100.1500, status: 'online' as const },
    { id: 'GW-04', name: 'Gateway ช่อแฮ', lat: 18.1300, lng: 100.1340, status: 'warning' as const },
];

export type Pole = typeof allPoles[0];
export type Zone = typeof zones[0];
export type Gateway = typeof gateways[0];

export default function ZonesPage() {
    const [selectedZone, setSelectedZone] = React.useState<number | null>(null);
    const [selectedPole, setSelectedPole] = React.useState<Pole | null>(null);
    const [showGateways, setShowGateways] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredZones = searchQuery
        ? zones.filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : zones;

    const stats = {
        totalPoles: zones.reduce((s, z) => s + z.poles, 0),
        onlinePoles: allPoles.filter(p => p.status === 'online').length,
        warningPoles: allPoles.filter(p => p.status === 'warning').length,
        faultPoles: allPoles.filter(p => p.status === 'fault').length,
    };

    const visiblePoles = selectedZone
        ? allPoles.filter(p => p.zone === zones.find(z => z.id === selectedZone)?.name)
        : allPoles;

    return (
        <MainLayout title="Zone Management — GIS Map">
            <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 148px)' }}>
                {/* Left Panel */}
                <div style={{
                    width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px',
                }}>
                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            type="text" placeholder="ค้นหาโซน / ถนน..."
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%', padding: '12px 14px 12px 40px', borderRadius: '14px',
                                border: '1px solid #f1f5f9', background: '#fff', fontSize: '13px',
                                fontWeight: 500, color: '#334155', outline: 'none', fontFamily: 'inherit',
                            }}
                        />
                    </div>

                    {/* Stats */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {[
                            { label: 'Total', val: stats.totalPoles, color: '#2563eb', bg: '#eff6ff' },
                            { label: 'Online', val: stats.onlinePoles, color: '#059669', bg: '#ecfdf5' },
                            { label: 'Warning', val: stats.warningPoles, color: '#d97706', bg: '#fffbeb' },
                            { label: 'Fault', val: stats.faultPoles, color: '#dc2626', bg: '#fef2f2' },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9',
                                padding: '14px', textAlign: 'center',
                            }}>
                                <p style={{ fontSize: '22px', fontWeight: 800, color: s.color, margin: 0 }}>{s.val}</p>
                                <p style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '2px 0 0' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Layer Toggles */}
                    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '16px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 12px' }}>
                            <Layers size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Map Layers
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0' }}>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>LoRa Gateways</span>
                            <button onClick={() => setShowGateways(!showGateways)} style={{
                                background: 'none', border: 'none', cursor: 'pointer', color: showGateways ? '#2563eb' : '#cbd5e1',
                            }}>
                                {showGateways ? <Eye size={18} /> : <EyeOff size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Zone List */}
                    <div style={{
                        flex: 1, background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9',
                        overflow: 'auto', padding: '4px',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 12px 8px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                                34 Zones ({filteredZones.length} shown)
                            </p>
                            {selectedZone && (
                                <button onClick={() => setSelectedZone(null)} style={{
                                    fontSize: '11px', fontWeight: 600, color: '#2563eb', background: '#eff6ff',
                                    border: 'none', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer',
                                }}>
                                    Reset
                                </button>
                            )}
                        </div>
                        {filteredZones.map(z => (
                            <button
                                key={z.id}
                                onClick={() => setSelectedZone(selectedZone === z.id ? null : z.id)}
                                style={{
                                    width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px 12px', borderRadius: '10px', border: 'none', cursor: 'pointer',
                                    background: selectedZone === z.id ? '#eff6ff' : 'transparent',
                                    transition: 'background 0.15s', fontFamily: 'inherit', textAlign: 'left',
                                }}
                                onMouseEnter={(e) => { if (selectedZone !== z.id) e.currentTarget.style.background = '#f8fafc'; }}
                                onMouseLeave={(e) => { if (selectedZone !== z.id) e.currentTarget.style.background = 'transparent'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <div style={{ width: '8px', height: '8px', borderRadius: '3px', background: z.color, flexShrink: 0 }} />
                                    <div>
                                        <p style={{ fontSize: '13px', fontWeight: 600, color: selectedZone === z.id ? '#2563eb' : '#334155', margin: 0 }}>{z.name}</p>
                                        <p style={{ fontSize: '11px', color: '#94a3b8', margin: '1px 0 0' }}>{z.poles} เสาไฟ</p>
                                    </div>
                                </div>
                                <ChevronRight size={14} style={{ color: '#cbd5e1' }} />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Map Area */}
                <div style={{
                    flex: 1, background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <MapComponent
                        zones={zones}
                        poles={visiblePoles}
                        gateways={showGateways ? gateways : []}
                        selectedZone={selectedZone}
                        onSelectZone={(id) => setSelectedZone(id)}
                        onSelectPole={(pole) => setSelectedPole(pole)}
                    />

                    {/* Pole Detail Popup */}
                    {selectedPole && (
                        <div style={{
                            position: 'absolute', bottom: '20px', left: '20px', right: '20px',
                            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)',
                            borderRadius: '16px', padding: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                            zIndex: 1000, display: 'flex', gap: '24px', alignItems: 'center',
                        }}>
                            <button onClick={() => setSelectedPole(null)} style={{
                                position: 'absolute', top: '12px', right: '12px', background: '#f8fafc',
                                border: 'none', borderRadius: '8px', width: '28px', height: '28px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8',
                            }}><X size={14} /></button>

                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0,
                                background: selectedPole.status === 'online' ? '#ecfdf5' : selectedPole.status === 'warning' ? '#fffbeb' : '#fef2f2',
                                color: selectedPole.status === 'online' ? '#059669' : selectedPole.status === 'warning' ? '#d97706' : '#dc2626',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}><MapPin size={24} /></div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{selectedPole.id}</h4>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase',
                                        background: selectedPole.status === 'online' ? '#dcfce7' : selectedPole.status === 'warning' ? '#fef3c7' : '#fee2e2',
                                        color: selectedPole.status === 'online' ? '#15803d' : selectedPole.status === 'warning' ? '#b45309' : '#b91c1c',
                                    }}>{selectedPole.status}</span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>{selectedPole.zone}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '20px' }}>
                                {[
                                    { icon: Gauge, label: 'แรงดัน', value: `${selectedPole.voltage} V`, color: '#2563eb' },
                                    { icon: Thermometer, label: 'อุณหภูมิ', value: `${selectedPole.temperature}°C`, color: '#f59e0b' },
                                    { icon: Zap, label: 'กำลังไฟ', value: `${selectedPole.power} kW`, color: '#059669' },
                                    { icon: Activity, label: 'Uptime', value: selectedPole.uptime, color: '#8b5cf6' },
                                    { icon: Clock, label: 'อัปเดต', value: selectedPole.lastSeen, color: '#64748b' },
                                ].map(d => (
                                    <div key={d.label} style={{ textAlign: 'center' }}>
                                        <d.icon size={16} style={{ color: d.color, marginBottom: '4px' }} />
                                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{d.value}</p>
                                        <p style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', margin: '1px 0 0' }}>{d.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Legend */}
                    <div style={{
                        position: 'absolute', bottom: selectedPole ? '110px' : '16px', right: '16px', zIndex: 999,
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
                        borderRadius: '10px', padding: '10px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        transition: 'bottom 0.3s',
                    }}>
                        <div style={{ display: 'flex', gap: '14px', fontSize: '10px', fontWeight: 600, color: '#64748b' }}>
                            {[
                                { color: '#22c55e', label: 'Online' },
                                { color: '#f59e0b', label: 'Warning' },
                                { color: '#ef4444', label: 'Fault' },
                                { color: '#2563eb', label: 'Gateway' },
                            ].map(l => (
                                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: l.color }} />
                                    {l.label}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
