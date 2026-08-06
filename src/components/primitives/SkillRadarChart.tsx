export interface RadarAxis {
  label: string;
  shortLabel?: string;
  value: number; // 0-100
}

interface SkillRadarChartProps {
  axes: RadarAxis[];
  size?: number;
  title?: string;
  fillColor?: string;
  strokeColor?: string;
}

export function SkillRadarChart({
  axes,
  size = 300,
  title,
  fillColor = 'rgba(99, 102, 241, 0.25)',
  strokeColor = '#6366F1',
}: SkillRadarChartProps) {
  const center = size / 2;
  const radius = center - 52;
  const numAxes = axes.length || 5;
  const levels = [20, 40, 60, 80, 100];

  function getCoordinates(index: number, val: number) {
    const angle = ((Math.PI * 2) / numAxes) * index - Math.PI / 2;
    const r = (Math.max(0, Math.min(100, val)) / 100) * radius;
    return { x: center + r * Math.cos(angle), y: center + r * Math.sin(angle) };
  }

  const dataPoints = axes.map((axis, i) => getCoordinates(i, axis.value));
  const dataPolygon = dataPoints.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <div className="flex flex-col items-center gap-2">
      {title && <h4 className="text-sm font-bold text-foreground">{title}</h4>}
      <svg width={size} height={size} className="overflow-visible">
        {levels.map((lvl) => {
          const gridPoints = Array.from({ length: numAxes }, (_, i) => {
            const { x, y } = getCoordinates(i, lvl);
            return `${x},${y}`;
          }).join(' ');
          return (
            <polygon
              key={lvl}
              points={gridPoints}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
              className="text-border"
              strokeDasharray={lvl === 100 ? 'none' : '3 3'}
            />
          );
        })}

        {axes.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="currentColor"
              strokeWidth={1}
              className="text-border"
            />
          );
        })}

        <polygon
          points={dataPolygon}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={2.5}
          className="transition-all duration-500 ease-out"
        />

        {dataPoints.map((p, i) => (
          <g key={i} className="group cursor-pointer">
            <circle cx={p.x} cy={p.y} r={10} fill={strokeColor} fillOpacity={0.2} className="animate-ping" />
            <circle
              cx={p.x}
              cy={p.y}
              r={5}
              fill={strokeColor}
              stroke="white"
              strokeWidth={2}
              className="transition-transform group-hover:scale-125"
            />
          </g>
        ))}

        {axes.map((axis, i) => {
          const angle = ((Math.PI * 2) / numAxes) * i - Math.PI / 2;
          const labelRadius = radius + 26;
          const lx = center + labelRadius * Math.cos(angle);
          const ly = center + labelRadius * Math.sin(angle);
          let textAnchor: 'middle' | 'start' | 'end' = 'middle';
          if (Math.cos(angle) > 0.3) textAnchor = 'start';
          if (Math.cos(angle) < -0.3) textAnchor = 'end';

          return (
            <g key={i}>
              <text
                x={lx}
                y={ly}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="fill-foreground text-[11px] font-bold"
              >
                {axis.shortLabel ?? axis.label}
              </text>
              <text
                x={lx}
                y={ly + 13}
                textAnchor={textAnchor}
                dominantBaseline="middle"
                className="fill-indigo-600 text-[10px] font-semibold"
              >
                %{Math.round(axis.value)}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
