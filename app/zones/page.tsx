"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
    MapPin, Layers, Search, X, Zap, Thermometer, Gauge,
    Activity, Clock, ChevronRight, Eye, EyeOff, Radio
} from 'lucide-react';

// 34 zones data for Phrae city
const zones = [
    { id: 1, name: 'ถ.ยันตรกิจโกศล (เหนือ)', poles: 42, x: 38, y: 18, w: 12, h: 8, color: '#2563eb' },
    { id: 2, name: 'ถ.ยันตรกิจโกศล (ใต้)', poles: 38, x: 38, y: 27, w: 12, h: 8, color: '#2563eb' },
    { id: 3, name: 'ถ.เจริญเมือง (เหนือ)', poles: 28, x: 22, y: 15, w: 14, h: 7, color: '#3b82f6' },
    { id: 4, name: 'ถ.เจริญเมือง (กลาง)', poles: 30, x: 22, y: 23, w: 14, h: 7, color: '#3b82f6' },
    { id: 5, name: 'ถ.เจริญเมือง (ใต้)', poles: 27, x: 22, y: 31, w: 14, h: 7, color: '#3b82f6' },
    { id: 6, name: 'ถ.พระร่วง', poles: 22, x: 52, y: 20, w: 12, h: 8, color: '#60a5fa' },
    { id: 7, name: 'ถ.ชุมพล', poles: 32, x: 55, y: 30, w: 12, h: 8, color: '#60a5fa' },
    { id: 8, name: 'ถ.ราษฎรบำรุง', poles: 35, x: 15, y: 40, w: 14, h: 7, color: '#93c5fd' },
    { id: 9, name: 'ถ.คำลือ', poles: 25, x: 30, y: 40, w: 12, h: 7, color: '#93c5fd' },
    { id: 10, name: 'ถ.ไชยบูรณ์', poles: 20, x: 44, y: 40, w: 12, h: 7, color: '#dbeafe' },
    { id: 11, name: 'ถ.น้ำคือ', poles: 28, x: 58, y: 42, w: 12, h: 7, color: '#dbeafe' },
    { id: 12, name: 'ถ.ศรีบุตร', poles: 18, x: 10, y: 50, w: 11, h: 6, color: '#10b981' },
    { id: 13, name: 'ถ.เมืองหิต', poles: 22, x: 22, y: 50, w: 12, h: 6, color: '#10b981' },
    { id: 14, name: 'ถ.แพร่-สูงเม่น', poles: 45, x: 36, y: 50, w: 16, h: 7, color: '#059669' },
    { id: 15, name: 'ตลาดรองเกสรี', poles: 12, x: 54, y: 52, w: 10, h: 6, color: '#f59e0b' },
    { id: 16, name: 'ซ.บ้านทุ่ง 1', poles: 15, x: 66, y: 18, w: 10, h: 6, color: '#818cf8' },
    { id: 17, name: 'ซ.บ้านทุ่ง 2', poles: 14, x: 66, y: 25, w: 10, h: 6, color: '#818cf8' },
    { id: 18, name: 'ซ.ป่าแดง', poles: 18, x: 68, y: 33, w: 10, h: 6, color: '#a78bfa' },
    { id: 19, name: 'ถ.วังหงษ์', poles: 20, x: 72, y: 42, w: 10, h: 7, color: '#c4b5fd' },
    { id: 20, name: 'ถ.มหาไชย', poles: 16, x: 10, y: 58, w: 11, h: 6, color: '#f97316' },
    { id: 21, name: 'ซ.วัดศรีชุม', poles: 14, x: 22, y: 58, w: 10, h: 6, color: '#f97316' },
    { id: 22, name: 'ถ.รอบเวียง (เหนือ)', poles: 30, x: 34, y: 58, w: 14, h: 6, color: '#14b8a6' },
    { id: 23, name: 'ถ.รอบเวียง (ใต้)', poles: 28, x: 34, y: 65, w: 14, h: 6, color: '#14b8a6' },
    { id: 24, name: 'ซ.ร่องฟอง', poles: 20, x: 50, y: 60, w: 12, h: 6, color: '#06b6d4' },
    { id: 25, name: 'ถ.เหมืองหิต-ดอนมูล', poles: 32, x: 64, y: 55, w: 14, h: 7, color: '#0891b2' },
    { id: 26, name: 'สวนสุขภาพ', poles: 10, x: 10, y: 66, w: 10, h: 5, color: '#84cc16' },
    { id: 27, name: 'วัดจอมสวรรค์', poles: 8, x: 22, y: 66, w: 10, h: 5, color: '#84cc16' },
    { id: 28, name: 'ถ.ช่อแฮ', poles: 35, x: 10, y: 73, w: 14, h: 7, color: '#eab308' },
    { id: 29, name: 'ถ.บ้านกวาว', poles: 22, x: 26, y: 73, w: 12, h: 7, color: '#eab308' },
    { id: 30, name: 'ถ.พญาพล', poles: 18, x: 40, y: 72, w: 12, h: 6, color: '#e11d48' },
    { id: 31, name: 'ซ.ทุ่งกวาว-หนองม่วง', poles: 25, x: 54, y: 70, w: 14, h: 6, color: '#e11d48' },
    { id: 32, name: 'ถ.แม่จั๊ว', poles: 20, x: 70, y: 65, w: 12, h: 6, color: '#f43f5e' },
    { id: 33, name: 'บ้านน้ำชำ', poles: 16, x: 70, y: 73, w: 12, h: 6, color: '#a855f7' },
    { id: 34, name: 'บ้านทุ่งโฮ้ง', poles: 24, x: 56, y: 78, w: 14, h: 7, color: '#a855f7' },
];

// Mock lamp posts
const generatePoles = (zoneId: number, zoneName: string, zx: number, zy: number, zw: number, zh: number, count: number) => {
    const poles = [];
    const seed = zoneId * 7;
    for (let i = 0; i < Math.min(count, 8); i++) {
        const px = zx + 1 + ((seed * (i + 1) * 13) % (zw - 2));
        const py = zy + 1 + ((seed * (i + 1) * 17) % (zh - 2));
        const statuses = ['online', 'online', 'online', 'online', 'online', 'online', 'online', 'warning', 'fault'] as const;
        const status = statuses[(seed + i) % statuses.length];
        poles.push({
            id: `P${zoneId}-${i + 1}`,
            zone: zoneName,
            x: px,
            y: py,
            status,
            voltage: (220 + ((seed + i) % 10) - 5).toFixed(1),
            temperature: (35 + ((seed + i) % 15)).toFixed(1),
            power: (0.05 + ((seed + i) % 20) * 0.01).toFixed(2),
            lastSeen: `${10 + (i % 12)}:${(15 + i * 7) % 60 < 10 ? '0' : ''}${(15 + i * 7) % 60}`,
            uptime: `${90 + ((seed + i) % 10)}%`,
        });
    }
    return poles;
};

const allPoles = zones.flatMap(z => generatePoles(z.id, z.name, z.x, z.y, z.w, z.h, z.poles));

// LoRa gateways
const gateways = [
    { id: 'GW-01', name: 'Gateway ศาลากลาง', x: 35, y: 30, status: 'online' },
    { id: 'GW-02', name: 'Gateway ตลาดรองเกสรี', x: 55, y: 55, status: 'online' },
    { id: 'GW-03', name: 'Gateway บ้านทุ่ง', x: 70, y: 25, status: 'online' },
    { id: 'GW-04', name: 'Gateway ช่อแฮ', x: 18, y: 75, status: 'warning' },
];

type PoleType = (typeof allPoles)[0];

export default function ZonesPage() {
    const [selectedZone, setSelectedZone] = React.useState<number | null>(null);
    const [selectedPole, setSelectedPole] = React.useState<PoleType | null>(null);
    const [showZones, setShowZones] = React.useState(true);
    const [showGateways, setShowGateways] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [mapScale, setMapScale] = React.useState(1);
    const [hoveredZone, setHoveredZone] = React.useState<number | null>(null);

    const filteredZones = searchQuery
        ? zones.filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : zones;

    const visiblePoles = selectedZone
        ? allPoles.filter(p => p.zone === zones.find(z => z.id === selectedZone)?.name)
        : allPoles;

    const stats = {
        totalPoles: zones.reduce((s, z) => s + z.poles, 0),
        onlinePoles: allPoles.filter(p => p.status === 'online').length,
        warningPoles: allPoles.filter(p => p.status === 'warning').length,
        faultPoles: allPoles.filter(p => p.status === 'fault').length,
    };

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
                            type="text"
                            placeholder="ค้นหาโซน / ถนน..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
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
                            { label: 'Total Poles', val: stats.totalPoles, color: '#2563eb', bg: '#eff6ff' },
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
                        {[
                            { label: 'Zone Boundaries', on: showZones, toggle: () => setShowZones(!showZones) },
                            { label: 'LoRa Gateways', on: showGateways, toggle: () => setShowGateways(!showGateways) },
                        ].map(l => (
                            <div key={l.label} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '8px 0',
                            }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>{l.label}</span>
                                <button onClick={l.toggle} style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: l.on ? '#2563eb' : '#cbd5e1',
                                }}>
                                    {l.on ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Zone List */}
                    <div style={{
                        flex: 1, background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9',
                        overflow: 'auto', padding: '4px',
                    }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '12px 12px 8px' }}>
                            34 Zones ({filteredZones.length} shown)
                        </p>
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
                                onMouseEnter={(e) => { if (selectedZone !== z.id) e.currentTarget.style.background = '#f8fafc'; setHoveredZone(z.id); }}
                                onMouseLeave={(e) => { if (selectedZone !== z.id) e.currentTarget.style.background = 'transparent'; setHoveredZone(null); }}
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
                    {/* Map Controls */}
                    <div style={{
                        position: 'absolute', top: '16px', right: '16px', zIndex: 10,
                        display: 'flex', flexDirection: 'column', gap: '4px',
                    }}>
                        <button onClick={() => setMapScale(s => Math.min(s + 0.2, 2))} style={{
                            width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #f1f5f9',
                            background: 'rgba(255,255,255,0.9)', cursor: 'pointer', fontSize: '18px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569',
                            backdropFilter: 'blur(8px)',
                        }}>+</button>
                        <button onClick={() => setMapScale(s => Math.max(s - 0.2, 0.6))} style={{
                            width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #f1f5f9',
                            background: 'rgba(255,255,255,0.9)', cursor: 'pointer', fontSize: '18px', fontWeight: 700,
                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569',
                            backdropFilter: 'blur(8px)',
                        }}>−</button>
                    </div>

                    {/* Map Title Overlay */}
                    <div style={{
                        position: 'absolute', top: '16px', left: '16px', zIndex: 10,
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
                        borderRadius: '12px', padding: '12px 18px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    }}>
                        <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            🗺️ แผนผังเมืองแพร่ — เทศบาลเมืองแพร่
                        </p>
                        <p style={{ fontSize: '11px', fontWeight: 500, color: '#94a3b8', margin: '2px 0 0' }}>
                            {stats.totalPoles} เสาไฟ • 34 โซน • {gateways.length} Gateway
                        </p>
                    </div>

                    {/* SVG Map */}
                    <svg
                        viewBox="0 0 100 95"
                        style={{
                            width: '100%', height: '100%',
                            transform: `scale(${mapScale})`,
                            transition: 'transform 0.3s ease',
                            transformOrigin: 'center',
                        }}
                    >
                        {/* Background / City shape */}
                        <defs>
                            <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#f0f4ff" />
                                <stop offset="50%" stopColor="#e8f0fe" />
                                <stop offset="100%" stopColor="#f0fdf4" />
                            </linearGradient>
                            <filter id="glow">
                                <feGaussianBlur stdDeviation="0.3" result="coloredBlur" />
                                <feMerge>
                                    <feMergeNode in="coloredBlur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                        </defs>
                        <rect x="0" y="0" width="100" height="95" fill="url(#mapBg)" rx="2" />

                        {/* Grid */}
                        {Array.from({ length: 10 }).map((_, i) => (
                            <React.Fragment key={`grid-${i}`}>
                                <line x1={i * 10 + 5} y1="0" x2={i * 10 + 5} y2="95" stroke="#e2e8f0" strokeWidth="0.15" />
                                <line x1="0" y1={i * 10 + 5} x2="100" y2={i * 10 + 5} stroke="#e2e8f0" strokeWidth="0.15" />
                            </React.Fragment>
                        ))}

                        {/* Main roads */}
                        <path d="M5,30 Q30,25 50,30 Q70,35 95,30" stroke="#cbd5e1" strokeWidth="0.4" fill="none" strokeDasharray="1 0.5" />
                        <path d="M40,5 Q42,40 38,90" stroke="#cbd5e1" strokeWidth="0.4" fill="none" strokeDasharray="1 0.5" />
                        <path d="M15,10 Q50,50 85,80" stroke="#cbd5e1" strokeWidth="0.3" fill="none" strokeDasharray="0.8 0.6" />
                        <path d="M10,60 Q50,55 90,65" stroke="#cbd5e1" strokeWidth="0.3" fill="none" strokeDasharray="0.8 0.6" />

                        {/* Zone rectangles */}
                        {showZones && zones.map(z => (
                            <g key={`zone-${z.id}`}>
                                <rect
                                    x={z.x} y={z.y} width={z.w} height={z.h}
                                    fill={z.color}
                                    fillOpacity={selectedZone === z.id ? 0.25 : hoveredZone === z.id ? 0.15 : 0.08}
                                    stroke={z.color}
                                    strokeWidth={selectedZone === z.id ? 0.4 : 0.2}
                                    strokeOpacity={selectedZone === z.id ? 0.8 : 0.3}
                                    rx="0.8"
                                    style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                                    onClick={() => setSelectedZone(selectedZone === z.id ? null : z.id)}
                                    onMouseEnter={() => setHoveredZone(z.id)}
                                    onMouseLeave={() => setHoveredZone(null)}
                                />
                                {(selectedZone === z.id || hoveredZone === z.id) && (
                                    <text
                                        x={z.x + z.w / 2} y={z.y + z.h / 2 + 0.8}
                                        textAnchor="middle" fontSize="1.6" fontWeight="700"
                                        fill={z.color} fillOpacity={0.9}
                                    >
                                        {z.name.length > 14 ? z.name.slice(0, 12) + '…' : z.name}
                                    </text>
                                )}
                            </g>
                        ))}

                        {/* Lamp posts */}
                        {visiblePoles.map(p => (
                            <circle
                                key={p.id}
                                cx={p.x} cy={p.y} r={selectedPole?.id === p.id ? 0.9 : 0.55}
                                fill={p.status === 'online' ? '#22c55e' : p.status === 'warning' ? '#f59e0b' : '#ef4444'}
                                stroke="#fff" strokeWidth="0.2"
                                style={{ cursor: 'pointer', transition: 'r 0.2s' }}
                                filter={selectedPole?.id === p.id ? 'url(#glow)' : undefined}
                                onClick={(e) => { e.stopPropagation(); setSelectedPole(selectedPole?.id === p.id ? null : p); }}
                            />
                        ))}

                        {/* LoRa Gateways */}
                        {showGateways && gateways.map(g => (
                            <g key={g.id}>
                                <circle cx={g.x} cy={g.y} r="2.5" fill={g.status === 'online' ? '#2563eb' : '#f59e0b'} fillOpacity="0.08" />
                                <circle cx={g.x} cy={g.y} r="1.5" fill={g.status === 'online' ? '#2563eb' : '#f59e0b'} fillOpacity="0.12" />
                                <circle cx={g.x} cy={g.y} r="0.8" fill={g.status === 'online' ? '#2563eb' : '#f59e0b'} stroke="#fff" strokeWidth="0.2" />
                                <text x={g.x} y={g.y - 1.5} textAnchor="middle" fontSize="1.2" fontWeight="600" fill="#475569">
                                    {g.id}
                                </text>
                            </g>
                        ))}
                    </svg>

                    {/* Pole Detail Popup */}
                    {selectedPole && (
                        <div style={{
                            position: 'absolute', bottom: '20px', left: '20px', right: '20px',
                            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)',
                            borderRadius: '16px', padding: '24px', boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
                            zIndex: 20, display: 'flex', gap: '24px', alignItems: 'center',
                        }}>
                            <button
                                onClick={() => setSelectedPole(null)}
                                style={{
                                    position: 'absolute', top: '12px', right: '12px', background: '#f8fafc',
                                    border: 'none', borderRadius: '8px', width: '28px', height: '28px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8',
                                }}
                            ><X size={14} /></button>

                            {/* Status Icon */}
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0,
                                background: selectedPole.status === 'online' ? '#ecfdf5' : selectedPole.status === 'warning' ? '#fffbeb' : '#fef2f2',
                                color: selectedPole.status === 'online' ? '#059669' : selectedPole.status === 'warning' ? '#d97706' : '#dc2626',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <MapPin size={24} />
                            </div>

                            {/* Pole Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{selectedPole.id}</h4>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                                        textTransform: 'uppercase',
                                        background: selectedPole.status === 'online' ? '#dcfce7' : selectedPole.status === 'warning' ? '#fef3c7' : '#fee2e2',
                                        color: selectedPole.status === 'online' ? '#15803d' : selectedPole.status === 'warning' ? '#b45309' : '#b91c1c',
                                    }}>{selectedPole.status}</span>
                                </div>
                                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 2px' }}>{selectedPole.zone}</p>
                            </div>

                            {/* Technical Data */}
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
                        position: 'absolute', bottom: '16px', right: '16px', zIndex: 10,
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
                        borderRadius: '10px', padding: '10px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
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
