import React from 'react';
import { ComposableMap, Geographies, Geography, Marker } from 'react-simple-maps';

const geoUrl = "https://raw.githubusercontent.com/longwosion/geojson-map-china/master/china.json";

const courtCoordinates = {
    "Wuhan Intermediate People's Court": [114.3055, 30.5928], // Wuhan
    "Chengdu Intermediate People's Court": [104.0668, 30.5728], // Chengdu
    "Changsha Intermediate People's Court": [112.9388, 28.2282], // Changsha
    "Guangzhou Internet Court": [113.2644, 23.1291], // Guangzhou
    "Shenzhen Nanshan District People's Court": [113.9303, 22.5329], // Shenzhen
    "Guilin Intermediate People's Court": [110.2864, 25.2736], // Guilin
    "Beijing IP Court": [116.4074, 39.9042], // Beijing
    "Beijing Internet Court": [116.4074, 39.9042], // Beijing
    "Hangzhou Intermediate People's Court": [120.1551, 30.2741], // Hangzhou
    "Hangzhou Internet Court": [120.2108, 30.2084], // Hangzhou
    "Qinhuangdao Intermediate People's Court": [119.5865, 39.9354], // Qinhuangdao
    "Zhangjiagang People's Court": [120.5555, 31.8755], // Zhangjiagang
    "Changshu People's Court": [120.7525, 31.6537], // Changshu
};

export const provinceMapping = {
    "Wuhan Intermediate People's Court": "湖北省",
    "Chengdu Intermediate People's Court": "四川省",
    "Changsha Intermediate People's Court": "湖南省",
    "Guangzhou Internet Court": "广东省",
    "Shenzhen Nanshan District People's Court": "广东省",
    "Guilin Intermediate People's Court": "广西壮族自治区",
    "Beijing IP Court": "北京市",
    "Beijing Internet Court": "北京市",
    "Hangzhou Intermediate People's Court": "浙江省",
    "Hangzhou Internet Court": "浙江省",
    "Qinhuangdao Intermediate People's Court": "河北省",
    "Zhangjiagang People's Court": "江苏省",
    "Changshu People's Court": "江苏省",
};

const provinceColors = {
    "湖北省": "#8b5cf6", // Purple
    "四川省": "#3b82f6", // Blue
    "湖南省": "#0ea5e9", // Light Blue
    "广东省": "#22c55e", // Green
    "广西壮族自治区": "#d946ef", // Pink
    "北京市": "#ef4444", // Red
    "浙江省": "#eab308", // Yellow
    "河北省": "#f97316", // Orange
    "江苏省": "#facc15", // Yellow
    "台湾省": "#94a3b8", // Slate-400 (distinct but neutral)
};

const ChinaMap = ({ cases, selectedId, onSelect }) => {
    // Group cases by court to size markers
    const casesByCourt = cases.reduce((acc, c) => {
        const court = c.court;
        if (!acc[court]) acc[court] = [];
        acc[court].push(c);
        return acc;
    }, {});

    return (
        <div className="w-full h-full flex items-center justify-center">
            <ComposableMap
                projection="geoMercator"
                projectionConfig={{
                    scale: 600,
                    center: [105, 36]
                }}
            >
                <Geographies geography={geoUrl}>
                    {({ geographies }) =>
                        geographies.map((geo) => {
                            const provinceName = geo.properties.name;
                            const color = provinceColors[provinceName] || "#1e293b";
                            const hasCases = Object.values(provinceMapping).includes(provinceName);

                            return (
                                <Geography
                                    key={geo.rsmKey}
                                    geography={geo}
                                    fill={color}
                                    stroke="#334155"
                                    strokeWidth={0.5}
                                    style={{
                                        default: { outline: "none" },
                                        hover: { fill: hasCases ? color : "#334155", outline: "none", opacity: 0.8 },
                                        pressed: { outline: "none" },
                                    }}
                                />
                            );
                        })
                    }
                </Geographies>

                {Object.entries(casesByCourt).map(([court, courtCases]) => {
                    const coords = courtCoordinates[court];
                    if (!coords) return null;

                    const isSelected = courtCases.some(c => c.id === selectedId);
                    const size = Math.min(10 + courtCases.length * 2, 30);

                    // Offset Beijing markers slightly if both exist to avoid overlap
                    let displayCoords = coords;
                    if (court === "Beijing Internet Court") {
                        displayCoords = [coords[0] + 0.5, coords[1] - 0.5];
                    }

                    return (
                        <Marker key={court} coordinates={displayCoords}>
                            <g
                                className="map-marker-effect cursor-pointer group"
                                onClick={() => {
                                    if (courtCases.length > 0) {
                                        onSelect(courtCases[0].id);
                                    }
                                }}
                            >
                                {/* Pulse Ring */}
                                <circle
                                    r={size * 1.5}
                                    fill="none"
                                    stroke="#FFE81F"
                                    strokeWidth={1}
                                    opacity={isSelected ? 0.8 : 0}
                                    className={`targeting-ring ${isSelected ? 'opacity-100' : 'group-hover:opacity-60'}`}
                                />

                                {/* Targeting Reticle */}
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
                                    fill={isSelected ? "#FFE81F" : "rgba(0, 0, 0, 0.6)"}
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
                                        fill: "#fff",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                        textShadow: "0 0 5px black",
                                        pointerEvents: "none"
                                    }}
                                    className={`transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
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

export default ChinaMap;
