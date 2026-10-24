'use client';

import React, { useState } from 'react';

export default function SalesChart() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data = [
    { date: 'Oct 12', value: 16500, label: 'Rs. 16,500' },
    { date: 'Oct 13', value: 24200, label: 'Rs. 24,200' },
    { date: 'Oct 14', value: 21800, label: 'Rs. 21,800' },
    { date: 'Oct 15', value: 32400, label: 'Rs. 32,400' },
    { date: 'Oct 16', value: 28900, label: 'Rs. 28,900' },
    { date: 'Oct 17', value: 37500, label: 'Rs. 37,500' },
    { date: 'Oct 18', value: 42100, label: 'Rs. 42,100' },
  ];

  const maxVal = 50000;
  const chartHeight = 180;
  const chartWidth = 560;

  // Compute SVG points
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (chartWidth - 40) + 20;
    const y = chartHeight - (d.value / maxVal) * (chartHeight - 30) - 15;
    return { x, y, ...d };
  });

  // Construct smooth bezier path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    const mx = (p0.x + p1.x) / 2;
    pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
  }

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight} L ${points[0].x} ${chartHeight} Z`;

  return (
    <div className="space-y-4">
      {/* Chart Canvas */}
      <div className="relative w-full overflow-hidden">
        
        {/* Y Axis Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-neutral-400 font-mono pr-2">
          <div className="border-b border-neutral-100 flex justify-between">
            <span>40k</span>
          </div>
          <div className="border-b border-neutral-100 flex justify-between">
            <span>30k</span>
          </div>
          <div className="border-b border-neutral-100 flex justify-between">
            <span>20k</span>
          </div>
          <div className="border-b border-neutral-100 flex justify-between">
            <span>10k</span>
          </div>
          <div className="border-b border-neutral-200 flex justify-between">
            <span>0</span>
          </div>
        </div>

        {/* SVG Graphic */}
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-48 sm:h-56 overflow-visible"
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF5A1F" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#FF5A1F" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area fill */}
          <path d={areaD} fill="url(#salesGradient)" />

          {/* Line stroke */}
          <path
            d={pathD}
            fill="none"
            stroke="#FF5A1F"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 6 : 4}
                className="fill-white stroke-[#FF5A1F] stroke-[3] transition-all cursor-pointer"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              />
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && (
          <div
            className="absolute -top-3 bg-[#111111] text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-xl pointer-events-none transition-all duration-150 transform -translate-x-1/2"
            style={{
              left: `${(points[hoveredIdx].x / chartWidth) * 100}%`,
            }}
          >
            <div>{points[hoveredIdx].date}: {points[hoveredIdx].label}</div>
          </div>
        )}
      </div>

      {/* X Axis Labels */}
      <div className="flex justify-between text-[11px] text-neutral-400 font-semibold px-2">
        {data.map((d, i) => (
          <span key={i}>{d.date}</span>
        ))}
      </div>
    </div>
  );
}
