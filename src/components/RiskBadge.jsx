import React from 'react';
import { RISK_COLORS } from '../data/healthConfig';

// Updated RISK_COLORS for light theme – override here since we can't change the export
const CALM_RISK_COLORS = {
    normal: '#12A37A',
    warning: '#D97706',
    critical: '#DC2626',
    unknown: '#A0ABBE',
};

const RISK_LABELS = {
    normal: 'Normal',
    warning: 'Caution',
    critical: 'Critical',
    unknown: 'No Data',
};

export default function RiskBadge({ riskLevel, size = 'sm' }) {
    const color = CALM_RISK_COLORS[riskLevel] || CALM_RISK_COLORS.unknown;
    const label = RISK_LABELS[riskLevel] || 'Unknown';
    const isCritical = riskLevel === 'critical';
    const isWarning = riskLevel === 'warning';

    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: size === 'lg' ? '6px' : '4px',
            background: `${color}12`,
            border: `1px solid ${color}40`,
            borderRadius: '100px',
            padding: size === 'lg' ? '5px 12px' : '3px 8px',
            whiteSpace: 'nowrap',
        }}>
            <div style={{
                position: 'relative',
                width: size === 'lg' ? '8px' : '6px',
                height: size === 'lg' ? '8px' : '6px',
                flexShrink: 0,
            }}>
                {(isCritical || isWarning) && (
                    <div style={{
                        position: 'absolute',
                        inset: '-2px',
                        borderRadius: '50%',
                        background: `${color}30`,
                        animation: 'pulse-ring 1.8s ease-out infinite',
                    }} />
                )}
                <div style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: color,
                    animation: 'pulse-dot 2.2s infinite',
                }} />
            </div>
            <span style={{
                fontSize: size === 'lg' ? '0.72rem' : '0.6rem',
                fontWeight: 700,
                color: color,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
            }}>
                {label}
            </span>
        </div>
    );
}
