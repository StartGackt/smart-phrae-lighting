"use client";

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap } from 'react-leaflet';
import type { Pole, Zone, Gateway } from '@/app/zones/page';
import 'leaflet/dist/leaflet.css';

interface ZoneMapProps {
    zones: Zone[];
    poles: Pole[];
    gateways: Gateway[];
    selectedZone: number | null;
    onSelectZone: (id: number | null) => void;
    onSelectPole: (pole: Pole) => void;
}

// Component to fly to selected zone
function FlyToZone({ zones, selectedZone }: { zones: Zone[]; selectedZone: number | null }) {
    const map = useMap();

    useEffect(() => {
        if (selectedZone) {
            const zone = zones.find(z => z.id === selectedZone);
            if (zone) {
                map.flyTo([zone.lat, zone.lng], 17, { duration: 0.8 });
            }
        } else {
            // Reset to overview
            map.flyTo([18.1430, 100.1420], 15, { duration: 0.8 });
        }
    }, [selectedZone, zones, map]);

    return null;
}

const statusColors = {
    online: '#22c55e',
    warning: '#f59e0b',
    fault: '#ef4444',
};

const ZoneMap = ({ zones, poles, gateways, selectedZone, onSelectZone, onSelectPole }: ZoneMapProps) => {
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

            {/* Zone circles */}
            {zones.map(z => (
                <Circle
                    key={`zone-${z.id}`}
                    center={[z.lat, z.lng]}
                    radius={selectedZone === z.id ? 120 : 80}
                    pathOptions={{
                        color: z.color,
                        fillColor: z.color,
                        fillOpacity: selectedZone === z.id ? 0.25 : 0.08,
                        weight: selectedZone === z.id ? 2 : 1,
                    }}
                    eventHandlers={{
                        click: () => onSelectZone(selectedZone === z.id ? null : z.id),
                    }}
                >
                    <Popup>
                        <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '160px' }}>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{z.name}</p>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 2px' }}>Zone {z.id} — {z.poles} เสาไฟ</p>
                            <div style={{
                                width: '10px', height: '10px', borderRadius: '3px',
                                background: z.color, display: 'inline-block', marginRight: '6px', verticalAlign: 'middle',
                            }} />
                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>คลิกเพื่อ Zoom</span>
                        </div>
                    </Popup>
                </Circle>
            ))}

            {/* Pole markers */}
            {poles.map(p => (
                <CircleMarker
                    key={p.id}
                    center={[p.lat, p.lng]}
                    radius={6}
                    pathOptions={{
                        color: '#fff',
                        weight: 2,
                        fillColor: statusColors[p.status],
                        fillOpacity: 0.9,
                    }}
                    eventHandlers={{
                        click: () => onSelectPole(p),
                    }}
                >
                    <Popup>
                        <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '180px' }}>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px' }}>{p.id}</p>
                            <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 6px' }}>{p.zone}</p>
                            <div style={{ display: 'flex', gap: '12px', fontSize: '11px' }}>
                                <span style={{ color: '#2563eb' }}>⚡ {p.voltage}V</span>
                                <span style={{ color: '#f59e0b' }}>🌡️ {p.temperature}°C</span>
                                <span style={{ color: '#059669' }}>💡 {p.power}kW</span>
                            </div>
                            <span style={{
                                display: 'inline-block', marginTop: '6px',
                                fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                                textTransform: 'uppercase' as const,
                                background: p.status === 'online' ? '#dcfce7' : p.status === 'warning' ? '#fef3c7' : '#fee2e2',
                                color: p.status === 'online' ? '#15803d' : p.status === 'warning' ? '#b45309' : '#b91c1c',
                            }}>{p.status}</span>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}

            {/* Gateway markers */}
            {gateways.map(g => (
                <React.Fragment key={g.id}>
                    <Circle
                        center={[g.lat, g.lng]}
                        radius={200}
                        pathOptions={{
                            color: g.status === 'online' ? '#2563eb' : '#f59e0b',
                            fillColor: g.status === 'online' ? '#2563eb' : '#f59e0b',
                            fillOpacity: 0.06,
                            weight: 1,
                            dashArray: '6 4',
                        }}
                    />
                    <CircleMarker
                        center={[g.lat, g.lng]}
                        radius={8}
                        pathOptions={{
                            color: '#fff',
                            weight: 3,
                            fillColor: g.status === 'online' ? '#2563eb' : '#f59e0b',
                            fillOpacity: 1,
                        }}
                    >
                        <Popup>
                            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '150px' }}>
                                <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: '0 0 2px' }}>{g.name}</p>
                                <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px' }}>{g.id}</p>
                                <span style={{
                                    fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '6px',
                                    textTransform: 'uppercase' as const,
                                    background: g.status === 'online' ? '#dbeafe' : '#fef3c7',
                                    color: g.status === 'online' ? '#1d4ed8' : '#b45309',
                                }}>{g.status}</span>
                            </div>
                        </Popup>
                    </CircleMarker>
                </React.Fragment>
            ))}
        </MapContainer>
    );
};

export default ZoneMap;
