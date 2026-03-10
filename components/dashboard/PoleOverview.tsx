"use client";

import React, { useState, useEffect } from 'react';
import { useDevices } from '@/contexts/DeviceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ShieldCheck, AlertTriangle, AlertCircle, WifiOff, Activity } from 'lucide-react';

const PoleOverview = () => {
    const { controllers } = useDevices();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Aggregate stats
    const onlinePoles = controllers.filter(c => c.status === 'online').length;
    const warningPoles = controllers.filter(c => c.status === 'warning').length;
    const faultPoles = controllers.filter(c => c.status === 'fault').length;
    const offlinePoles = controllers.filter(c => c.status === 'offline').length;
    const totalPoles = controllers.length;

    const data = [
        { name: 'ทำงานปกติ', value: onlinePoles, color: '#22c55e', icon: ShieldCheck },
        { name: 'เฝ้าระวัง', value: warningPoles, color: '#f59e0b', icon: AlertTriangle },
        { name: 'ขัดข้อง', value: faultPoles, color: '#ef4444', icon: AlertCircle },
        { name: 'ออฟไลน์', value: offlinePoles, color: '#94a3b8', icon: WifiOff },
    ];

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div style={{
                    background: '#fff', borderRadius: '12px', padding: '10px 14px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: 'none',
                    display: 'flex', alignItems: 'center', gap: '10px'
                }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: data.color }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>{data.name}</span>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: data.color }}>{data.value}</span>
                </div>
            );
        }
        return null;
    };

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
            <div style={{ padding: '28px 28px 0', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>สถานะอุปกรณ์ในระบบ</h3>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', margin: '4px 0 0' }}>
                        ความพร้อมใช้งานของเสาไฟอัจฉริยะ (โคมไฟ/ชุดควบคุม)
                    </p>
                </div>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Activity size={20} color="#2563eb" />
                </div>
            </div>

            {/* Chart Area */}
            <div style={{ flex: 1, position: 'relative', minHeight: '240px', display: 'flex', flexDirection: 'column', padding: '20px' }}>
                {mounted && (
                    <div style={{ flex: 1, position: 'relative' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={75}
                                    outerRadius={105}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center Text in Donut Chart */}
                        <div style={{
                            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                        }}>
                            <span style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1 }}>{totalPoles}</span>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '4px' }}>
                                อุปกรณ์ทั้งหมด
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* Legend / Status Cards */}
            <div style={{ padding: '0 24px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                {data.map((item) => (
                    <div key={item.name} style={{
                        background: '#f8fafc', borderRadius: '12px', padding: '12px 16px',
                        display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #f1f5f9'
                    }}>
                        <div style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <item.icon size={16} color={item.color} />
                        </div>
                        <div>
                            <p style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', margin: '0 0 2px' }}>{item.name}</p>
                            <p style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PoleOverview;
