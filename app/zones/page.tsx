"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useDevices } from '@/contexts/DeviceContext';
import {
    MapPin, Layers, Search, X, Zap, Thermometer, Gauge,
    Activity, Clock, ChevronRight, Eye, EyeOff, Radio, Cpu, Power, PowerOff
} from 'lucide-react';
import dynamic from 'next/dynamic';

const MapComponent = dynamic(() => import('@/components/zones/ZoneMap'), { ssr: false });

export default function ZonesPage() {
    const {
        controllers, gateways, zones,
        toggleController, toggleGateway,
        toggleZoneControllers,
    } = useDevices();

    const [selectedZone, setSelectedZone] = React.useState<number | null>(null);
    const [selectedPoleId, setSelectedPoleId] = React.useState<string | null>(null);
    const [showGateways, setShowGateways] = React.useState(true);
    const [showControllers, setShowControllers] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');

    const filteredZones = searchQuery
        ? zones.filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : zones;

    const stats = {
        totalControllers: controllers.length,
        onlineControllers: controllers.filter(c => c.isOn && c.status !== 'fault').length,
        totalGateways: gateways.length,
        onlineGateways: gateways.filter(g => g.isOn).length,
    };

    const visibleControllers = selectedZone
        ? controllers.filter(c => c.zoneId === selectedZone)
        : controllers;

    const visibleGateways = showGateways ? gateways : [];

    const selectedPole = selectedPoleId ? controllers.find(c => c.id === selectedPoleId) : null;

    // Zone stats
    const zoneStats = zones.map(z => ({
        ...z,
        onCount: controllers.filter(c => c.zoneId === z.id && c.isOn).length,
        total: controllers.filter(c => c.zoneId === z.id).length,
        allOn: controllers.filter(c => c.zoneId === z.id && c.status !== 'fault').every(c => c.isOn),
    }));

    return (
        <MainLayout title="Zone Management — GIS Map">
            <div style={{ display: 'flex', gap: '24px', height: 'calc(100vh - 148px)' }}>
                {/* Left Panel */}
                <div style={{ width: '320px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Search */}
                    <div style={{ position: 'relative' }}>
                        <Search size={15} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input type="text" placeholder="ค้นหาโซน / ถนน..."
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
                        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '14px', textAlign: 'center' }}>
                            <p style={{ fontSize: '20px', fontWeight: 800, color: '#2563eb', margin: 0 }}>{stats.onlineControllers}</p>
                            <p style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '2px 0 0' }}>Controllers On</p>
                        </div>
                        <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '14px', textAlign: 'center' }}>
                            <p style={{ fontSize: '20px', fontWeight: 800, color: '#059669', margin: 0 }}>{stats.onlineGateways}</p>
                            <p style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '2px 0 0' }}>Gateways On</p>
                        </div>
                    </div>

                    {/* Layer Toggles */}
                    <div style={{ background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9', padding: '16px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                            <Layers size={12} style={{ marginRight: '6px', verticalAlign: 'middle' }} />Map Layers
                        </p>
                        {[
                            { label: 'Smart Controllers', icon: Cpu, on: showControllers, toggle: () => setShowControllers(!showControllers) },
                            { label: 'Master Gateways', icon: Radio, on: showGateways, toggle: () => setShowGateways(!showGateways) },
                        ].map(l => (
                            <div key={l.label} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 0',
                            }}>
                                <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <l.icon size={14} style={{ color: '#94a3b8' }} />{l.label}
                                </span>
                                <button onClick={l.toggle} style={{
                                    background: 'none', border: 'none', cursor: 'pointer', color: l.on ? '#2563eb' : '#cbd5e1',
                                }}>
                                    {l.on ? <Eye size={18} /> : <EyeOff size={18} />}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Zone List with controls */}
                    <div style={{
                        flex: 1, background: '#fff', borderRadius: '14px', border: '1px solid #f1f5f9',
                        overflow: 'auto', padding: '4px',
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '12px 12px 8px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                                {filteredZones.length} Zones
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
                        {(searchQuery ? filteredZones : zoneStats).map(z => {
                            const zs = zoneStats.find(zz => zz.id === z.id)!;
                            return (
                                <div
                                    key={z.id}
                                    style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '9px 12px', borderRadius: '10px', cursor: 'pointer',
                                        background: selectedZone === z.id ? '#eff6ff' : 'transparent',
                                        transition: 'background 0.15s',
                                    }}
                                    onClick={() => setSelectedZone(selectedZone === z.id ? null : z.id)}
                                    onMouseEnter={(e) => { if (selectedZone !== z.id) e.currentTarget.style.background = '#f8fafc'; }}
                                    onMouseLeave={(e) => { if (selectedZone !== z.id) e.currentTarget.style.background = selectedZone === z.id ? '#eff6ff' : 'transparent'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            width: '6px', height: '6px', borderRadius: '50%',
                                            background: zs.allOn ? '#22c55e' : zs.onCount > 0 ? '#f59e0b' : '#ef4444',
                                            flexShrink: 0,
                                        }} />
                                        <div style={{ minWidth: 0 }}>
                                            <p style={{ fontSize: '12px', fontWeight: 600, color: selectedZone === z.id ? '#2563eb' : '#334155', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {z.name}
                                            </p>
                                            <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
                                                {zs.onCount}/{zs.total} on
                                            </p>
                                        </div>
                                    </div>
                                    {/* Quick zone toggle */}
                                    <button onClick={(e) => {
                                        e.stopPropagation();
                                        toggleZoneControllers(z.id, !zs.allOn);
                                    }} style={{
                                        padding: '3px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                        background: zs.allOn ? '#dcfce7' : '#fee2e2',
                                        color: zs.allOn ? '#15803d' : '#b91c1c',
                                        fontSize: '9px', fontWeight: 700, fontFamily: 'inherit', flexShrink: 0,
                                    }}>
                                        {zs.allOn ? 'ON' : 'OFF'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Map Area */}
                <div style={{
                    flex: 1, background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <MapComponent
                        controllers={showControllers ? visibleControllers : []}
                        gateways={visibleGateways}
                        zones={zones}
                        selectedZone={selectedZone}
                        onSelectZone={(id) => setSelectedZone(id)}
                        onSelectPole={(id) => setSelectedPoleId(id)}
                        onToggleController={toggleController}
                        onToggleGateway={toggleGateway}
                    />

                    {/* Pole Detail Popup */}
                    {selectedPole && (
                        <div style={{
                            position: 'absolute', bottom: '20px', left: '20px', right: '20px',
                            background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)',
                            borderRadius: '16px', padding: '20px 24px', boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                            zIndex: 1000, display: 'flex', gap: '20px', alignItems: 'center',
                        }}>
                            <button onClick={() => setSelectedPoleId(null)} style={{
                                position: 'absolute', top: '10px', right: '10px', background: '#f8fafc',
                                border: 'none', borderRadius: '8px', width: '28px', height: '28px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#94a3b8',
                            }}><X size={14} /></button>

                            <div style={{
                                width: '50px', height: '50px', borderRadius: '14px', flexShrink: 0,
                                background: selectedPole.isOn ? '#ecfdf5' : '#f8fafc',
                                color: selectedPole.isOn ? '#059669' : '#94a3b8',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s',
                            }}><Cpu size={22} /></div>

                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                                    <h4 style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{selectedPole.id}</h4>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase',
                                        background: selectedPole.isOn ? '#dcfce7' : '#fee2e2',
                                        color: selectedPole.isOn ? '#15803d' : '#b91c1c',
                                    }}>{selectedPole.isOn ? 'ON' : 'OFF'}</span>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                                        background: '#f1f5f9', color: '#64748b',
                                    }}>{selectedPole.loraMode}</span>
                                </div>
                                <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>{selectedPole.zone}</p>
                            </div>

                            <div style={{ display: 'flex', gap: '16px' }}>
                                {[
                                    { icon: Gauge, label: 'แรงดัน', value: `${selectedPole.voltage}V`, color: '#2563eb' },
                                    { icon: Thermometer, label: 'อุณหภูมิ', value: `${selectedPole.temperature}°C`, color: '#f59e0b' },
                                    { icon: Zap, label: 'กำลังไฟ', value: `${selectedPole.power}kW`, color: '#059669' },
                                ].map(d => (
                                    <div key={d.label} style={{ textAlign: 'center' }}>
                                        <d.icon size={14} style={{ color: d.color, marginBottom: '3px' }} />
                                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{d.value}</p>
                                        <p style={{ fontSize: '9px', fontWeight: 600, color: '#94a3b8', margin: 0 }}>{d.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Toggle from map */}
                            <button
                                onClick={() => toggleController(selectedPole.id)}
                                disabled={selectedPole.status === 'fault'}
                                style={{
                                    padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: selectedPole.status === 'fault' ? 'not-allowed' : 'pointer',
                                    background: selectedPole.isOn ? '#fef2f2' : '#ecfdf5',
                                    color: selectedPole.isOn ? '#dc2626' : '#059669',
                                    fontSize: '12px', fontWeight: 700, fontFamily: 'inherit', flexShrink: 0,
                                    display: 'flex', alignItems: 'center', gap: '6px',
                                }}
                            >
                                {selectedPole.isOn ? <><PowerOff size={14} /> ปิด</> : <><Power size={14} /> เปิด</>}
                            </button>
                        </div>
                    )}

                    {/* Legend */}
                    <div style={{
                        position: 'absolute', bottom: selectedPole ? '110px' : '16px', right: '16px', zIndex: 999,
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
                        borderRadius: '10px', padding: '10px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        transition: 'bottom 0.3s',
                    }}>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '10px', fontWeight: 600, color: '#64748b' }}>
                            {[
                                { color: '#22c55e', label: 'On' },
                                { color: '#94a3b8', label: 'Off' },
                                { color: '#f59e0b', label: 'Warning' },
                                { color: '#ef4444', label: 'Fault' },
                                { color: '#2563eb', label: 'Gateway' },
                            ].map(l => (
                                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
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
