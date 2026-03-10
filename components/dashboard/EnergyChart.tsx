"use client";

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type Timeframe = 'daily' | 'weekly' | 'monthly' | 'yearly';

const mockData = {
    daily: [
        { name: '00:00', target: 800, actual: 450 },
        { name: '04:00', target: 600, actual: 300 },
        { name: '08:00', target: 200, actual: 120 },
        { name: '12:00', target: 0, actual: 0 },
        { name: '16:00', target: 100, actual: 50 },
        { name: '20:00', target: 900, actual: 550 },
        { name: '24:00', target: 850, actual: 480 },
    ],
    weekly: [
        { name: 'จ.', target: 4000, actual: 2400 },
        { name: 'อ.', target: 3000, actual: 1398 },
        { name: 'พ.', target: 2000, actual: 5800 },
        { name: 'พฤ.', target: 2780, actual: 3908 },
        { name: 'ศ.', target: 1890, actual: 4800 },
        { name: 'ส.', target: 2390, actual: 3800 },
        { name: 'อา.', target: 3490, actual: 4300 },
    ],
    monthly: [
        { name: 'สัปดาห์ 1', target: 15000, actual: 11000 },
        { name: 'สัปดาห์ 2', target: 14500, actual: 10500 },
        { name: 'สัปดาห์ 3', target: 16000, actual: 12000 },
        { name: 'สัปดาห์ 4', target: 15500, actual: 11500 },
    ],
    yearly: [
        { name: 'ม.ค.', target: 65000, actual: 48000 },
        { name: 'ก.พ.', target: 60000, actual: 45000 },
        { name: 'มี.ค.', target: 68000, actual: 51000 },
        { name: 'เม.ย.', target: 70000, actual: 53000 },
        { name: 'พ.ค.', target: 67000, actual: 50000 },
        { name: 'มิ.ย.', target: 65000, actual: 49000 },
        { name: 'ก.ค.', target: 66000, actual: 51000 },
        { name: 'ส.ค.', target: 64000, actual: 48000 },
        { name: 'ก.ย.', target: 63000, actual: 47000 },
        { name: 'ต.ค.', target: 65000, actual: 49000 },
        { name: 'พ.ย.', target: 67000, actual: 50000 },
        { name: 'ธ.ค.', target: 69000, actual: 52000 },
    ]
};

const summaryData = {
    daily: { savings: '-42%', co2: '0.1', label: 'วันนี้' },
    weekly: { savings: '-24%', co2: '1.2', label: 'สัปดาห์นี้' },
    monthly: { savings: '-26%', co2: '5.4', label: 'เดือนนี้' },
    yearly: { savings: '-25%', co2: '64.5', label: 'ปีนี้' },
};

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
                    <p key={i} style={{ fontSize: '12px', fontWeight: 500, color: p.name === 'target' ? '#94a3b8' : '#2563eb', margin: '4px 0 0' }}>
                        {p.name === 'target' ? 'เป้าหมาย' : 'ใช้จริง'}: {p.value.toLocaleString()} kWh
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const EnergyChart = () => {
    const [mounted, setMounted] = React.useState(false);
    const [timeframe, setTimeframe] = React.useState<Timeframe>('weekly');

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

    const currentData = mockData[timeframe];
    const summary = summaryData[timeframe];

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
                        การใช้พลังงาน
                    </h3>
                    <p style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', margin: '4px 0 0' }}>
                        ปริมาณการใช้ไฟราย{timeframe === 'daily' ? 'วัน' : timeframe === 'weekly' ? 'สัปดาห์' : timeframe === 'monthly' ? 'เดือน' : 'ปี'}เทียบกับระบบลดแสงอัจฉริยะ
                    </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
                    {/* Timeframe Selector */}
                    <div style={{ display: 'flex', background: '#f1f5f9', borderRadius: '10px', padding: '4px' }}>
                        {[
                            { id: 'daily', label: 'รายวัน' },
                            { id: 'weekly', label: 'รายสัปดาห์' },
                            { id: 'monthly', label: 'รายเดือน' },
                            { id: 'yearly', label: 'รายปี' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTimeframe(t.id as Timeframe)}
                                style={{
                                    padding: '6px 12px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: 600,
                                    fontFamily: 'inherit',
                                    background: timeframe === t.id ? '#fff' : 'transparent',
                                    color: timeframe === t.id ? '#0f172a' : '#64748b',
                                    boxShadow: timeframe === t.id ? '0 2px 4px rgba(0,0,0,0.04)' : 'none',
                                    transition: 'all 0.2s',
                                }}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#e2e8f0' }} />
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>เป้าหมาย</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#2563eb' }} />
                            <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>ใช้จริง</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div style={{ flex: 1, minHeight: '280px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={currentData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }}
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241,245,249,0.5)' }} />
                        <Bar
                            dataKey="target"
                            fill="#e2e8f0"
                            radius={[6, 6, 0, 0]}
                            barSize={16}
                        />
                        <Bar
                            dataKey="actual"
                            fill="#2563eb"
                            radius={[6, 6, 0, 0]}
                            barSize={16}
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '24px' }}>
                <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '20px' }}>
                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 6px' }}>
                       ไฟ{summary.label}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '28px', fontWeight: 800, color: '#2563eb', letterSpacing: '-0.02em' }}>{summary.savings}</span>
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
                            {summary.co2} <span style={{ fontSize: '16px', fontWeight: 500, color: '#94a3b8' }}>ตัน</span>
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
