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
                            <circle
                                r={size}
                                fill={isSelected ? "#6366f1" : "rgba(99, 102, 241, 0.5)"}
                                stroke="#fff"
                                strokeWidth={2}
                                className="cursor-pointer transition-all duration-300 hover:fill-indigo-500 hover:opacity-100"
                                onClick={() => {
                                    if (courtCases.length > 0) {
                                        onSelect(courtCases[0].id);
                                    }
                                }}
                            />
                            <text
                                textAnchor="middle"
                                y={-size - 5}
                                style={{ fontFamily: "system-ui", fill: "#94a3b8", fontSize: "10px", fontWeight: "bold" }}
                            >
                                {courtCases.length}
                            </text>
                        </Marker>
                    );
                })}
            </ComposableMap>
        </div>
    );
};

export default CaseMap;
