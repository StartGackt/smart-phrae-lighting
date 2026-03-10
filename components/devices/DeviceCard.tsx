"use client";

import React from 'react';
import { Wifi, WifiOff, Zap } from 'lucide-react';

interface DeviceCardProps {
    id: string;
    name: string;
    location: string;
    units: number;
    status: 'Online' | 'Offline' | 'Warning';
    consumption: string;
    intensity: number;
    isOn: boolean;
    onToggle: (id: string) => void;
    onIntensityChange: (id: string, value: number) => void;
}

const DeviceCard = ({ id, name, location, units, status, consumption, intensity, isOn, onToggle, onIntensityChange }: DeviceCardProps) => {
    const canControl = status !== 'Offline';
    const displayIntensity = isOn ? intensity : 0;
    const displayConsumption = isOn ? consumption : '0.0';

    const statusColor = status === 'Online' ? '#059669' : status === 'Warning' ? '#dc2626' : '#94a3b8';
    const iconBg = isOn ? '#eff6ff' : status === 'Warning' ? '#fef2f2' : '#f8fafc';
    const iconFg = isOn ? '#2563eb' : status === 'Warning' ? '#dc2626' : '#94a3b8';

    return (
        <div
            style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '24px',
                border: status === 'Warning' ? '1px solid #fecaca' : '1px solid #f1f5f9',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'default',
                opacity: isOn ? 1 : 0.7,
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
            }}
        >
            {/* Top Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{
                    width: '44px', height: '44px', borderRadius: '14px',
                    background: iconBg, color: iconFg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.3s ease',
                }}>
                    {!isOn || status === 'Offline' ? <WifiOff size={20} /> : <Wifi size={20} />}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {status === 'Warning' && (
                        <span style={{
                            fontSize: '10px', fontWeight: 700, color: '#fff', background: '#ef4444',
                            padding: '2px 8px', borderRadius: '6px', textTransform: 'uppercase' as const,
                            letterSpacing: '0.05em',
                        }}>Fault</span>
                    )}
                    {/* Toggle */}
                    <label style={{
                        position: 'relative', display: 'inline-flex', alignItems: 'center',
                        cursor: canControl ? 'pointer' : 'not-allowed',
                    }}>
                        <input
                            type="checkbox"
                            checked={isOn}
                            onChange={() => { if (canControl) onToggle(id); }}
                            style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                        />
                        <div style={{
                            width: '44px', height: '24px', borderRadius: '12px',
                            background: isOn ? '#2563eb' : '#e2e8f0',
                            transition: 'background 0.3s ease',
                            position: 'relative',
                        }}>
                            <div style={{
                                width: '20px', height: '20px', borderRadius: '50%',
                                background: '#fff', position: 'absolute', top: '2px',
                                left: isOn ? '22px' : '2px',
                                transition: 'left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                            }} />
                        </div>
                    </label>
                </div>
            </div>

            {/* Name & Status */}
            <h4 style={{ fontSize: '16px', fontWeight: 700, color: isOn ? '#0f172a' : '#94a3b8', margin: '0 0 4px', lineHeight: 1.3, transition: 'color 0.3s' }}>{name}</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 500, color: '#94a3b8', marginBottom: '18px' }}>
                <span>{units} Units</span>
                <span style={{ width: '3px', height: '3px', borderRadius: '50%', background: '#cbd5e1' }} />
                <span style={{ color: isOn ? statusColor : '#94a3b8', fontWeight: 600, transition: 'color 0.3s' }}>
                    {isOn ? (status === 'Offline' ? 'Offline' : status) : 'Off'}
                </span>
            </div>

            {/* Dimming */}
            <div style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>
                        Dimming Intensity
                    </span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isOn ? '#2563eb' : '#94a3b8', transition: 'color 0.3s' }}>
                        {displayIntensity}%
                    </span>
                </div>
                <div style={{ position: 'relative', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{
                        height: '100%', borderRadius: '3px',
                        background: isOn ? 'linear-gradient(90deg, #2563eb, #3b82f6)' : '#cbd5e1',
                        width: `${displayIntensity}%`,
                        transition: 'width 0.4s ease, background 0.3s ease',
                    }} />
                </div>
                <input
                    type="range"
                    min="0" max="100"
                    value={displayIntensity}
                    onChange={(e) => onIntensityChange(id, parseInt(e.target.value))}
                    disabled={!isOn || !canControl}
                    style={{
                        width: '100%', height: '20px',
                        appearance: 'none', background: 'transparent',
                        cursor: isOn && canControl ? 'pointer' : 'not-allowed',
                        position: 'relative', top: '-13px', margin: 0, opacity: 0,
                    }}
                />
            </div>

            {/* Footer */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                paddingTop: '14px', borderTop: '1px solid #f8fafc',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Zap size={14} style={{ color: isOn ? '#f59e0b' : '#cbd5e1', transition: 'color 0.3s' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: isOn ? '#334155' : '#94a3b8', transition: 'color 0.3s' }}>
                        {displayConsumption} kW
                    </span>
                </div>
                <button
                    style={{
                        fontSize: '12px', fontWeight: 600, color: '#2563eb', background: '#eff6ff',
                        border: 'none', padding: '5px 12px', borderRadius: '8px', cursor: 'pointer',
                        transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#dbeafe'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#eff6ff'; }}
                >
                    View Details
                </button>
            </div>
        </div>
    );
};

export default DeviceCard;
