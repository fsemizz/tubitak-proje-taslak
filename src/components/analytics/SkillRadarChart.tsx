import React from 'react';

export interface SkillScore {
  categoryKey: string; // e.g. 'algorithm-sorting'
  label: string;      // e.g. 'Algoritma Sıralama'
  score: number;      // 0 - 100
  shortLabel: string; // e.g. 'Algoritma'
}

interface SkillRadarChartProps {
  skills: SkillScore[];
  size?: number;
  showLabels?: boolean;
  fillColor?: string;
  strokeColor?: string;
  title?: string;
}

export const SkillRadarChart: React.FC<SkillRadarChartProps> = ({
  skills,
  size = 320,
  showLabels = true,
  fillColor = 'rgba(99, 102, 241, 0.25)', // Indigo glow
  strokeColor = '#6366F1',
  title,
}) => {
  const center = size / 2;
  const radius = center - 55; // Leave padding for text labels
  const numAxes = skills.length || 5;

  // Compute (x, y) for an axis angle and distance
  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 / numAxes) * index - Math.PI / 2;
    const r = (val / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Concentric levels (20%, 40%, 60%, 80%, 100%)
  const levels = [20, 40, 60, 80, 100];

  // Data polygon points
  const points = skills
    .map((skill, i) => {
      const { x, y } = getCoordinates(i, skill.score);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="flex flex-col items-center justify-center p-2">
      {title && (
        <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mb-2 tracking-tight">
          {title}
        </h4>
      )}
      <div className="relative">
        <svg width={size} height={size} className="overflow-visible">
          {/* Background Concentric Grid Polygons */}
          {levels.map((lvl) => {
            const gridPoints = Array.from({ length: numAxes })
              .map((_, i) => {
                const { x, y } = getCoordinates(i, lvl);
                return `${x},${y}`;
              })
              .join(' ');
            return (
              <polygon
                key={lvl}
                points={gridPoints}
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
                className="text-slate-200 dark:text-slate-700/60"
                strokeDasharray={lvl === 100 ? 'none' : '3 3'}
              />
            );
          })}

          {/* Axes Lines */}
          {skills.map((_, i) => {
            const { x, y } = getCoordinates(i, 100);
            return (
              <line
                key={i}
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="currentColor"
                strokeWidth="1.5"
                className="text-slate-200 dark:text-slate-700"
              />
            );
          })}

          {/* Student Performance Polygon Area */}
          <polygon
            points={points}
            fill={fillColor}
            stroke={strokeColor}
            strokeWidth="3"
            className="transition-all duration-500 ease-out"
          />

          {/* Data Points (Dots on vertices) */}
          {skills.map((skill, i) => {
            const { x, y } = getCoordinates(i, skill.score);
            return (
              <g key={i} className="group cursor-pointer">
                <circle
                  cx={x}
                  cy={y}
                  r="6"
                  fill={strokeColor}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="transition-transform group-hover:scale-125"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="12"
                  fill={strokeColor}
                  fillOpacity="0.2"
                  className="animate-ping"
                />
              </g>
            );
          })}

          {/* Labels */}
          {showLabels &&
            skills.map((skill, i) => {
              const angle = (Math.PI * 2 / numAxes) * i - Math.PI / 2;
              const labelRadius = radius + 28;
              const lx = center + labelRadius * Math.cos(angle);
              const ly = center + labelRadius * Math.sin(angle);

              let textAnchor: 'inherit' | 'end' | 'middle' | 'start' = 'middle';
              if (Math.cos(angle) > 0.3) textAnchor = 'start';
              if (Math.cos(angle) < -0.3) textAnchor = 'end';

              return (
                <g key={i}>
                  <text
                    x={lx}
                    y={ly}
                    textAnchor={textAnchor}
                    dominantBaseline="middle"
                    className="text-[11px] font-extrabold fill-slate-700 dark:fill-slate-200"
                  >
                    {skill.shortLabel}
                  </text>
                  <text
                    x={lx}
                    y={ly + 13}
                    textAnchor={textAnchor}
                    dominantBaseline="middle"
                    className="text-[10px] font-bold fill-indigo-600 dark:fill-indigo-400"
                  >
                    %{skill.score}
                  </text>
                </g>
              );
            })}
        </svg>
      </div>
    </div>
  );
};
