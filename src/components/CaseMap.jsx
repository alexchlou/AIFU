import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';
import { scaleQuantile } from 'd3-scale';

const geoUrl = "https://cdn.jsdelivr.net/npm/us-atlas@3/states-10m.json";

const courtCoordinates = {
    "ND California": [-122.4194, 37.7749],
    "CD California": [-118.2437, 34.0522],
    "SDNY": [-74.0060, 40.7128],
    "D. Mass.": [-71.0589, 42.3601],
    "D. Col.": [-104.9903, 39.7392],
    "ND Illinois": [-87.6298, 41.8781],
    "Delaware": [-75.5277, 39.1582],
    "Appeal 9th Cir.": [-122.4194, 37.7749], // Same as ND Cal for viz
    "Appeal 2d Cir.": [-74.0060, 40.7128], // Same as SDNY for viz
    "Appeal 3d Cir.": [-75.1652, 39.9526], // Philadelphia
};

export const stateMapping = {
    "ND California": "California",
    "CD California": "California",
    "SDNY": "New York",
    "D. Mass.": "Massachusetts",
    "D. Col.": "Colorado",
    "ND Illinois": "Illinois",
    "Delaware": "Delaware",
    "Appeal 9th Cir.": "California",
    "Appeal 2d Cir.": "New York",
    "Appeal 3d Cir.": "Pennsylvania",
};

const CaseMap = ({ cases, selectedId, onSelect }) => {
    // Group cases by court to size markers
    const casesByCourt = cases.reduce((acc, c) => {
        const court = c.court;
        if (!acc[court]) acc[court] = [];
        acc[court].push(c);
        return acc;
    }, {});

    return (
        <div className="w-full h-full flex items-center justify-center">
            <ComposableMap projection="geoAlbersUsa">
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => (
                            <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill="#1e293b"
                                stroke="#334155"
                                strokeWidth={0.5}
                                style={{
                                    default: { outline: "none" },
                                    hover: { fill: "#334155", outline: "none" },
                                    pressed: { outline: "none" },
                                }}
                            />
                        ))
                    }
                </Geographies>

                {Object.entries(casesByCourt).map(([court, courtCases]) => {
                    const coords = courtCoordinates[court];
                    if (!coords) return null;

                    const isSelected = courtCases.some(c => c.id === selectedId);
                    const size = Math.min(10 + courtCases.length * 2, 30);

                    return (
                        <Marker key={court} coordinates={coords}>
                            <g
                                className="map-marker-effect cursor-pointer group"
                                onClick={() => {
                                    if (courtCases.length > 0) {
                                        onSelect(courtCases[0].id);
                                    }
                                }}
                            >
                                {/* Pulse Ring (always visible but subtle, intense on hover/select) */}
                                <circle
                                    r={size * 1.5}
                                    fill="none"
                                    stroke="#FFE81F"
                                    strokeWidth={1}
                                    opacity={isSelected ? 0.8 : 0}
                                    className={`targeting-ring ${isSelected ? 'opacity-100' : 'group-hover:opacity-60'}`}
                                />

                                {/* Targeting Reticle (Rotating) */}
                                <g className={`targeting-reticle ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity duration-300`}>
                                    <circle r={size + 5} fill="none" stroke="#4BD5EE" strokeWidth={1} strokeDasharray="4 4" />
                                    <line x1={-size - 8} y1={0} x2={-size - 2} y2={0} stroke="#4BD5EE" strokeWidth={2} />
                                    <line x1={size + 2} y1={0} x2={size + 8} y2={0} stroke="#4BD5EE" strokeWidth={2} />
                                    <line x1={0} y1={-size - 8} x2={0} y2={-size - 2} stroke="#4BD5EE" strokeWidth={2} />
                                    <line x1={0} y1={size + 2} x2={0} y2={size + 8} stroke="#4BD5EE" strokeWidth={2} />
                                </g>

                                {/* Main Marker Circle */}
                                <circle
                                    r={size}
                                    fill={isSelected ? "#FFE81F" : "rgba(255, 232, 31, 0.3)"}
                                    stroke="#FFE81F"
                                    strokeWidth={2}
                                    className="transition-all duration-300 group-hover:fill-[#FFE81F] group-hover:opacity-100"
                                    style={{ filter: isSelected ? 'drop-shadow(0 0 10px #FFE81F)' : 'none' }}
                                />

                                {/* Inner Dot */}
                                <circle r={3} fill={isSelected ? "#000" : "#FFE81F"} />

                                {/* Label */}
                                <text
                                    textAnchor="middle"
                                    y={-size - 10}
                                    style={{
                                        fontFamily: "'Pathway Gothic One', sans-serif",
                                        fill: "#FFE81F",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textShadow: "0 0 5px black",
                                        pointerEvents: "none"
                                    }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                >
                                    {court} ({courtCases.length})
                                </text>
                            </g>
                        </Marker>
                    );
                })}
            </ComposableMap>
        </div>
    );
};

export default CaseMap;
