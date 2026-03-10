"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Lightbulb,
  Map as MapIcon,
  BarChart3,
  Bell,
  Settings,
  ChevronRight,
  LogOut,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'หน้าหลัก', href: '/' },
  { icon: Lightbulb, label: 'ควบคุมโคมไฟ', href: '/devices' },
  { icon: MapIcon, label: 'จัดการแผนที่/โซน', href: '/zones' },
  { icon: BarChart3, label: 'รายงานการใช้ไฟ', href: '/reports' },
  { icon: Bell, label: 'การแจ้งเตือน', href: '/alerts' },
  { icon: Settings, label: 'ตั้งค่าระบบ', href: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: '280px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        background: '#ffffff',
        borderRight: '1px solid #f1f5f9',
        fontFamily: "var(--font-sarabun), 'Sarabun', sans-serif",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '28px 28px 24px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div
          style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 8px 24px rgba(37, 99, 235, 0.3)',
            flexShrink: 0,
          }}
        >
          <Lightbulb size={22} strokeWidth={2.5} />
        </div>
        <div>
          <h1
            style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
          >
            สมาร์ทแพร่
          </h1>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 600,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginTop: '3px',
            }}
          >
            ระบบจัดการแสงสว่าง
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '0 16px', marginTop: '8px' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: '14px',
                    textDecoration: 'none',
                    transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
                    background: isActive
                      ? 'linear-gradient(135deg, #2563eb, #1d4ed8)'
                      : 'transparent',
                    color: isActive ? '#ffffff' : '#64748b',
                    boxShadow: isActive
                      ? '0 8px 24px rgba(37, 99, 235, 0.25)'
                      : 'none',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.background = '#f8fafc';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#1e293b';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLAnchorElement).style.background = 'transparent';
                      (e.currentTarget as HTMLAnchorElement).style.color = '#64748b';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <item.icon
                      size={20}
                      strokeWidth={isActive ? 2.2 : 1.8}
                      style={{
                        color: isActive ? '#ffffff' : '#94a3b8',
                        transition: 'color 0.25s ease',
                      }}
                    />
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: isActive ? 700 : 500,
                        letterSpacing: isActive ? '0.01em' : '0',
                      }}
                    >
                      {item.label}
                    </span>
                  </div>
                  {isActive && (
                    <ChevronRight
                      size={16}
                      style={{ opacity: 0.7 }}
                    />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom User Area */}
      <div style={{ padding: '16px', marginTop: 'auto' }}>
        {/* User Profile */}
        <div
          style={{
            background: '#f8fafc',
            borderRadius: '16px',
            padding: '16px',
            marginBottom: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#2563eb',
                fontSize: '14px',
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              AU
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
                ผู้ดูแลระบบ
              </p>
              <p style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8', margin: 0, marginTop: '2px' }}>
                เทศบาลเมืองแพร่
              </p>
            </div>
          </div>
          <button
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '8px 0',
              border: 'none',
              background: 'none',
              color: '#94a3b8',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              borderRadius: '8px',
              transition: 'all 0.2s ease',
              fontFamily: 'inherit',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#ef4444';
              (e.currentTarget as HTMLButtonElement).style.background = '#fef2f2';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color = '#94a3b8';
              (e.currentTarget as HTMLButtonElement).style.background = 'none';
            }}
          >
            <LogOut size={14} />
            ออกจากระบบ
          </button>
        </div>

        {/* System Status */}
        <div
          style={{
            padding: '12px 14px',
            background: '#eff6ff',
            borderRadius: '12px',
            border: '1px solid #dbeafe',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#2563eb',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                margin: 0,
              }}
            >
              สถานะระบบ
            </p>
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#22c55e',
                boxShadow: '0 0 8px rgba(34, 197, 94, 0.5)',
                animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
              }}
            />
          </div>
          <p
            style={{
              fontSize: '11px',
              fontWeight: 500,
              color: '#64748b',
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            กำลังเชื่อมต่อการทำงานโคมไฟ 860 ต้น อย่างสมบูรณ์
          </p>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
