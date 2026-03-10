"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useDevices } from '@/contexts/DeviceContext';
import {
    Cpu, Radio, Power, PowerOff, Wifi, WifiOff, Zap, Signal,
    ChevronRight, ChevronDown, Search, Filter, ToggleLeft, ToggleRight,
    Grid, List as ListIcon
} from 'lucide-react';

type TabId = 'controllers' | 'gateways';

export default function DevicesPage() {
    const {
        controllers, gateways, zones,
        toggleController, toggleGateway, setControllerIntensity,
        toggleAllControllers, toggleAllGateways, toggleZoneControllers,
    } = useDevices();

    const [activeTab, setActiveTab] = React.useState<TabId>('controllers');
    const [expandedZone, setExpandedZone] = React.useState<number | null>(null);
    const [searchQuery, setSearchQuery] = React.useState('');

    // Controller stats
    const onlineControllers = controllers.filter(c => c.isOn && c.status !== 'fault').length;
    const totalPower = controllers.filter(c => c.isOn).reduce((s, c) => s + parseFloat(c.power), 0).toFixed(1);
    const faultCount = controllers.filter(c => c.status === 'fault').length;

    // Gateway stats
    const onlineGateways = gateways.filter(g => g.isOn).length;
    const totalNodes = gateways.filter(g => g.isOn).reduce((s, g) => s + g.connectedNodes, 0);

    // Group controllers by zone
    const zoneGroups = zones.map(z => ({
        ...z,
        controllers: controllers.filter(c => c.zoneId === z.id),
        onCount: controllers.filter(c => c.zoneId === z.id && c.isOn).length,
        total: controllers.filter(c => c.zoneId === z.id).length,
        allOn: controllers.filter(c => c.zoneId === z.id && c.status !== 'fault').every(c => c.isOn),
    })).filter(z => {
        if (!searchQuery) return true;
        return z.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <MainLayout title="Light Control">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Tab Header */}
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <button
                        onClick={() => setActiveTab('controllers')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '14px 28px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                            background: activeTab === 'controllers'
                                ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#fff',
                            color: activeTab === 'controllers' ? '#fff' : '#64748b',
                            fontSize: '14px', fontWeight: 700, fontFamily: 'inherit',
                            boxShadow: activeTab === 'controllers'
                                ? '0 8px 24px rgba(37,99,235,0.25)' : '0 1px 3px rgba(0,0,0,0.04)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Cpu size={18} />
                        Smart Controller Unit
                        <span style={{
                            padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800,
                            background: activeTab === 'controllers' ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                            color: activeTab === 'controllers' ? '#fff' : '#94a3b8',
                        }}>860</span>
                    </button>
                    <button
                        onClick={() => setActiveTab('gateways')}
                        style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            padding: '14px 28px', borderRadius: '16px', border: 'none', cursor: 'pointer',
                            background: activeTab === 'gateways'
                                ? 'linear-gradient(135deg, #059669, #047857)' : '#fff',
                            color: activeTab === 'gateways' ? '#fff' : '#64748b',
                            fontSize: '14px', fontWeight: 700, fontFamily: 'inherit',
                            boxShadow: activeTab === 'gateways'
                                ? '0 8px 24px rgba(5,150,105,0.25)' : '0 1px 3px rgba(0,0,0,0.04)',
                            transition: 'all 0.2s',
                        }}
                    >
                        <Radio size={18} />
                        Master Gateway
                        <span style={{
                            padding: '2px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 800,
                            background: activeTab === 'gateways' ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                            color: activeTab === 'gateways' ? '#fff' : '#94a3b8',
                        }}>20</span>
                    </button>
                </div>

                {/* ============ CONTROLLERS TAB ============ */}
                {activeTab === 'controllers' && (
                    <>
                        {/* Summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            {[
                                { label: 'Active Units', value: `${onlineControllers} / 860`, bg: '#eff6ff', fg: '#2563eb', icon: Cpu },
                                { label: 'Total Power', value: `${totalPower} kW`, bg: '#ecfdf5', fg: '#059669', icon: Zap },
                                { label: 'Fault Nodes', value: `${faultCount}`, bg: '#fef2f2', fg: '#dc2626', icon: WifiOff },
                            ].map(s => (
                                <div key={s.label} style={{
                                    background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #f1f5f9',
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '12px', background: s.bg, color: s.fg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}><s.icon size={20} /></div>
                                    <div>
                                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{s.label}</p>
                                        <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>{s.value}</h4>
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => toggleAllControllers(true)} style={{
                                    flex: 1, borderRadius: '16px', border: 'none', cursor: 'pointer',
                                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff',
                                    fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                                    boxShadow: '0 8px 24px rgba(37,99,235,0.25)', transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'inherit',
                                }}><Power size={16} /> All On</button>
                                <button onClick={() => toggleAllControllers(false)} style={{
                                    flex: 1, borderRadius: '16px', border: 'none', cursor: 'pointer',
                                    background: '#1e293b', color: '#fff',
                                    fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'inherit',
                                }}><PowerOff size={16} /> All Off</button>
                            </div>
                        </div>

                        {/* Search */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                                Smart Controller Unit — LoRa AS923 (P2P/Mesh) • {zones.length} โซน
                            </h3>
                            <div style={{ position: 'relative' }}>
                                <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                                <input
                                    type="text" placeholder="ค้นหาโซน..." value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        padding: '8px 14px 8px 34px', borderRadius: '10px', border: '1px solid #f1f5f9',
                                        background: '#fff', fontSize: '13px', fontWeight: 500, color: '#334155',
                                        outline: 'none', width: '220px', fontFamily: 'inherit',
                                    }}
                                />
                            </div>
                        </div>

                        {/* Zone Accordion */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {zoneGroups.map(zone => (
                                <div key={zone.id} style={{
                                    background: '#fff', borderRadius: '16px', border: '1px solid #f1f5f9', overflow: 'hidden',
                                }}>
                                    {/* Zone Header */}
                                    <div
                                        style={{
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            padding: '16px 20px', cursor: 'pointer',
                                        }}
                                        onClick={() => setExpandedZone(expandedZone === zone.id ? null : zone.id)}
                                        onMouseEnter={(e) => { e.currentTarget.style.background = '#fafbfc'; }}
                                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                                            {expandedZone === zone.id
                                                ? <ChevronDown size={16} style={{ color: '#2563eb' }} />
                                                : <ChevronRight size={16} style={{ color: '#cbd5e1' }} />
                                            }
                                            <div>
                                                <p style={{ fontSize: '14px', fontWeight: 700, color: expandedZone === zone.id ? '#2563eb' : '#0f172a', margin: 0 }}>
                                                    Zone {zone.id} — {zone.name}
                                                </p>
                                                <p style={{ fontSize: '12px', color: '#94a3b8', margin: '2px 0 0' }}>
                                                    {zone.onCount}/{zone.total} active • {zone.poles} เสาไฟ
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            {/* Progress bar */}
                                            <div style={{ width: '80px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                                                <div style={{
                                                    height: '100%', borderRadius: '3px',
                                                    background: zone.onCount === zone.total ? '#22c55e' : '#2563eb',
                                                    width: `${(zone.onCount / zone.total) * 100}%`,
                                                    transition: 'width 0.3s',
                                                }} />
                                            </div>
                                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', minWidth: '40px', textAlign: 'right' }}>
                                                {Math.round((zone.onCount / zone.total) * 100)}%
                                            </span>
                                            {/* Zone toggle */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    toggleZoneControllers(zone.id, !zone.allOn);
                                                }}
                                                style={{
                                                    padding: '5px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                                    background: zone.allOn ? '#dcfce7' : '#fef2f2',
                                                    color: zone.allOn ? '#15803d' : '#b91c1c',
                                                    fontSize: '11px', fontWeight: 700, fontFamily: 'inherit',
                                                    transition: 'all 0.2s',
                                                }}
                                            >
                                                {zone.allOn ? 'ON' : 'OFF'}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Node list */}
                                    {expandedZone === zone.id && (
                                        <div style={{ padding: '0 20px 16px', borderTop: '1px solid #f8fafc' }}>
                                            <div style={{
                                                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                                                gap: '10px', marginTop: '12px',
                                            }}>
                                                {zone.controllers.map(ctrl => (
                                                    <div key={ctrl.id} style={{
                                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                                        padding: '12px 14px', borderRadius: '12px',
                                                        background: ctrl.isOn ? '#f8fafc' : '#fafafa',
                                                        border: ctrl.status === 'fault' ? '1px solid #fecaca' : '1px solid #f1f5f9',
                                                        opacity: ctrl.isOn ? 1 : 0.6, transition: 'all 0.2s',
                                                    }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <div style={{
                                                                width: '8px', height: '8px', borderRadius: '50%',
                                                                background: ctrl.status === 'fault' ? '#ef4444' : ctrl.isOn ? '#22c55e' : '#cbd5e1',
                                                            }} />
                                                            <div>
                                                                <p style={{ fontSize: '12px', fontWeight: 700, color: '#334155', margin: 0 }}>{ctrl.id}</p>
                                                                <p style={{ fontSize: '10px', color: '#94a3b8', margin: '1px 0 0' }}>
                                                                    {ctrl.loraMode} • {ctrl.voltage}V • {ctrl.power}kW
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <label style={{ position: 'relative', cursor: ctrl.status === 'fault' ? 'not-allowed' : 'pointer' }}>
                                                            <input type="checkbox" checked={ctrl.isOn}
                                                                onChange={() => toggleController(ctrl.id)}
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
                    </>
                )}

                {/* ============ GATEWAYS TAB ============ */}
                {activeTab === 'gateways' && (
                    <>
                        {/* Summary */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                            {[
                                { label: 'Active Gateways', value: `${onlineGateways} / 20`, bg: '#ecfdf5', fg: '#059669', icon: Radio },
                                { label: 'Connected Nodes', value: `${totalNodes}`, bg: '#eff6ff', fg: '#2563eb', icon: Signal },
                                { label: '5G Gateways', value: `${gateways.filter(g => g.cellularType === '5G').length}`, bg: '#f5f3ff', fg: '#7c3aed', icon: Wifi },
                            ].map(s => (
                                <div key={s.label} style={{
                                    background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #f1f5f9',
                                    display: 'flex', alignItems: 'center', gap: '14px',
                                }}>
                                    <div style={{
                                        width: '44px', height: '44px', borderRadius: '12px', background: s.bg, color: s.fg,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}><s.icon size={20} /></div>
                                    <div>
                                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{s.label}</p>
                                        <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>{s.value}</h4>
                                    </div>
                                </div>
                            ))}
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => toggleAllGateways(true)} style={{
                                    flex: 1, borderRadius: '16px', border: 'none', cursor: 'pointer',
                                    background: 'linear-gradient(135deg, #059669, #047857)', color: '#fff',
                                    fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                                    boxShadow: '0 8px 24px rgba(5,150,105,0.25)', transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'inherit',
                                }}><Power size={16} /> All On</button>
                                <button onClick={() => toggleAllGateways(false)} style={{
                                    flex: 1, borderRadius: '16px', border: 'none', cursor: 'pointer',
                                    background: '#1e293b', color: '#fff',
                                    fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: 'inherit',
                                }}><PowerOff size={16} /> All Off</button>
                            </div>
                        </div>

                        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                            Master Gateway — LoRa AS923 + 4G/5G Cellular • 20 ชุด
                        </h3>

                        {/* Gateway Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            {gateways.map(gw => (
                                <div key={gw.id} style={{
                                    background: '#fff', borderRadius: '16px',
                                    border: gw.status === 'warning' ? '1px solid #fde68a' : '1px solid #f1f5f9',
                                    padding: '22px', opacity: gw.isOn ? 1 : 0.55, transition: 'all 0.3s',
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                                                background: gw.isOn ? '#ecfdf5' : '#f8fafc',
                                                color: gw.isOn ? '#059669' : '#94a3b8',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.3s',
                                            }}><Radio size={20} /></div>
                                            <div>
                                                <p style={{ fontSize: '14px', fontWeight: 700, color: gw.isOn ? '#0f172a' : '#94a3b8', margin: 0, transition: 'color 0.3s' }}>{gw.name}</p>
                                                <p style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 0' }}>{gw.id} • {gw.location}</p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{
                                                fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                                                background: gw.cellularType === '5G' ? '#f5f3ff' : '#f8fafc',
                                                color: gw.cellularType === '5G' ? '#7c3aed' : '#64748b',
                                            }}>{gw.cellularType}</span>
                                            <label style={{ cursor: 'pointer' }}>
                                                <input type="checkbox" checked={gw.isOn} onChange={() => toggleGateway(gw.id)}
                                                    style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                                                />
                                                <div style={{
                                                    width: '40px', height: '22px', borderRadius: '11px',
                                                    background: gw.isOn ? '#059669' : '#e2e8f0',
                                                    transition: 'background 0.25s', position: 'relative',
                                                }}>
                                                    <div style={{
                                                        width: '18px', height: '18px', borderRadius: '50%', background: '#fff',
                                                        position: 'absolute', top: '2px', left: gw.isOn ? '20px' : '2px',
                                                        transition: 'left 0.25s', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                                    }} />
                                                </div>
                                            </label>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                                        {[
                                            { label: 'Signal', value: `${gw.isOn ? gw.signal : 0}%`, color: gw.signal > 70 ? '#059669' : '#d97706' },
                                            { label: 'Nodes', value: `${gw.isOn ? gw.connectedNodes : 0}`, color: '#2563eb' },
                                            { label: 'IP', value: gw.ip, color: '#64748b' },
                                            { label: 'Uptime', value: gw.isOn ? gw.uptime : '—', color: '#64748b' },
                                        ].map(d => (
                                            <div key={d.label} style={{
                                                background: '#f8fafc', borderRadius: '10px', padding: '10px', textAlign: 'center',
                                            }}>
                                                <p style={{ fontSize: '13px', fontWeight: 700, color: gw.isOn ? d.color : '#cbd5e1', margin: 0, transition: 'color 0.3s' }}>{d.value}</p>
                                                <p style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', margin: '2px 0 0' }}>{d.label}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </MainLayout>
    );
}
