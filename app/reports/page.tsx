"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts';
import { FileText, Table as TableIcon, Zap, Leaf, DollarSign, ChevronRight } from 'lucide-react';
import { useDevices } from '@/contexts/DeviceContext';

const CustomBarTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#fff', borderRadius: '12px', padding: '12px 16px',
                boxShadow: '0 8px 30px rgba(0,0,0,0.12)', border: 'none',
            }}>
                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{label}</p>
                {payload.map((p: any, i: number) => (
                    <p key={i} style={{ fontSize: '12px', fontWeight: 500, color: p.fill, margin: '2px 0 0' }}>
                        {p.name === 'before' ? 'ระบบเก่า' : 'ระบบใหม่'}: {p.value.toLocaleString()} kWh
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function ReportsPage() {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => { setMounted(true); }, []);

    const { controllers, zones } = useDevices();

    // Compute real stats from DeviceContext
    const totalPower = controllers.filter(c => c.isOn).reduce((s, c) => s + parseFloat(c.power), 0);
    const avgDimming = controllers.filter(c => c.isOn).reduce((s, c) => s + c.intensity, 0) / Math.max(controllers.filter(c => c.isOn).length, 1);
    const savingsPercent = (100 - avgDimming).toFixed(1);
    const totalSavingsKw = (totalPower * (100 - avgDimming) / avgDimming).toFixed(0);
    const carbonOffset = (totalPower * 0.5 * 0.08).toFixed(1); // rough CO2 estimate
    const costSavings = (parseFloat(totalSavingsKw) * 4.5).toFixed(0); // ~4.5 baht per kWh

    const headlineCards = [
        { icon: Zap, label: 'พลังงานที่ประหยัดได้', value: `${totalSavingsKw} kW`, sub: `(-${savingsPercent}%)`, subColor: '#059669', desc: `จากเสาไฟ ${controllers.length} ต้น ในระบบ`, gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)' },
        { icon: Leaf, label: 'ลดปริมาณคาร์บอน', value: carbonOffset, sub: 'ตัน', subColor: '#0f172a', desc: `CO₂ ลดลงเทียบเท่าป่าไม้ ${Math.round(parseFloat(carbonOffset) * 42)} ต้น`, gradient: 'linear-gradient(135deg, #059669, #047857)' },
        { icon: DollarSign, label: 'ประหยัดค่าไฟ', value: `฿${parseInt(costSavings).toLocaleString()}`, sub: 'เดือนนี้', subColor: '#059669', desc: 'ประหยัดค่าไฟฟ้ารวมในเดือนนี้', gradient: 'linear-gradient(135deg, #d97706, #b45309)' },
    ];

    // Generate per-month bar chart data based on current power usage
    const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.'];
    const basePower = totalPower > 0 ? totalPower : 30;
    const yearlySavings = monthNames.map((m, i) => ({
        month: m,
        before: Math.round(basePower * (1.3 + Math.sin(i * 0.5) * 0.1)),
        after: Math.round(basePower * (0.85 + Math.cos(i * 0.3) * 0.08)),
    }));

    // Zone distribution from real data
    const topZones = zones.slice(0, 4).map((z, i) => {
        const zoneControllers = controllers.filter(c => c.zoneId === z.id);
        const zonePower = zoneControllers.filter(c => c.isOn).reduce((s, c) => s + parseFloat(c.power), 0);
        return {
            name: z.name.length > 20 ? z.name.substring(0, 18) + '...' : z.name,
            value: Math.round((zonePower / Math.max(totalPower, 1)) * 100),
            color: ['#2563eb', '#10b981', '#f59e0b', '#94a3b8'][i],
        };
    });
    // Normalize to 100%
    const topSum = topZones.reduce((s, z) => s + z.value, 0);
    if (topSum > 0 && topSum !== 100) {
        topZones[topZones.length - 1].value += 100 - topSum;
    }
    const zoneDistribution = topZones;

    return (
        <MainLayout title="รายงานการใช้พลังงาน (Energy Analytics)">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
                {/* Headline Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {headlineCards.map((card) => (
                        <div key={card.label} style={{
                            background: '#fff', padding: '28px', borderRadius: '20px',
                            border: '1px solid #f1f5f9', position: 'relative', overflow: 'hidden',
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        }}>
                            <div style={{
                                width: '48px', height: '48px', borderRadius: '14px',
                                background: card.gradient, color: '#fff',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginBottom: '18px',
                            }}>
                                <card.icon size={22} />
                            </div>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.08em', margin: '0 0 6px' }}>
                                {card.label}
                            </p>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
                                <span style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.03em' }}>{card.value}</span>
                                <span style={{ fontSize: '14px', fontWeight: 600, color: card.subColor }}>{card.sub}</span>
                            </div>
                            <p style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', margin: 0 }}>{card.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Charts Row */}
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    {/* Bar Chart */}
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                            <div>
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>เปรียบเทียบการใช้พลังงาน</h3>
                                <p style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', margin: '4px 0 0' }}>
                                    ก่อนและหลังใช้ระบบอัจฉริยะ (จำนวน {controllers.length} โคมไฟ)
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#e2e8f0' }} />
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const }}>ระบบเก่า</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#2563eb' }} />
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const }}>ระบบใหม่</span>
                                </div>
                            </div>
                        </div>
                        {mounted && (
                            <div style={{ height: '360px', width: '100%' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={yearlySavings} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 500 }} />
                                        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(241,245,249,0.5)' }} />
                                        <Bar dataKey="before" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={20} />
                                        <Bar dataKey="after" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Pie Chart */}
                    <div style={{ background: '#fff', borderRadius: '20px', padding: '28px', border: '1px solid #f1f5f9' }}>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 24px' }}>การใช้พลังงานตามโซน</h3>
                        {mounted && (
                            <div style={{ height: '240px', width: '100%', position: 'relative' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={zoneDistribution} cx="50%" cy="50%" innerRadius={70} outerRadius={95} paddingAngle={6} dataKey="value">
                                            {zoneDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                                <div style={{
                                    position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                                    alignItems: 'center', justifyContent: 'center', pointerEvents: 'none',
                                }}>
                                    <span style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>{zones.length}</span>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.06em', textAlign: 'center' }}>
                                        โซน<br />ทั้งหมด
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Zone Legend */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '24px' }}>
                            {zoneDistribution.map((zone) => (
                                <div
                                    key={zone.name}
                                    style={{
                                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                        padding: '8px 10px', borderRadius: '10px', cursor: 'pointer',
                                        transition: 'background 0.15s',
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f8fafc'; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: zone.color }} />
                                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>{zone.name}</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{zone.value}%</span>
                                        <ChevronRight size={14} style={{ color: '#cbd5e1' }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Export CTA */}
                <div style={{
                    background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
                    borderRadius: '20px', padding: '36px 40px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{
                        position: 'absolute', top: '-30px', right: '-30px',
                        width: '200px', height: '200px', borderRadius: '50%',
                        background: 'rgba(37, 99, 235, 0.15)', filter: 'blur(60px)',
                    }} />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>ดาวน์โหลดรายงานแบบทางการ</h3>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8', margin: 0 }}>
                            ดาวน์โหลดรายงานวิเคราะห์พลังงานสำหรับ {controllers.length} เสาไฟ, {zones.length} โซน
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px 24px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'background 0.2s',
                            fontFamily: 'inherit',
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                        >
                            <FileText size={16} /> ส่งออกรายงานเป็น PDF
                        </button>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px 24px', borderRadius: '14px', border: 'none',
                            background: '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer', boxShadow: '0 8px 24px rgba(37,99,235,0.4)', transition: 'background 0.2s',
                            fontFamily: 'inherit',
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#1d4ed8'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#2563eb'; }}
                        >
                            <TableIcon size={16} /> ดาวน์โหลด Excel (.xlsx)
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
