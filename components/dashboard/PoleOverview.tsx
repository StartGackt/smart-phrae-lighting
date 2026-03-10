"use client";

import React from 'react';
import { useDevices } from '@/contexts/DeviceContext';
import { Lightbulb, Cpu, Radio, Zap } from 'lucide-react';

const PoleOverview = () => {
    const { controllers, gateways } = useDevices();

    // Aggregate stats
    const onlinePoles = controllers.filter(c => c.isOn && c.status !== 'fault').length;
    const totalPoles = controllers.length;
    const avgPower = (controllers.filter(c => c.isOn).reduce((acc, c) => acc + parseFloat(c.power), 0) / Math.max(onlinePoles, 1)).toFixed(1);
    const activeGateways = gateways.filter(g => g.isOn).length;

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
                position: 'relative',
            }}
        >
            {/* Header */}
            <div style={{ padding: '28px 28px 0', zIndex: 10 }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>โครงข่ายเสาไฟอัจฉริยะ</h3>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', margin: '4px 0 0' }}>
                    จำลองสถานะการทำงานของอุปกรณ์ในระบบ
                </p>
            </div>

            {/* Illustration Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                minHeight: '260px',
                marginTop: '10px',
                padding: '0 20px 20px',
            }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '120px',
                    height: '120px',
                    background: 'radial-gradient(circle, rgba(250,204,21,0.2) 0%, rgba(250,204,21,0) 70%)',
                    borderRadius: '50%',
                    filter: 'blur(10px)',
                }} />

                {/* Left floating cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: 1, alignItems: 'flex-end', paddingRight: '16px', zIndex: 10 }}>
                    <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginBottom: '2px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>หลอดไฟ LED</span>
                            <div style={{ width: '24px', height: '24px', background: '#fef3c7', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Lightbulb size={12} color="#d97706" />
                            </div>
                        </div>
                        <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>สว่าง {onlinePoles}/{totalPoles} ต้น</p>
                    </div>

                    <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9', textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end', marginBottom: '2px' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>เกตเวย์ (Gateway)</span>
                            <div style={{ width: '24px', height: '24px', background: '#dbeafe', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Radio size={12} color="#2563eb" />
                            </div>
                        </div>
                        <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>ออนไลน์ {activeGateways} จุด</p>
                    </div>
                </div>

                {/* Pole SVG Graphics */}
                <div style={{ width: '80px', height: '240px', position: 'relative', zIndex: 5 }}>
                    <svg width="100%" height="100%" viewBox="0 0 100 280">
                        {/* Light Beam */}
                        <defs>
                            <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" />
                                <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M 40 40 L -20 280 L 100 280 Z" fill="url(#beam)" />

                        {/* Pole Base */}
                        <rect x="42" y="260" width="16" height="20" fill="#94a3b8" rx="2" />
                        <rect x="38" y="274" width="24" height="6" fill="#64748b" rx="1" />

                        {/* Main Pole */}
                        <rect x="46" y="50" width="8" height="210" fill="#cbd5e1" />

                        {/* Arm */}
                        <path d="M 50 55 Q 70 35 90 35" stroke="#cbd5e1" strokeWidth="6" fill="none" strokeLinecap="round" />

                        {/* Light Fixture */}
                        <path d="M 75 30 L 95 30 L 98 36 L 72 36 Z" fill="#475569" />
                        <rect x="76" y="36" width="18" height="4" fill="#fef08a" rx="2" />

                        {/* Smart Controller Box */}
                        <rect x="42" y="140" width="16" height="26" fill="#0f172a" rx="3" />
                        <circle cx="50" cy="148" r="2" fill="#10b981" />
                        <circle cx="50" cy="158" r="2" fill="#3b82f6" />
                    </svg>
                </div>

                {/* Right floating cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px', flex: 1, alignItems: 'flex-start', paddingLeft: '16px', zIndex: 10 }}>
                    <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <div style={{ width: '24px', height: '24px', background: '#dcfce7', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Cpu size={12} color="#059669" />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>ชุดควบคุม</span>
                        </div>
                        <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>เชื่อมต่อผ่าน LoRaWAN</p>
                    </div>

                    <div style={{ background: '#fff', padding: '10px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                            <div style={{ width: '24px', height: '24px', background: '#ffedd5', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Zap size={12} color="#d97706" />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>กำลังไฟเฉลี่ย</span>
                        </div>
                        <p style={{ fontSize: '10px', color: '#64748b', margin: 0 }}>{avgPower} kW / ต้น</p>
                    </div>
                </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', margin: 0 }}>อุปกรณ์ออนไลน์และทำงานปกติ {onlinePoles} ชุด</p>
            </div>
        </div>
    );
};

export default PoleOverview;
