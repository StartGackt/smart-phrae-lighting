"use client";

import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MainLayout = ({
    children,
    title = "Dashboard Overview",
    showAction = true
}: {
    children: React.ReactNode;
    title?: string;
    showAction?: boolean;
}) => {
    return (
        <div
            style={{
                minHeight: '100vh',
                background: '#F8FAFC',
                display: 'flex',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                color: '#0f172a',
            }}
        >
            <Sidebar />
            <div style={{ flex: 1, marginLeft: '280px', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <Topbar title={title} showAction={showAction} />
                <main style={{ paddingTop: '100px', paddingLeft: '32px', paddingRight: '32px', paddingBottom: '48px', flex: 1 }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
