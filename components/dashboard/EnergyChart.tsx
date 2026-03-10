"use client";

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

const data = [
    { name: 'จ.', target: 4000, actual: 2400 },
    { name: 'อ.', target: 3000, actual: 1398 },
    { name: 'พ.', target: 2000, actual: 5800 },
    { name: 'พฤ.', target: 2780, actual: 3908 },
    { name: 'ศ.', target: 1890, actual: 4800 },
    { name: 'ส.', target: 2390, actual: 3800 },
    { name: 'อา.', target: 3490, actual: 4300 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#fff',
                borderRadius: '12px',
                padding: '12px 16px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                border: 'none',
            }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} style={{ fontSize: '12px', fontWeight: 500, color: p.color, margin: '4px 0 0' }}>
                        {p.name}: {p.value.toLocaleString()} kWh
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const EnergyChart = () => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { setMounted(true); }, []);

    if (!mounted) {
        return (
            <div style={{
                background: '#fff', borderRadius: '20px', border: '1px solid #f1f5f9',
                padding: '32px', height: '520px',
            }}>
                <div style={{ width: '200px', height: '20px', background: '#f1f5f9', borderRadius: '8px', marginBottom: '12px' }} />
                <div style={{ width: '300px', height: '14px', background: '#f8fafc', borderRadius: '6px' }} />
            </div>
        );
    }

    return (
        <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #f1f5f9',
            padding: '32px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        สรุปการประหยัดพลังงาน
                    </h3>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', margin: '4px 0 0' }}>
                        ปริมาณการใช้ไฟรายสัปดาห์เทียบกับระบบลดแสงอัจฉริยะ
                    </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', border: '2.5px solid #94a3b8' }} />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>เป้าหมาย</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2563eb' }} />
                        <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>ใช้จริง</span>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div style={{ flex: 1, minHeight: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2563eb" stopOpacity={0.12} />
                                <stop offset="100%" stopColor="#2563eb" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#2563eb"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorActual)"
                            dot={false}
                            activeDot={{ r: 6, fill: '#2563eb', stroke: '#fff', strokeWidth: 3 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="target"
                            stroke="#cbd5e1"
                            strokeWidth={2}
                            strokeDasharray="6 4"
                            dot={false}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
                <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '20px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 6px' }}>
                        ประหยัดไฟในสัปดาห์นี้
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '28px', fontWeight: 800, color: '#2563eb', letterSpacing: '-0.02em' }}>-24%</span>
                        <span style={{
                            fontSize: '11px', fontWeight: 600, color: '#2563eb', background: '#dbeafe',
                            padding: '3px 10px', borderRadius: '20px',
                        }}>ถึงเป้าหมาย</span>
                    </div>
                </div>
                <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '20px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 6px' }}>
                        ลดการปล่อยคาร์บอน
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '28px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                            1.2 <span style={{ fontSize: '16px', fontWeight: 500, color: '#94a3b8' }}>ตัน</span>
                        </span>
                        <span style={{
                            fontSize: '11px', fontWeight: 600, color: '#64748b', background: '#fff',
                            padding: '3px 10px', borderRadius: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                        }}>CO₂ eq.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnergyChart;
