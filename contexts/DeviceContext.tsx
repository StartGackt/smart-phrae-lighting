"use client";

import React, { createContext, useContext, useState, useCallback } from 'react';

// ==================== Types ====================

export interface SmartController {
    id: string;
    name: string;
    zone: string;
    zoneId: number;
    lat: number;
    lng: number;
    status: 'online' | 'warning' | 'fault' | 'offline';
    isOn: boolean;
    intensity: number;
    voltage: string;
    temperature: string;
    power: string;
    loraMode: 'P2P' | 'Mesh';
    firmware: string;
}

export interface MasterGateway {
    id: string;
    name: string;
    location: string;
    lat: number;
    lng: number;
    status: 'online' | 'warning' | 'offline';
    isOn: boolean;
    signal: number;
    connectedNodes: number;
    cellularType: '4G' | '5G';
    ip: string;
    firmware: string;
    uptime: string;
    zoneIds: number[];
    coverage: number;
}

// ==================== Data Generation ====================

const zoneData = [
    { id: 1, name: 'ถ.ยันตรกิจโกศล (เหนือ)', poles: 48, lat: 18.1520, lng: 100.1390 },
    { id: 2, name: 'ถ.ยันตรกิจโกศล (ใต้)', poles: 44, lat: 18.1440, lng: 100.1410 },
    { id: 3, name: 'ถ.เจริญเมือง (เหนือ)', poles: 32, lat: 18.1535, lng: 100.1420 },
    { id: 4, name: 'ถ.เจริญเมือง (กลาง)', poles: 34, lat: 18.1480, lng: 100.1430 },
    { id: 5, name: 'ถ.เจริญเมือง (ใต้)', poles: 30, lat: 18.1425, lng: 100.1440 },
    { id: 6, name: 'ถ.พระร่วง', poles: 22, lat: 18.1510, lng: 100.1460 },
    { id: 7, name: 'ถ.ชุมพล', poles: 36, lat: 18.1460, lng: 100.1475 },
    { id: 8, name: 'ถ.ราษฎรบำรุง', poles: 38, lat: 18.1400, lng: 100.1350 },
    { id: 9, name: 'ถ.คำลือ', poles: 25, lat: 18.1405, lng: 100.1400 },
    { id: 10, name: 'ถ.ไชยบูรณ์', poles: 20, lat: 18.1390, lng: 100.1450 },
    { id: 11, name: 'ถ.น้ำคือ', poles: 28, lat: 18.1385, lng: 100.1490 },
    { id: 12, name: 'ถ.ศรีบุตร', poles: 18, lat: 18.1370, lng: 100.1320 },
    { id: 13, name: 'ถ.เมืองหิต', poles: 22, lat: 18.1365, lng: 100.1370 },
    { id: 14, name: 'ถ.แพร่-สูงเม่น', poles: 50, lat: 18.1350, lng: 100.1430 },
    { id: 15, name: 'ตลาดรองเกสรี', poles: 12, lat: 18.1475, lng: 100.1445 },
    { id: 16, name: 'ซ.บ้านทุ่ง 1', poles: 15, lat: 18.1530, lng: 100.1510 },
    { id: 17, name: 'ซ.บ้านทุ่ง 2', poles: 14, lat: 18.1505, lng: 100.1520 },
    { id: 18, name: 'ซ.ป่าแดง', poles: 18, lat: 18.1490, lng: 100.1540 },
    { id: 19, name: 'ถ.วังหงษ์', poles: 20, lat: 18.1440, lng: 100.1550 },
    { id: 20, name: 'ถ.มหาไชย', poles: 16, lat: 18.1340, lng: 100.1310 },
    { id: 21, name: 'ซ.วัดศรีชุม', poles: 14, lat: 18.1335, lng: 100.1360 },
    { id: 22, name: 'ถ.รอบเวียง (เหนือ)', poles: 33, lat: 18.1470, lng: 100.1420 },
    { id: 23, name: 'ถ.รอบเวียง (ใต้)', poles: 28, lat: 18.1445, lng: 100.1425 },
    { id: 24, name: 'ซ.ร่องฟอง', poles: 20, lat: 18.1320, lng: 100.1470 },
    { id: 25, name: 'ถ.เหมืองหิต-ดอนมูล', poles: 36, lat: 18.1310, lng: 100.1510 },
    { id: 26, name: 'สวนสุขภาพ', poles: 10, lat: 18.1325, lng: 100.1330 },
    { id: 27, name: 'วัดจอมสวรรค์', poles: 8, lat: 18.1460, lng: 100.1395 },
    { id: 28, name: 'ถ.ช่อแฮ', poles: 40, lat: 18.1290, lng: 100.1340 },
    { id: 29, name: 'ถ.บ้านกวาว', poles: 22, lat: 18.1285, lng: 100.1390 },
    { id: 30, name: 'ถ.พญาพล', poles: 18, lat: 18.1280, lng: 100.1440 },
    { id: 31, name: 'ซ.ทุ่งกวาว-หนองม่วง', poles: 29, lat: 18.1270, lng: 100.1500 },
    { id: 32, name: 'ถ.แม่จั๊ว', poles: 20, lat: 18.1260, lng: 100.1540 },
    { id: 33, name: 'บ้านน้ำชำ', poles: 16, lat: 18.1240, lng: 100.1530 },
    { id: 34, name: 'บ้านทุ่งโฮ้ง', poles: 24, lat: 18.1250, lng: 100.1460 },
];

function generateControllers(): SmartController[] {
    const controllers: SmartController[] = [];
    let globalIdx = 0;
    for (const zone of zoneData) {
        for (let i = 0; i < zone.poles; i++) {
            const seed = zone.id * 100 + i;
            const latOff = ((seed * 13 % 200) - 100) * 0.00015;
            const lngOff = ((seed * 17 % 200) - 100) * 0.00015;
            const statuses: SmartController['status'][] = ['online', 'online', 'online', 'online', 'online', 'online', 'online', 'warning', 'fault'];
            controllers.push({
                id: `SC-${String(globalIdx + 1).padStart(4, '0')}`,
                name: `Node ${zone.name} #${i + 1}`,
                zone: zone.name,
                zoneId: zone.id,
                lat: zone.lat + latOff,
                lng: zone.lng + lngOff,
                status: statuses[seed % statuses.length],
                isOn: statuses[seed % statuses.length] !== 'fault',
                intensity: statuses[seed % statuses.length] === 'fault' ? 0 : 70 + (seed % 30),
                voltage: (220 + (seed % 10) - 5).toFixed(1),
                temperature: (32 + (seed % 18)).toFixed(1),
                power: (0.04 + (seed % 20) * 0.008).toFixed(3),
                loraMode: seed % 3 === 0 ? 'Mesh' : 'P2P',
                firmware: seed % 5 === 0 ? 'v2.3.5' : 'v2.4.1',
            });
            globalIdx++;
        }
    }
    return controllers;
}

function generateGateways(): MasterGateway[] {
    const gwData = [
        { id: 'GW-01', name: 'Gateway ศาลากลาง', location: 'หน้าศาลากลางจังหวัดแพร่', lat: 18.1480, lng: 100.1400, nodes: 85, cell: '5G' as const },
        { id: 'GW-02', name: 'Gateway ตลาดรองเกสรี', location: 'ถ.น้ำคือ ฝั่งตลาด', lat: 18.1470, lng: 100.1450, nodes: 72, cell: '5G' as const },
        { id: 'GW-03', name: 'Gateway บ้านทุ่ง', location: 'ซ.บ้านทุ่ง 1', lat: 18.1525, lng: 100.1500, nodes: 45, cell: '4G' as const },
        { id: 'GW-04', name: 'Gateway ช่อแฮ', location: 'เชิงเขาช่อแฮ', lat: 18.1300, lng: 100.1340, nodes: 38, cell: '4G' as const },
        { id: 'GW-05', name: 'Gateway วัดจอมสวรรค์', location: 'ถ.รอบเวียง ข้างวัด', lat: 18.1460, lng: 100.1395, nodes: 65, cell: '5G' as const },
        { id: 'GW-06', name: 'Gateway แพร่-สูงเม่น', location: 'ถ.แพร่-สูงเม่น กม.2', lat: 18.1350, lng: 100.1430, nodes: 58, cell: '4G' as const },
        { id: 'GW-07', name: 'Gateway เจริญเมือง', location: 'ถ.เจริญเมือง ตอนกลาง', lat: 18.1480, lng: 100.1430, nodes: 52, cell: '5G' as const },
        { id: 'GW-08', name: 'Gateway ราษฎรบำรุง', location: 'ถ.ราษฎรบำรุง', lat: 18.1400, lng: 100.1350, nodes: 48, cell: '4G' as const },
        { id: 'GW-09', name: 'Gateway ร่องฟอง', location: 'ซ.ร่องฟอง', lat: 18.1320, lng: 100.1470, nodes: 35, cell: '4G' as const },
        { id: 'GW-10', name: 'Gateway เหมืองหิต', location: 'ถ.เหมืองหิต-ดอนมูล', lat: 18.1310, lng: 100.1510, nodes: 42, cell: '4G' as const },
        { id: 'GW-11', name: 'Gateway ป่าแดง', location: 'ซ.ป่าแดง', lat: 18.1490, lng: 100.1540, nodes: 30, cell: '4G' as const },
        { id: 'GW-12', name: 'Gateway วังหงษ์', location: 'ถ.วังหงษ์', lat: 18.1440, lng: 100.1550, nodes: 28, cell: '4G' as const },
        { id: 'GW-13', name: 'Gateway มหาไชย', location: 'ถ.มหาไชย', lat: 18.1340, lng: 100.1310, nodes: 25, cell: '4G' as const },
        { id: 'GW-14', name: 'Gateway ไชยบูรณ์', location: 'ถ.ไชยบูรณ์', lat: 18.1390, lng: 100.1450, nodes: 32, cell: '5G' as const },
        { id: 'GW-15', name: 'Gateway บ้านกวาว', location: 'ถ.บ้านกวาว', lat: 18.1285, lng: 100.1390, nodes: 22, cell: '4G' as const },
        { id: 'GW-16', name: 'Gateway ทุ่งโฮ้ง', location: 'บ้านทุ่งโฮ้ง', lat: 18.1250, lng: 100.1460, nodes: 35, cell: '4G' as const },
        { id: 'GW-17', name: 'Gateway น้ำชำ', location: 'บ้านน้ำชำ', lat: 18.1240, lng: 100.1530, nodes: 20, cell: '4G' as const },
        { id: 'GW-18', name: 'Gateway พญาพล', location: 'ถ.พญาพล', lat: 18.1280, lng: 100.1440, nodes: 28, cell: '4G' as const },
        { id: 'GW-19', name: 'Gateway แม่จั๊ว', location: 'ถ.แม่จั๊ว', lat: 18.1260, lng: 100.1540, nodes: 24, cell: '4G' as const },
        { id: 'GW-20', name: 'Gateway สวนสุขภาพ', location: 'สวนสุขภาพเทศบาล', lat: 18.1325, lng: 100.1330, nodes: 18, cell: '5G' as const },
    ];

    return gwData.map((g, i) => ({
        ...g,
        status: i === 3 ? 'warning' as const : 'online' as const,
        isOn: true,
        signal: i === 3 ? 45 : 80 + (i * 3 % 20),
        connectedNodes: g.nodes,
        cellularType: g.cell,
        ip: `192.168.1.${101 + i}`,
        firmware: i % 4 === 0 ? 'v3.1.0' : 'v3.2.1',
        uptime: i === 3 ? '12d 4h' : `${30 + i * 3}d ${i % 24}h`,
        zoneIds: [i * 2 + 1, Math.min(i * 2 + 2, 34)],
        coverage: g.nodes,
    }));
}

// ==================== Context ====================

interface DeviceContextType {
    controllers: SmartController[];
    gateways: MasterGateway[];
    zones: typeof zoneData;
    toggleController: (id: string) => void;
    toggleGateway: (id: string) => void;
    setControllerIntensity: (id: string, val: number) => void;
    toggleAllControllers: (on: boolean) => void;
    toggleAllGateways: (on: boolean) => void;
    toggleZoneControllers: (zoneId: number, on: boolean) => void;
}

const DeviceContext = createContext<DeviceContextType | null>(null);

export function useDevices() {
    const ctx = useContext(DeviceContext);
    if (!ctx) throw new Error('useDevices must be used within DeviceProvider');
    return ctx;
}

export function DeviceProvider({ children }: { children: React.ReactNode }) {
    const [controllers, setControllers] = useState<SmartController[]>(() => generateControllers());
    const [gateways, setGateways] = useState<MasterGateway[]>(() => generateGateways());

    const toggleController = useCallback((id: string) => {
        setControllers(prev => prev.map(c => c.id === id && c.status !== 'fault'
            ? { ...c, isOn: !c.isOn }
            : c
        ));
    }, []);

    const toggleGateway = useCallback((id: string) => {
        setGateways(prev => prev.map(g => g.id === id
            ? { ...g, isOn: !g.isOn }
            : g
        ));
    }, []);

    const setControllerIntensity = useCallback((id: string, val: number) => {
        setControllers(prev => prev.map(c => c.id === id ? { ...c, intensity: val } : c));
    }, []);

    const toggleAllControllers = useCallback((on: boolean) => {
        setControllers(prev => prev.map(c => c.status !== 'fault' ? { ...c, isOn: on } : c));
    }, []);

    const toggleAllGateways = useCallback((on: boolean) => {
        setGateways(prev => prev.map(g => ({ ...g, isOn: on })));
    }, []);

    const toggleZoneControllers = useCallback((zoneId: number, on: boolean) => {
        setControllers(prev => prev.map(c => c.zoneId === zoneId && c.status !== 'fault' ? { ...c, isOn: on } : c));
    }, []);

    return (
        <DeviceContext.Provider value={{
            controllers, gateways, zones: zoneData,
            toggleController, toggleGateway, setControllerIntensity,
            toggleAllControllers, toggleAllGateways, toggleZoneControllers,
        }}>
            {children}
        </DeviceContext.Provider>
    );
}
