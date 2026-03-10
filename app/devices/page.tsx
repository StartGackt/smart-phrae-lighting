"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import DeviceCard from '@/components/devices/DeviceCard';
import { Zap, ShieldCheck, AlertCircle, Grid, List as ListIcon, Filter } from 'lucide-react';

const devices = [
    { id: '1', name: 'Charoen Muang Road', units: 85, status: 'Online', consumption: '2.8', intensity: 85 },
    { id: '2', name: 'Phra Ruang Road', units: 45, status: 'Warning', consumption: '0.0', intensity: 0 },
    { id: '3', name: 'Chumphon Road', units: 64, status: 'Online', consumption: '2.1', intensity: 100 },
    { id: '4', name: 'Kham Lue Road', units: 92, status: 'Online', consumption: '3.2', intensity: 85 },
    { id: '5', name: 'Chaiyabun Road', units: 78, status: 'Online', consumption: '2.6', intensity: 100 },
    { id: '6', name: 'Nam Kue Road', units: 102, status: 'Online', consumption: '3.5', intensity: 100 },
    { id: '7', name: 'Muang Hit Road', units: 55, status: 'Online', consumption: '1.8', intensity: 100 },
    { id: '8', name: 'Phrae-Sung Men Rd', units: 210, status: 'Online', consumption: '7.4', intensity: 100 },
    { id: '9', name: 'Rong Kasery Mkt', units: 34, status: 'Offline', consumption: '0.0', intensity: 0 },
];

const summaryCards = [
    { icon: Zap, label: 'Active Consumption', value: '185 kW', bg: '#eff6ff', fg: '#2563eb' },
    { icon: ShieldCheck, label: 'Online Nodes', value: '842 / 860', bg: '#ecfdf5', fg: '#059669' },
    { icon: AlertCircle, label: 'Fault Alerts', value: '2 Critical', bg: '#fef2f2', fg: '#dc2626' },
];

export default function DevicesPage() {
    return (
        <MainLayout title="Light Control">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Summary Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {summaryCards.map((card) => (
                        <div key={card.label} style={{
                            background: '#fff', padding: '22px', borderRadius: '16px', border: '1px solid #f1f5f9',
                            display: 'flex', alignItems: 'center', gap: '14px',
                        }}>
                            <div style={{
                                width: '44px', height: '44px', borderRadius: '12px',
                                background: card.bg, color: card.fg,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <card.icon size={20} />
                            </div>
                            <div>
                                <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: 0 }}>
                                    {card.label}
                                </p>
                                <h4 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>{card.value}</h4>
                            </div>
                        </div>
                    ))}
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button style={{
                            flex: 1, borderRadius: '16px', border: 'none', cursor: 'pointer',
                            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff',
                            fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em',
                            boxShadow: '0 8px 24px rgba(37,99,235,0.25)', transition: 'all 0.2s',
                        }}>All On</button>
                        <button style={{
                            flex: 1, borderRadius: '16px', border: 'none', cursor: 'pointer',
                            background: '#1e293b', color: '#fff',
                            fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.06em',
                            boxShadow: '0 8px 24px rgba(0,0,0,0.12)', transition: 'all 0.2s',
                        }}>All Off</button>
                    </div>
                </div>

                {/* Toolbar */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Zone Control Grid</h3>
                        <span style={{
                            fontSize: '11px', fontWeight: 700, color: '#64748b', background: '#f1f5f9',
                            padding: '4px 12px', borderRadius: '8px', textTransform: 'uppercase' as const,
                            letterSpacing: '0.04em',
                        }}>{devices.length} Locations</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: '10px', padding: '3px', display: 'flex' }}>
                            <button style={{
                                padding: '6px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                background: '#f1f5f9', color: '#1e293b', display: 'flex', alignItems: 'center',
                            }}><Grid size={16} /></button>
                            <button style={{
                                padding: '6px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                                background: 'transparent', color: '#94a3b8', display: 'flex', alignItems: 'center',
                            }}><ListIcon size={16} /></button>
                        </div>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '8px 16px', borderRadius: '10px', border: '1px solid #f1f5f9',
                            background: '#fff', color: '#64748b', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer',
                        }}><Filter size={16} /> Filter</button>
                    </div>
                </div>

                {/* Device Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {devices.map((d) => (
                        <DeviceCard
                            key={d.id}
                            id={d.id}
                            name={d.name}
                            location="Main Road"
                            units={d.units}
                            status={d.status as any}
                            consumption={d.consumption}
                            intensity={d.intensity}
                        />
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
