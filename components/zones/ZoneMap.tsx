"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap } from 'react-leaflet';
import type { SmartController, MasterGateway } from '@/contexts/DeviceContext';
import 'leaflet/dist/leaflet.css';

interface Zone {
    id: number;
    name: string;
    poles: number;
    lat: number;
    lng: number;
}

interface ZoneMapProps {
    controllers: SmartController[];
    gateways: MasterGateway[];
    zones: Zone[];
    selectedZone: number | null;
    onSelectZone: (id: number | null) => void;
    onSelectPole: (id: string) => void;
    onToggleController: (id: string) => void;
    onToggleGateway: (id: string) => void;
}

function FlyToZone({ zones, selectedZone }: { zones: Zone[]; selectedZone: number | null }) {
    const map = useMap();
    useEffect(() => {
        if (selectedZone) {
            const zone = zones.find(z => z.id === selectedZone);
            if (zone) map.flyTo([zone.lat, zone.lng], 17, { duration: 0.8 });
        } else {
            map.flyTo([18.1430, 100.1420], 15, { duration: 0.8 });
        }
    }, [selectedZone, zones, map]);
    return null;
}

const ZoneMap = ({
    controllers, gateways, zones, selectedZone,
    onSelectZone, onSelectPole, onToggleController, onToggleGateway,
}: ZoneMapProps) => {
    return (
        <MapContainer
            center={[18.1430, 100.1420]}
            zoom={15}
            style={{ width: '100%', height: '100%', borderRadius: '20px' }}
            zoomControl={true}
            attributionControl={false}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap'
            />
            <FlyToZone zones={zones} selectedZone={selectedZone} />

            {/* Controller markers — color reflects ON/OFF state */}
            {controllers.map(c => {
                const color = c.status === 'fault' ? '#ef4444'
                    : !c.isOn ? '#94a3b8'
                        : c.status === 'warning' ? '#f59e0b'
                            : '#22c55e';

                return (
                    <CircleMarker
                        key={c.id}
                        center={[c.lat, c.lng]}
                        radius={5}
                        pathOptions={{
                            color: '#fff', weight: 1.5,
                            fillColor: color, fillOpacity: c.isOn ? 0.9 : 0.4,
                        }}
                        eventHandlers={{ click: () => onSelectPole(c.id) }}
                    >
                        <Popup>
                            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '200px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>{c.id}</span>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                                        background: c.isOn ? '#dcfce7' : '#fee2e2',
                                        color: c.isOn ? '#15803d' : '#b91c1c',
                                    }}>{c.isOn ? 'ON' : 'OFF'}</span>
                                </div>
                                <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px' }}>{c.zone}</p>
                                <div style={{ display: 'flex', gap: '10px', fontSize: '11px', margin: '4px 0' }}>
                                    <span style={{ color: '#2563eb' }}>⚡{c.voltage}V</span>
                                    <span style={{ color: '#f59e0b' }}>🌡️{c.temperature}°C</span>
                                    <span style={{ color: '#059669' }}>💡{c.power}kW</span>
                                </div>
                                <div style={{ display: 'flex', gap: '6px', fontSize: '10px', color: '#94a3b8', marginBottom: '8px' }}>
                                    <span>LoRa {c.loraMode}</span>
                                    <span>• FW {c.firmware}</span>
                                </div>
                                {c.status !== 'fault' && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onToggleController(c.id); }}
                                        style={{
                                            padding: '6px 14px', borderRadius: '8px', border: 'none',
                                            background: c.isOn ? '#fef2f2' : '#ecfdf5',
                                            color: c.isOn ? '#dc2626' : '#059669',
                                            fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', width: '100%',
                                        }}
                                    >{c.isOn ? '🔴 ปิด' : '🟢 เปิด'}</button>
                                )}
                            </div>
                        </Popup>
                    </CircleMarker>
                );
            })}

            {/* Gateway markers */}
            {gateways.map(g => (
                <React.Fragment key={g.id}>
                    {g.isOn && (
                        <Circle
                            center={[g.lat, g.lng]}
                            radius={200}
                            pathOptions={{
                                color: '#2563eb', fillColor: '#2563eb',
                                fillOpacity: 0.04, weight: 1, dashArray: '6 4',
                            }}
                        />
                    )}
                    <CircleMarker
                        center={[g.lat, g.lng]}
                        radius={8}
                        pathOptions={{
                            color: '#fff', weight: 3,
                            fillColor: !g.isOn ? '#94a3b8' : g.status === 'warning' ? '#f59e0b' : '#2563eb',
                            fillOpacity: g.isOn ? 1 : 0.4,
                        }}
                    >
                        <Popup>
                            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '180px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{g.name}</span>
                                    <span style={{
                                        fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                                        background: g.isOn ? '#dbeafe' : '#fee2e2',
                                        color: g.isOn ? '#1d4ed8' : '#b91c1c',
                                    }}>{g.isOn ? 'ON' : 'OFF'}</span>
                                </div>
                                <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px' }}>{g.id} • {g.location}</p>
                                <div style={{ display: 'flex', gap: '8px', fontSize: '11px', margin: '6px 0' }}>
                                    <span style={{ color: '#2563eb' }}>📡 {g.cellularType}</span>
                                    <span style={{ color: '#059669' }}>Signal {g.signal}%</span>
                                    <span style={{ color: '#64748b' }}>Nodes {g.connectedNodes}</span>
                                </div>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onToggleGateway(g.id); }}
                                    style={{
                                        padding: '6px 14px', borderRadius: '8px', border: 'none',
                                        background: g.isOn ? '#fef2f2' : '#ecfdf5',
                                        color: g.isOn ? '#dc2626' : '#059669',
                                        fontSize: '11px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', width: '100%',
                                        marginTop: '4px', marginBottom: '12px',
                                    }}
                                >{g.isOn ? '🔴 ปิด Gateway' : '🟢 เปิด Gateway'}</button>

                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#334155', marginBottom: '6px', margin: 0 }}>
                                        ลูกข่ายที่เชื่อมต่อ ({controllers.filter(c => g.zoneIds.includes(c.zoneId)).length} ชุด)
                                    </p>
                                    <div style={{
                                        maxHeight: '130px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px',
                                        paddingRight: '4px'
                                    }}>
                                        {controllers.filter(c => g.zoneIds.includes(c.zoneId)).map(ctrl => (
                                            <div key={ctrl.id} style={{
                                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                                background: ctrl.isOn ? '#f8fafc' : '#f1f5f9', borderRadius: '6px', padding: '6px',
                                                border: ctrl.status === 'fault' ? '1px solid #fecaca' : '1px solid transparent'
                                            }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                    <div style={{
                                                        width: '6px', height: '6px', borderRadius: '50%',
                                                        background: ctrl.status === 'fault' ? '#ef4444' : ctrl.isOn ? '#22c55e' : '#cbd5e1'
                                                    }} />
                                                    <div>
                                                        <span style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', display: 'block' }}>{ctrl.id}</span>
                                                        <span style={{ fontSize: '9px', color: '#64748b' }}>{ctrl.voltage}V • {ctrl.power}kW</span>
                                                    </div>
                                                </div>
                                                <label style={{ position: 'relative', cursor: ctrl.status === 'fault' ? 'not-allowed' : 'pointer' }} onClick={e => e.stopPropagation()}>
                                                    <input type="checkbox" checked={ctrl.isOn}
                                                        onChange={() => onToggleController(ctrl.id)}
                                                        style={{ position: 'absolute', opacity: 0, width: 0, height: 0 }}
                                                    />
                                                    <div style={{
                                                        width: '24px', height: '14px', borderRadius: '7px',
                                                        background: ctrl.isOn ? '#2563eb' : '#cbd5e1',
                                                        transition: 'background 0.2s', position: 'relative',
                                                    }}>
                                                        <div style={{
                                                            width: '10px', height: '10px', borderRadius: '50%', background: '#fff',
                                                            position: 'absolute', top: '2px', left: ctrl.isOn ? '12px' : '2px',
                                                            transition: 'left 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                                                        }} />
                                                    </div>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Popup>
                    </CircleMarker>
                </React.Fragment>
            ))}
        </MapContainer>
    );
};

export default ZoneMap;
