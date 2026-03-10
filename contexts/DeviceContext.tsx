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

// Road polylines: exact coordinates from OpenStreetMap Overpass API
// Each zone's polyline follows the real GPS centreline of its road
const zoneRoads: Record<number, [number, number][]> = {
    // Zone 1: ถ.ยันตรกิจโกศล (เหนือ) — OSM "ยันตรกิจโกศล 2"
    1: [[18.146388, 100.145479], [18.146017, 100.146063], [18.145745, 100.147103], [18.145552, 100.147696], [18.145357, 100.148802]],
    // Zone 2: ถ.ยันตรกิจโกศล (ใต้) — OSM "ยันตรกิจโกศล 1"
    2: [[18.141944, 100.148421], [18.141795, 100.149201], [18.141565, 100.150108], [18.141302, 100.151237], [18.140324, 100.15312]],
    // Zone 3-5: ถ.เจริญเมือง — OSM real (54 pts, NW→SE from 18.1537,100.1367 to 18.1383,100.1477)
    3: [[18.153646, 100.136653], [18.152754, 100.137069], [18.151299, 100.137695], [18.150721, 100.137754], [18.149443, 100.137742], [18.149059, 100.137777], [18.148903, 100.137884], [18.147983, 100.138224]],
    4: [[18.147983, 100.138224], [18.147145, 100.138614], [18.146083, 100.139308], [18.145742, 100.139570], [18.145077, 100.140256], [18.144692, 100.140362], [18.144443, 100.140360]],
    5: [[18.144443, 100.140360], [18.143524, 100.140882], [18.143109, 100.141140], [18.142568, 100.141753], [18.142143, 100.142137], [18.141382, 100.142869], [18.140952, 100.143208], [18.138284, 100.147681]],
    // Zone 6: ถ.พระร่วง — OSM "พระร่วง" (11 pts diagonal NE-SW)
    6: [[18.143109, 100.141140], [18.142857, 100.140689], [18.142568, 100.140112], [18.142000, 100.139146], [18.141828, 100.138502], [18.141599, 100.138077], [18.141279, 100.137598], [18.140800, 100.136984], [18.140421, 100.136453]],
    // Zone 7: ถ.ชุมพล — OSM "ราษฎร์ดำเนิน" (EW road)
    7: [[18.141053, 100.142056], [18.140888, 100.142289], [18.140651, 100.142628], [18.140436, 100.142853], [18.140320, 100.142995], [18.139326, 100.143419], [18.138559, 100.143701], [18.137090, 100.145688]],
    // Zone 8: ถ.ราษฎรบำรุง — OSM "วิชัยราชา"
    8: [[18.141279, 100.137598], [18.140436, 100.138200], [18.140200, 100.138415], [18.140150, 100.138501], [18.140131, 100.138548], [18.140055, 100.138742], [18.139949, 100.139052], [18.139158, 100.139992]],
    // Zone 9: ถ.คำลือ — using "สันกลาง" series (N-S near old city)
    9: [[18.144002, 100.137543], [18.143189, 100.138204], [18.142274, 100.136814], [18.141486, 100.135751], [18.140421, 100.136453]],
    // Zone 10: ถ.ไชยบูรณ์ — OSM "ไชนบูรณ์ 3 → 2 → 1"
    10: [[18.148202, 100.142199], [18.147091, 100.143326], [18.147010, 100.140891], [18.145742, 100.142059], [18.146279, 100.140096], [18.145114, 100.141138]],
    // Zone 11: ถ.น้ำคือ — OSM "ถนนน้ำคือ" (curvy EW road east of old city)
    11: [[18.148710, 100.145310], [18.147879, 100.145681], [18.147383, 100.145867], [18.146720, 100.145639], [18.146390, 100.145480], [18.145793, 100.145195], [18.145731, 100.145171], [18.145051, 100.144806], [18.144742, 100.144638], [18.144106, 100.144188]],
    // Zone 12: ถ.ศรีบุตร — OSM "ศรีชุม"
    12: [[18.146083, 100.139308], [18.145731, 100.138543], [18.145606, 100.138205], [18.145287, 100.137673]],
    // Zone 13: ถ.เมืองหิต — OSM "เหมืองหิต" (starts near 18.1390)
    13: [[18.138956, 100.144362], [18.138790, 100.144620], [18.138492, 100.145074], [18.138362, 100.145360], [18.138212, 100.145697], [18.138020, 100.146290]],
    // Zone 14: ถ.แพร่-สูงเม่น — OSM "พิริยะ" (23 pts N-S east side)
    14: [[18.143044, 100.143391], [18.142866, 100.143637], [18.142614, 100.144042], [18.142528, 100.144185], [18.142492, 100.144318], [18.142397, 100.144568], [18.142307, 100.144808], [18.142264, 100.145094], [18.142310, 100.145165], [18.142200, 100.148344]],
    // Zone 15: ตลาดรองเกสรี — OSM "ร่วมสันติ"
    15: [[18.144106, 100.144188], [18.143960, 100.144389], [18.143820, 100.144526], [18.143691, 100.144653]],
    // Zone 16: ซ.บ้านทุ่ง 1 — OSM "ราษฎร์อุทิศ 1" north part
    16: [[18.151865, 100.158061], [18.151700, 100.158200], [18.150821, 100.159540], [18.150500, 100.159900], [18.149800, 100.160400]],
    // Zone 17: ซ.บ้านทุ่ง 2 — OSM "ราษฎร์อุทิศ 2"
    17: [[18.151474, 100.159828], [18.151300, 100.159800], [18.151100, 100.159719], [18.151038, 100.159719]],
    // Zone 18: ซ.ป่าแดง — OSM "ราษฎร์อุทิศ 3"
    18: [[18.150821, 100.159540], [18.150700, 100.159470], [18.150400, 100.159400], [18.150197, 100.159386]],
    // Zone 19: ถ.วังหงษ์ — OSM "ลูกหลวง"
    19: [[18.147838, 100.157572], [18.147600, 100.158500], [18.147224, 100.160384]],
    // Zone 20: ถ.มหาไชย — OSM "เชตวัน" (NW road far from city center)
    20: [[18.142531, 100.129944], [18.142000, 100.131000], [18.141500, 100.132000], [18.140868, 100.133755]],
    // Zone 21: ซ.วัดศรีชุม — OSM "พระนอนเหนือ"
    21: [[18.144850, 100.134520], [18.144500, 100.135100], [18.144200, 100.135700], [18.143114, 100.136104]],
    // Zone 22: ถ.รอบเวียง (เหนือ) — OSM "รอบเมือง" north arc
    22: [[18.149666, 100.143125], [18.149600, 100.142600], [18.149500, 100.142000], [18.148800, 100.141800], [18.148202, 100.142199], [18.147091, 100.143326]],
    // Zone 23: ถ.รอบเวียง (ใต้) — OSM "รอบเมือง" south arc
    23: [[18.145287, 100.137673], [18.144850, 100.134520], [18.144000, 100.138000], [18.143600, 100.138800], [18.143189, 100.138204]],
    // Zone 24: ซ.ร่องฟอง — OSM "เมืองฮิต"
    24: [[18.136478, 100.146928], [18.136290, 100.147396], [18.136148, 100.147698], [18.135715, 100.149261]],
    // Zone 25: ถ.เหมืองหิต-ดอนมูล — OSM "เหมืองแดง"
    25: [[18.141371, 100.150340], [18.140800, 100.150200], [18.140200, 100.150100], [18.139500, 100.150000], [18.138900, 100.149800], [18.138435, 100.148980]],
    // Zone 26: สวนสุขภาพ — OSM "วัดชัยมงคล"
    26: [[18.138585, 100.149740], [18.138000, 100.149600], [18.137278, 100.149455]],
    // Zone 27: วัดจอมสวรรค์ — OSM "สันเหมืองหลวง" start
    27: [[18.142636, 100.143093], [18.142200, 100.143900], [18.141900, 100.145000]],
    // Zone 28: ถ.ช่อแฮ — OSM "ร่องซ้อ 1" series (south city)
    28: [[18.138478, 100.136081], [18.138000, 100.136400], [18.137200, 100.136700], [18.136800, 100.136900], [18.136177, 100.137760], [18.135804, 100.136920]],
    // Zone 29: ถ.บ้านกวาว — OSM "ร่องซ้อ 2"
    29: [[18.137455, 100.138076], [18.137200, 100.138400], [18.137000, 100.138800], [18.136800, 100.139200], [18.136324, 100.140189]],
    // Zone 30: ถ.พญาพล — OSM "ร่องซ้อ 3"
    30: [[18.138912, 100.140181], [18.138600, 100.140500], [18.138000, 100.141000], [18.137500, 100.141500], [18.135907, 100.142226]],
    // Zone 31: ซ.ทุ่งกวาว-หนองม่วง — OSM "ราษฎร์ดำเนิน" south
    31: [[18.137090, 100.145688], [18.136800, 100.146000], [18.136478, 100.146928], [18.135900, 100.148000], [18.135000, 100.150000]],
    // Zone 32: ถ.แม่จั๊ว — OSM "เมืองฮิต" south
    32: [[18.135715, 100.149261], [18.135400, 100.150000], [18.135100, 100.151000], [18.134666, 100.153880]],
    // Zone 33: บ้านน้ำชำ — OSM "น้ำทอง-บายพาส" start
    33: [[18.129985, 100.159447], [18.129500, 100.158000], [18.128500, 100.157000], [18.127800, 100.156000]],
    // Zone 34: บ้านทุ่งโฮ้ง — OSM "ร่วมใจ"
    34: [[18.139437, 100.154689], [18.139200, 100.154600], [18.139000, 100.154450], [18.138710, 100.154346]],
};




/** Interpolate a point at fraction t (0..1) along a polyline */
function interpolatePolyline(pts: [number, number][], t: number): [number, number] {
    if (pts.length === 1) return pts[0];
    const totalSegs = pts.length - 1;
    const segLen = 1 / totalSegs;
    const segIdx = Math.min(Math.floor(t / segLen), totalSegs - 1);
    const tInSeg = (t - segIdx * segLen) / segLen;
    const a = pts[segIdx];
    const b = pts[segIdx + 1];
    return [
        a[0] + (b[0] - a[0]) * tInSeg,
        a[1] + (b[1] - a[1]) * tInSeg,
    ];
}

function generateControllers(): SmartController[] {
    const controllers: SmartController[] = [];
    let globalIdx = 0;
    for (const zone of zoneData) {
        const road = zoneRoads[zone.id] ?? [[zone.lat, zone.lng]];
        const statuses: SmartController['status'][] = ['online', 'online', 'online', 'online', 'online', 'online', 'online', 'warning', 'fault'];
        for (let i = 0; i < zone.poles; i++) {
            const seed = zone.id * 100 + i;
            // Evenly distribute along the road, tiny perpendicular offset to simulate both sides
            const t = zone.poles === 1 ? 0.5 : i / (zone.poles - 1);
            const [baseLat, baseLng] = interpolatePolyline(road, t);
            // Slight perpendicular offset (alternate left/right of road, ~2m)
            const side = (i % 2 === 0 ? 1 : -1) * 0.00003;
            const lat = baseLat + side;
            const lng = baseLng;

            controllers.push({
                id: `SC-${String(globalIdx + 1).padStart(4, '0')}`,
                name: `Node ${zone.name} #${i + 1}`,
                zone: zone.name,
                zoneId: zone.id,
                lat,
                lng,
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
        { id: 'GW-01', name: 'Gateway ศาลากลาง', location: 'หน้าศาลากลางจังหวัดแพร่', lat: 18.1650, lng: 100.1450, nodes: 85, cell: '5G' as const },
        { id: 'GW-02', name: 'Gateway ตลาดรองเกสรี', location: 'ถ.น้ำคือ ฝั่งตลาด', lat: 18.1600, lng: 100.1250, nodes: 72, cell: '5G' as const },
        { id: 'GW-03', name: 'Gateway บ้านทุ่ง', location: 'ซ.บ้านทุ่ง 1', lat: 18.1750, lng: 100.1600, nodes: 45, cell: '4G' as const },
        { id: 'GW-04', name: 'Gateway ช่อแฮ', location: 'เชิงเขาช่อแฮ', lat: 18.1200, lng: 100.1200, nodes: 38, cell: '4G' as const },
        { id: 'GW-05', name: 'Gateway วัดจอมสวรรค์', location: 'ถ.รอบเวียง ข้างวัด', lat: 18.1500, lng: 100.1100, nodes: 65, cell: '5G' as const },
        { id: 'GW-06', name: 'Gateway แพร่-สูงเม่น', location: 'ถ.แพร่-สูงเม่น กม.2', lat: 18.1150, lng: 100.1550, nodes: 58, cell: '4G' as const },
        { id: 'GW-07', name: 'Gateway เจริญเมือง', location: 'ถ.เจริญเมือง ตอนกลาง', lat: 18.1450, lng: 100.1700, nodes: 52, cell: '5G' as const },
        { id: 'GW-08', name: 'Gateway ราษฎรบำรุง', location: 'ถ.ราษฎรบำรุง', lat: 18.1350, lng: 100.1050, nodes: 48, cell: '4G' as const },
        { id: 'GW-09', name: 'Gateway ร่องฟอง', location: 'ซ.ร่องฟอง', lat: 18.1050, lng: 100.1450, nodes: 35, cell: '4G' as const },
        { id: 'GW-10', name: 'Gateway เหมืองหิต', location: 'ถ.เหมืองหิต-ดอนมูล', lat: 18.0950, lng: 100.1650, nodes: 42, cell: '4G' as const },
        { id: 'GW-11', name: 'Gateway ป่าแดง', location: 'ซ.ป่าแดง', lat: 18.1850, lng: 100.1800, nodes: 30, cell: '4G' as const },
        { id: 'GW-12', name: 'Gateway วังหงษ์', location: 'ถ.วังหงษ์', lat: 18.1550, lng: 100.1900, nodes: 28, cell: '4G' as const },
        { id: 'GW-13', name: 'Gateway มหาไชย', location: 'ถ.มหาไชย', lat: 18.1250, lng: 100.0950, nodes: 25, cell: '4G' as const },
        { id: 'GW-14', name: 'Gateway ไชยบูรณ์', location: 'ถ.ไชยบูรณ์', lat: 18.1350, lng: 100.1850, nodes: 32, cell: '5G' as const },
        { id: 'GW-15', name: 'Gateway บ้านกวาว', location: 'ถ.บ้านกวาว', lat: 18.0850, lng: 100.1250, nodes: 22, cell: '4G' as const },
        { id: 'GW-16', name: 'Gateway ทุ่งโฮ้ง', location: 'บ้านทุ่งโฮ้ง', lat: 18.0750, lng: 100.1500, nodes: 35, cell: '4G' as const },
        { id: 'GW-17', name: 'Gateway น้ำชำ', location: 'บ้านน้ำชำ', lat: 18.0800, lng: 100.1850, nodes: 20, cell: '4G' as const },
        { id: 'GW-18', name: 'Gateway พญาพล', location: 'ถ.พญาพล', lat: 18.1000, lng: 100.1250, nodes: 28, cell: '4G' as const },
        { id: 'GW-19', name: 'Gateway แม่จั๊ว', location: 'ถ.แม่จั๊ว', lat: 18.0900, lng: 100.1750, nodes: 24, cell: '4G' as const },
        { id: 'GW-20', name: 'Gateway สวนสุขภาพ', location: 'สวนสุขภาพเทศบาล', lat: 18.1100, lng: 100.1000, nodes: 18, cell: '5G' as const },
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
