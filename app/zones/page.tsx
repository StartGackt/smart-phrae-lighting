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
const ZoneDetailPanel = dynamic(() => import('@/components/zones/ZoneDetailPanel'), { ssr: false });
const DeviceDetailPanel = dynamic(() => import('@/components/zones/DeviceDetailPanel'), { ssr: false });
const ZoneDevicesPanel = dynamic(() => import('@/components/zones/ZoneDevicesPanel'), { ssr: false });

export default function ZonesPage() {
    const {
        controllers, gateways, zones,
        toggleController, toggleGateway, setControllerIntensity,
        toggleZoneControllers,
    } = useDevices();

    const [selectedZone, setSelectedZone] = React.useState<number | null>(null);
    const [selectedDeviceId, setSelectedDeviceId] = React.useState<string | null>(null);
    const [showGateways, setShowGateways] = React.useState(true);
    const [showControllers, setShowControllers] = React.useState(true);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [panelView, setPanelView] = React.useState<'none' | 'zone' | 'zone-devices' | 'device'>('none');

    const filteredZones = searchQuery
        ? zones.filter(z => z.name.toLowerCase().includes(searchQuery.toLowerCase()))
        : zones;

    const stats = {
        onlineControllers: controllers.filter(c => c.isOn && c.status !== 'fault').length,
        onlineGateways: gateways.filter(g => g.isOn).length,
    };

    const visibleControllers = selectedZone
        ? controllers.filter(c => c.zoneId === selectedZone)
        : controllers;

    const visibleGateways = showGateways ? gateways : [];

    const selectedDevice = selectedDeviceId ? controllers.find(c => c.id === selectedDeviceId) : null;
    const selectedZoneData = selectedZone ? zones.find(z => z.id === selectedZone) : null;

    // Zone stats
    const zoneStats = zones.map(z => ({
        ...z,
        onCount: controllers.filter(c => c.zoneId === z.id && c.isOn).length,
        total: controllers.filter(c => c.zoneId === z.id).length,
        allOn: controllers.filter(c => c.zoneId === z.id && c.status !== 'fault').every(c => c.isOn),
    }));

    const handleSelectZone = (id: number | null) => {
        setSelectedZone(id);
        setSelectedDeviceId(null);
        if (id) {
            setPanelView('zone');
        } else {
            setPanelView('none');
        }
    };

    const handleSelectDevice = (id: string) => {
        setSelectedDeviceId(id);
        setPanelView('device');
    };

    const handleClosePanel = () => {
        setPanelView('none');
        setSelectedDeviceId(null);
        setSelectedZone(null);
    };

    const handleBackToZone = () => {
        setSelectedDeviceId(null);
        setPanelView('zone');
    };

    const handleViewAllDevices = () => {
        setPanelView('zone-devices');
    };

    const handleBackToZoneFromDevices = () => {
        setPanelView('zone');
    };

    const handleDeviceFromList = (id: string) => {
        setSelectedDeviceId(id);
        setPanelView('device');
    };

    const handleBackToDeviceList = () => {
        setSelectedDeviceId(null);
        setPanelView('zone-devices');
    };

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
                                <button onClick={() => handleSelectZone(null)} style={{
                                    fontSize: '11px', fontWeight: 600, color: '#2563eb', background: '#eff6ff',
                                    border: 'none', padding: '3px 10px', borderRadius: '6px', cursor: 'pointer',
                                }}>
                                    Reset
                                </button>
                            )}
                        </div>
                        {(searchQuery ? filteredZones.map(z => zoneStats.find(zz => zz.id === z.id)!) : zoneStats).map(zs => (
                            <div
                                key={zs.id}
                                style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '9px 12px', borderRadius: '10px', cursor: 'pointer',
                                    background: selectedZone === zs.id ? '#eff6ff' : 'transparent',
                                    transition: 'background 0.15s',
                                }}
                                onClick={() => handleSelectZone(selectedZone === zs.id ? null : zs.id)}
                                onMouseEnter={(e) => { if (selectedZone !== zs.id) e.currentTarget.style.background = '#f8fafc'; }}
                                onMouseLeave={(e) => { if (selectedZone !== zs.id) e.currentTarget.style.background = selectedZone === zs.id ? '#eff6ff' : 'transparent'; }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        width: '6px', height: '6px', borderRadius: '50%',
                                        background: zs.allOn ? '#22c55e' : zs.onCount > 0 ? '#f59e0b' : '#ef4444',
                                        flexShrink: 0,
                                    }} />
                                    <div style={{ minWidth: 0 }}>
                                        <p style={{ fontSize: '12px', fontWeight: 600, color: selectedZone === zs.id ? '#2563eb' : '#334155', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {zs.name}
                                        </p>
                                        <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0 }}>
                                            {zs.onCount}/{zs.total} on
                                        </p>
                                    </div>
                                </div>
                                <button onClick={(e) => {
                                    e.stopPropagation();
                                    toggleZoneControllers(zs.id, !zs.allOn);
                                }} style={{
                                    padding: '3px 8px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                                    background: zs.allOn ? '#dcfce7' : '#fee2e2',
                                    color: zs.allOn ? '#15803d' : '#b91c1c',
                                    fontSize: '9px', fontWeight: 700, fontFamily: 'inherit', flexShrink: 0,
                                }}>
                                    {zs.allOn ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        ))}
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
                        onSelectZone={handleSelectZone}
                        onSelectPole={handleSelectDevice}
                        onToggleController={toggleController}
                        onToggleGateway={toggleGateway}
                    />

                    {/* Zone Detail Panel */}
                    {panelView === 'zone' && selectedZoneData && (
                        <ZoneDetailPanel
                            zone={selectedZoneData}
                            controllers={controllers}
                            onClose={handleClosePanel}
                            onViewDevice={handleSelectDevice}
                            onViewAllDevices={handleViewAllDevices}
                        />
                    )}

                    {/* Zone Devices List Panel */}
                    {panelView === 'zone-devices' && selectedZoneData && (
                        <ZoneDevicesPanel
                            zone={selectedZoneData}
                            controllers={controllers}
                            onClose={handleClosePanel}
                            onBack={handleBackToZoneFromDevices}
                            onToggle={toggleController}
                            onIntensityChange={setControllerIntensity}
                            onViewDevice={handleDeviceFromList}
                            onToggleAll={toggleZoneControllers}
                        />
                    )}

                    {/* Device Detail Panel */}
                    {panelView === 'device' && selectedDevice && (
                        <DeviceDetailPanel
                            controller={selectedDevice}
                            onClose={handleClosePanel}
                            onToggle={() => toggleController(selectedDevice.id)}
                            onIntensityChange={(val) => setControllerIntensity(selectedDevice.id, val)}
                            onBack={selectedZone ? handleBackToDeviceList : undefined}
                        />
                    )}

                    {/* Legend */}
                    <div style={{
                        position: 'absolute', bottom: '16px', left: '16px', zIndex: 999,
                        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)',
                        borderRadius: '10px', padding: '10px 14px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
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
