"use client";

import React from 'react';
import { Maximize2, Navigation } from 'lucide-react';
import { useDevices } from '@/contexts/DeviceContext';
import Link from 'next/link';

const MapWidget = () => {
    const { controllers, gateways, zones } = useDevices();

    const onlineCount = controllers.filter(c => c.isOn && c.status !== 'fault').length;
    const faultCount = controllers.filter(c => c.status === 'fault').length;
    const warningCount = controllers.filter(c => c.status === 'warning').length;
    const gatewayOnline = gateways.filter(g => g.isOn).length;

    // Take first 8 zones for mini-map display
    const displayZones = zones.slice(0, 8).map(z => {
        const zControllers = controllers.filter(c => c.zoneId === z.id);
        const hasFault = zControllers.some(c => c.status === 'fault');
        const hasWarning = zControllers.some(c => c.status === 'warning');
        const allOn = zControllers.filter(c => c.status !== 'fault').every(c => c.isOn);
        return {
            ...z,
            status: hasFault ? 'fault' : hasWarning ? 'warning' : allOn ? 'online' : 'partial',
        };
    });

    // Distribute zones on the widget
    const positions = [
        { x: '28%', y: '30%' }, { x: '65%', y: '50%' },
        { x: '50%', y: '70%' }, { x: '22%', y: '60%' },
        { x: '75%', y: '25%' }, { x: '40%', y: '45%' },
        { x: '82%', y: '65%' }, { x: '15%', y: '80%' },
    ];

    return (
        <div
            style={{
                background: '#ffffff',
                borderRadius: '20px',
                border: '1px solid #f1f5f9',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
            }}
        >
            {/* Header */}
            <div style={{ padding: '28px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>City Overview</h3>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', margin: '4px 0 0' }}>
                        {zones.length} Zones • {controllers.length} Controllers
                    </p>
                </div>
                <Link href="/zones"
                    style={{
                        width: '36px', height: '36px', borderRadius: '10px', border: '1px solid #f1f5f9',
                        background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s', textDecoration: 'none',
                    }}
                >
                    <Maximize2 size={14} />
                </Link>
            </div>

            {/* Map Area */}
            <div
                style={{
                    flex: 1,
                    margin: '20px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #f0f4ff 0%, #e8f0fe 50%, #f0fdf4 100%)',
                    position: 'relative',
                    overflow: 'hidden',
                    minHeight: '240px',
                }}
            >
                {/* Grid Lines */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }} viewBox="0 0 400 400" preserveAspectRatio="none">
                    <path d="M0,80 L400,80 M0,160 L400,160 M0,240 L400,240 M0,320 L400,320" stroke="#94a3b8" strokeWidth="1" fill="none" />
                    <path d="M80,0 L80,400 M160,0 L160,400 M240,0 L240,400 M320,0 L320,400" stroke="#94a3b8" strokeWidth="1" fill="none" />
                    <path d="M60,0 L340,400" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="8 6" fill="none" />
                    <path d="M0,120 L400,280" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="8 6" fill="none" />
                </svg>

                {/* Roads */}
                <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.25 }} viewBox="0 0 400 400" preserveAspectRatio="none">
                    <path d="M50,200 Q200,100 350,200" stroke="#64748b" strokeWidth="3" fill="none" />
                    <path d="M200,40 Q180,200 200,360" stroke="#64748b" strokeWidth="3" fill="none" />
                    <path d="M100,350 Q200,250 350,300" stroke="#64748b" strokeWidth="2" fill="none" strokeDasharray="4 4" />
                </svg>

                {/* Zone Markers */}
                {displayZones.map((zone, i) => {
                    const pos = positions[i] || { x: '50%', y: '50%' };
                    const statusColor = zone.status === 'fault' ? '#ef4444'
                        : zone.status === 'warning' ? '#f59e0b'
                            : zone.status === 'online' ? '#22c55e'
                                : '#94a3b8';
                    return (
                        <div key={zone.id}
                            style={{
                                position: 'absolute', left: pos.x, top: pos.y,
                                transform: 'translate(-50%, -50%)', cursor: 'pointer',
                            }}
                        >
                            {zone.status === 'fault' && (
                                <div style={{
                                    position: 'absolute',
                                    width: '24px', height: '24px', borderRadius: '50%',
                                    background: 'rgba(239, 68, 68, 0.2)',
                                    animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
                                    left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                                }} />
                            )}
                            <div style={{
                                width: '12px', height: '12px', borderRadius: '50%',
                                background: statusColor,
                                border: '3px solid #fff',
                                boxShadow: `0 2px 8px ${statusColor}60`,
                                position: 'relative', zIndex: 2,
                            }} />
                        </div>
                    );
                })}

                {/* Bottom Overlay */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: '12px', left: '12px', right: '12px',
                        background: 'rgba(255,255,255,0.92)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '12px', padding: '12px 16px',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                    }}
                >
                    <div style={{ display: 'flex', gap: '14px', fontSize: '11px', fontWeight: 600 }}>
                        <span style={{ color: '#22c55e' }}>● {onlineCount} Online</span>
                        <span style={{ color: '#f59e0b' }}>● {warningCount} Warning</span>
                        <span style={{ color: '#ef4444' }}>● {faultCount} Fault</span>
                    </div>
                    <Link href="/zones" style={{
                        fontSize: '12px', fontWeight: 600, color: '#2563eb', background: 'none',
                        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px',
                        textDecoration: 'none',
                    }}>
                        <Navigation size={12} />
                        Full Map
                    </Link>
                </div>
            </div>

            <style>{`
        @keyframes ping {
          75%, 100% { transform: translate(-50%, -50%) scale(2.5); opacity: 0; }
        }
      `}</style>
        </div>
    );
};

export default MapWidget;
