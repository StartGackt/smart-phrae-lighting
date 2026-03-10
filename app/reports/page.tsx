"use client";

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell,
} from 'recharts';
import { FileText, Table as TableIcon, Zap, Leaf, DollarSign, ChevronRight } from 'lucide-react';

const yearlySavings = [
    { month: 'Jan', before: 4500, after: 3200 },
    { month: 'Feb', before: 4400, after: 3100 },
    { month: 'Mar', before: 4600, after: 3000 },
    { month: 'Apr', before: 4800, after: 3300 },
    { month: 'May', before: 4700, after: 3200 },
    { month: 'Jun', before: 4500, after: 3100 },
];

const zoneDistribution = [
    { name: 'Phrae City', value: 45, color: '#2563eb' },
    { name: 'Mueang Mo', value: 25, color: '#10b981' },
    { name: 'Nai Wiang', value: 20, color: '#f59e0b' },
    { name: 'Others', value: 10, color: '#94a3b8' },
];

const headlineCards = [
    { icon: Zap, label: 'Total Savings', value: '452 kW', sub: '(-24.5%)', subColor: '#059669', desc: 'Cumulative savings since installation', gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)' },
    { icon: Leaf, label: 'Carbon Offset', value: '12.4', sub: 'Tons', subColor: '#0f172a', desc: 'CO₂ reduction equivalent to 520 trees', gradient: 'linear-gradient(135deg, #059669, #047857)' },
    { icon: DollarSign, label: 'Cost Savings', value: '฿18,240', sub: 'MTD', subColor: '#059669', desc: 'Maintenance & energy cost reduction', gradient: 'linear-gradient(135deg, #d97706, #b45309)' },
];

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
                        {p.name === 'before' ? 'Legacy' : 'Smart'}: {p.value.toLocaleString()} kWh
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

    return (
        <MainLayout title="Energy Analytics & Savings">
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
                                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>Consumption Comparison</h3>
                                <p style={{ fontSize: '13px', fontWeight: 500, color: '#94a3b8', margin: '4px 0 0' }}>Before vs. After Smart System Installation</p>
                            </div>
                            <div style={{ display: 'flex', gap: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#e2e8f0' }} />
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const }}>Legacy</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: '#2563eb' }} />
                                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', textTransform: 'uppercase' as const }}>Smart</span>
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
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 24px' }}>Saving by Zone</h3>
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
                                    <span style={{ fontSize: '32px', fontWeight: 800, color: '#0f172a' }}>24%</span>
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' as const, letterSpacing: '0.06em', textAlign: 'center' }}>
                                        Avg.<br />Efficiency
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
                        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', margin: '0 0 6px' }}>Ready to generate official reports?</h3>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#94a3b8', margin: 0 }}>Download comprehensive analytical audits for administrative review.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', position: 'relative', zIndex: 1 }}>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px 24px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer', backdropFilter: 'blur(8px)', transition: 'background 0.2s',
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
                        >
                            <FileText size={16} /> Export to PDF
                        </button>
                        <button style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '12px 24px', borderRadius: '14px', border: 'none',
                            background: '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer', boxShadow: '0 8px 24px rgba(37,99,235,0.4)', transition: 'background 0.2s',
                        }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = '#1d4ed8'; }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = '#2563eb'; }}
                        >
                            <TableIcon size={16} /> Download Excel (.xlsx)
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
