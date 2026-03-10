"use client";

import React from 'react';
import { Bell, Search, Calendar, Clock, Download } from 'lucide-react';

const Topbar = ({ title, showAction = true }: { title: string; showAction?: boolean }) => {
    const [currentTime, setCurrentTime] = React.useState<Date | null>(null);

    React.useEffect(() => {
        setCurrentTime(new Date());
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <header
            style={{
                height: '72px',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid #f1f5f9',
                position: 'fixed',
                top: 0,
                right: 0,
                left: '280px',
                zIndex: 40,
                padding: '0 32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2px' }}>
                    <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>{title}</h2>
                    <span style={{
                        fontSize: '10px', fontWeight: 700, color: '#16a34a', background: '#f0fdf4',
                        padding: '2px 10px', borderRadius: '20px', textTransform: 'uppercase' as const,
                        letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                        <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#22c55e' }} />
                        Live
                    </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', fontWeight: 500, color: '#94a3b8', minHeight: '16px' }}>
                    {currentTime && (
                        <>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Calendar size={12} /> {currentTime.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </span>
                            <span style={{ width: '1px', height: '12px', background: '#e2e8f0' }} />
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <Clock size={12} /> {currentTime.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                        </>
                    )}
                    <span style={{ width: '1px', height: '12px', background: '#e2e8f0' }} />
                    <span>Temp: <strong style={{ color: '#334155' }}>28°C Phrae, TH</strong></span>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {/* Search */}
                <div style={{ position: 'relative' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    <input
                        type="text"
                        placeholder="Search zones or devices..."
                        style={{
                            width: '240px', padding: '9px 14px 9px 36px',
                            borderRadius: '12px', border: '1px solid #f1f5f9',
                            background: '#f8fafc', fontSize: '13px', fontWeight: 500,
                            color: '#334155', outline: 'none',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit',
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = '#dbeafe'; e.currentTarget.style.background = '#fff'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = '#f1f5f9'; e.currentTarget.style.background = '#f8fafc'; }}
                    />
                </div>

                {/* Bell */}
                <button style={{
                    width: '40px', height: '40px', borderRadius: '12px',
                    border: '1px solid #f1f5f9', background: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#64748b', cursor: 'pointer', position: 'relative',
                }}>
                    <Bell size={18} />
                    <span style={{
                        position: 'absolute', top: '8px', right: '8px',
                        width: '7px', height: '7px', borderRadius: '50%',
                        background: '#ef4444', border: '2px solid #fff',
                    }} />
                </button>

                {showAction && (
                    <button
                        style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            padding: '9px 20px', borderRadius: '12px', border: 'none',
                            background: '#2563eb', color: '#fff', fontSize: '13px', fontWeight: 600,
                            cursor: 'pointer', boxShadow: '0 4px 12px rgba(37,99,235,0.25)',
                            transition: 'all 0.2s', fontFamily: 'inherit',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#1d4ed8'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = '#2563eb'; }}
                    >
                        <Download size={16} /> Export Report
                    </button>
                )}
            </div>
        </header>
    );
};

export default Topbar;
