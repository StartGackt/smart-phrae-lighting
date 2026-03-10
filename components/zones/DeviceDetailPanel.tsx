"use client";

import React from 'react';
import type { SmartController } from '@/contexts/DeviceContext';
import {
    X, MapPin, Zap, Thermometer, Clock, BarChart3,
    Power, PowerOff, Sun, CloudOff, RefreshCw, ChevronLeft, Cpu, Wifi
} from 'lucide-react';

interface DeviceDetailPanelProps {
    controller: SmartController;
    onClose: () => void;
    onToggle: () => void;
    onIntensityChange: (val: number) => void;
    onBack?: () => void;
}

export default function DeviceDetailPanel({ controller, onClose, onToggle, onIntensityChange, onBack }: DeviceDetailPanelProps) {
    const c = controller;
    // Mock additional data
    const dailyConsumption = (parseFloat(c.power) * 10).toFixed(1);
    const currentDraw = (parseFloat(c.power) * 1000 / 220).toFixed(2);
    const seedNum = parseInt(c.id.replace(/\D/g, ''));
    const uptimeDays = 10 + (seedNum % 30);
    const uptimeHours = seedNum % 24;

    return (
        <div style={{
            position: 'absolute', top: '16px', right: '16px', bottom: '16px',
            width: '340px', zIndex: 1002,
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

            {/* Hero */}
            <div style={{ position: 'relative', height: '150px', flexShrink: 0, overflow: 'hidden' }}>
                <img
                    src="/images/zone-hero.jpg"
                    alt={c.id}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.15), rgba(15,23,42,0.85))',
                }} />
                {/* Back / Close */}
                <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', display: 'flex', justifyContent: 'space-between' }}>
                    {onBack ? (
                        <button onClick={onBack} style={{
                            width: '32px', height: '32px', borderRadius: '10px',
                            background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                            border: 'none', cursor: 'pointer', color: '#fff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}><ChevronLeft size={16} /></button>
                    ) : <div />}
                    <button onClick={onClose} style={{
                        width: '32px', height: '32px', borderRadius: '10px',
                        background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                        border: 'none', cursor: 'pointer', color: '#fff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}><X size={16} /></button>
                </div>
                {/* Status badge */}
                <div style={{ position: 'absolute', top: '12px', left: onBack ? '52px' : '12px' }}>
                    <span style={{
                        padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase',
                        background: c.isOn ? '#22c55e' : c.status === 'fault' ? '#ef4444' : '#94a3b8',
                        color: '#fff', letterSpacing: '0.1em',
                    }}>{c.isOn ? 'ONLINE' : c.status === 'fault' ? 'FAULT' : 'OFFLINE'}</span>
                </div>
                {/* Device ID */}
                <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.12em', margin: '0 0 4px' }}>
                        DEVICE IDENTITY
                    </p>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 4px', letterSpacing: '0.02em' }}>{c.id}</h3>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={11} /> {c.zone}, อ.เมืองแพร่
                    </p>
                </div>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflow: 'auto', padding: '20px' }}>
                {/* Manual Override Toggle */}
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '14px 16px', borderRadius: '14px', background: '#f8fafc',
                    marginBottom: '16px',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                            width: '36px', height: '36px', borderRadius: '10px',
                            background: c.isOn ? '#eff6ff' : '#f1f5f9',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: c.isOn ? '#2563eb' : '#94a3b8',
                        }}><Zap size={18} /></div>
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Manual Override</p>
                            <p style={{ fontSize: '11px', color: '#94a3b8', margin: 0 }}>
                                Current Status: <span style={{ color: c.isOn ? '#059669' : '#dc2626', fontWeight: 700 }}>{c.isOn ? 'ON' : 'OFF'}</span>
                            </p>
                        </div>
                    </div>
                    <label style={{ cursor: c.status === 'fault' ? 'not-allowed' : 'pointer' }}>
                        <input type="checkbox" checked={c.isOn} onChange={onToggle}
                            disabled={c.status === 'fault'}
                            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                        />
                        <div style={{
                            width: '46px', height: '26px', borderRadius: '13px',
                            background: c.isOn ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#e2e8f0',
                            transition: 'background 0.25s', position: 'relative',
                            boxShadow: c.isOn ? '0 4px 12px rgba(37,99,235,0.3)' : 'none',
                        }}>
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
                                position: 'absolute', top: '3px', left: c.isOn ? '23px' : '3px',
                                transition: 'left 0.25s', boxShadow: '0 2px 4px rgba(0,0,0,0.12)',
                            }} />
                        </div>
                    </label>
                </div>

                {/* Dimming Level */}
                <div style={{
                    padding: '16px', borderRadius: '14px', background: '#f8fafc',
                    marginBottom: '16px',
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Dimming Level</p>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#2563eb' }}>{c.intensity}%</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sun size={14} style={{ color: '#94a3b8', flexShrink: 0 }} />
                        <input
                            type="range" min="0" max="100" value={c.intensity}
                            onChange={(e) => onIntensityChange(parseInt(e.target.value))}
                            disabled={c.status === 'fault' || !c.isOn}
                            style={{
                                flex: 1, height: '6px', borderRadius: '3px',
                                appearance: 'none', WebkitAppearance: 'none',
                                background: `linear-gradient(to right, #2563eb ${c.intensity}%, #e2e8f0 ${c.intensity}%)`,
                                cursor: c.status === 'fault' || !c.isOn ? 'not-allowed' : 'pointer',
                                outline: 'none',
                            }}
                        />
                        <Sun size={18} style={{ color: '#f59e0b', flexShrink: 0 }} />
                    </div>
                </div>

                {/* Technical Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                    {[
                        { label: 'CURRENT DRAW', value: `${currentDraw} A`, icon: Zap, color: '#2563eb' },
                        { label: 'TEMPERATURE', value: `${c.temperature} °C`, icon: Thermometer, color: '#f59e0b' },
                        { label: 'DAILY CONS.', value: `${dailyConsumption} kWh`, icon: BarChart3, color: '#059669' },
                        { label: 'UPTIME', value: `${uptimeDays}d ${uptimeHours}h`, icon: Clock, color: '#7c3aed' },
                    ].map(s => (
                        <div key={s.label} style={{
                            background: '#f8fafc', borderRadius: '14px', padding: '14px',
                        }}>
                            <s.icon size={16} style={{ color: s.color, marginBottom: '6px' }} />
                            <p style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 2px' }}>{s.value}</p>
                            <p style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Device Info */}
                <div style={{
                    padding: '14px 16px', borderRadius: '14px', background: '#f8fafc',
                }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 10px' }}>
                        ข้อมูลอุปกรณ์
                    </p>
                    {[
                        { label: 'Voltage', value: `${c.voltage} V` },
                        { label: 'Power', value: `${c.power} kW` },
                        { label: 'LoRa Mode', value: c.loraMode },
                        { label: 'Firmware', value: c.firmware },
                        { label: 'Coordinates', value: `${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}` },
                    ].map(d => (
                        <div key={d.label} style={{
                            display: 'flex', justifyContent: 'space-between', padding: '6px 0',
                            borderBottom: '1px solid #f1f5f9',
                        }}>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>{d.label}</span>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>{d.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Bottom button */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #f1f5f9', flexShrink: 0 }}>
                <button style={{
                    width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                    background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                    color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(37,99,235,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    fontFamily: 'inherit',
                }}>
                    <RefreshCw size={16} /> Sync to Device
                </button>
            </div>
        </div>
    );
}
