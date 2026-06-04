"use client";

import React from "react";
import { motion } from "framer-motion";

interface ChartData {
  label: string;
  value: number;
}

interface AreaChartProps {
  data: ChartData[];
  color?: string;
  height?: number;
}

export const PerformanceAreaChart = ({ data, color = "#C8A96B", height = 200 }: AreaChartProps) => {
  const max = Math.max(...data.map(d => d.value));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.value / max) * 100;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div className="relative w-full overflow-hidden" style={{ height }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area */}
        <motion.polygon
          points={areaPoints}
          fill="url(#chartGradient)"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        {/* Line */}
        <motion.polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Grid Lines */}
        <line x1="0" y1="25" x2="100" y2="25" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
        <line x1="0" y1="75" x2="100" y2="75" stroke="white" strokeOpacity="0.05" strokeWidth="0.5" />
      </svg>

      {/* Data Points Tooltips (Simplified) */}
      <div className="absolute inset-0 flex justify-between px-2">
        {data.map((d, i) => (
          <div key={i} className="group relative flex flex-col items-center justify-end h-full">
             <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-unity-gold text-unity-black text-[8px] font-black px-2 py-1 rounded transition-opacity whitespace-nowrap">
                {d.value}%
             </div>
             <div className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-unity-gold transition-colors" />
          </div>
        ))}
      </div>
    </div>
  );
};

export const RadarChart = ({ data }: { data: { label: string; value: number }[] }) => {
  const size = 200;
  const center = size / 2;
  const radius = center * 0.8;

  const points = data.map((d, i) => {
    const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
    const r = (d.value / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Polygons */}
        {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => {
          const polyPoints = data.map((_, i) => {
            const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
            const r = scale * radius;
            const x = center + r * Math.cos(angle);
            const y = center + r * Math.sin(angle);
            return `${x},${y}`;
          }).join(" ");
          return (
            <polygon
              key={scale}
              points={polyPoints}
              fill="none"
              stroke="white"
              strokeOpacity="0.05"
            />
          );
        })}

        {/* Axes */}
        {data.map((_, i) => {
          const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="white"
              strokeOpacity="0.05"
            />
          );
        })}

        {/* Data Shape */}
        <motion.polygon
          points={points}
          fill="rgba(200, 169, 107, 0.2)"
          stroke="#C8A96B"
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Labels */}
        {data.map((d, i) => {
          const angle = (i / data.length) * 2 * Math.PI - Math.PI / 2;
          const x = center + (radius + 20) * Math.cos(angle);
          const y = center + (radius + 20) * Math.sin(angle);
          return (
            <text
              key={d.label}
              x={x}
              y={y}
              fill="rgba(255, 255, 255, 0.4)"
              fontSize="8"
              fontWeight="bold"
              textAnchor="middle"
              dominantBaseline="middle"
              className="uppercase tracking-widest"
            >
              {d.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
};
