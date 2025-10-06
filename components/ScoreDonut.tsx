
import React from 'react';

export const ScoreDonut: React.FC<{ score: number }> = ({ score }) => {
    const size = 160;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s: number) => {
        if (s >= 85) return '#4ade80'; // green-400
        if (s >= 70) return '#facc15'; // yellow-400
        if (s >= 50) return '#fb923c'; // orange-400
        return '#f87171'; // red-400
    };

    const color = getColor(score);

    return (
        <div className="relative" style={{ width: size, height: size }}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle
                    className="text-gray-700"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                        transform: 'rotate(-90deg)',
                        transformOrigin: '50% 50%',
                        transition: 'stroke-dashoffset 0.5s ease-in-out'
                    }}
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-extrabold" style={{ color }}>{Math.round(score)}</span>
                <span className="text-sm text-gray-400">/ 100</span>
            </div>
        </div>
    );
};
