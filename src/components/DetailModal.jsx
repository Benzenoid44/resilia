import React, { useState } from 'react';
import {
    AreaChart, Area, LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts';
import { X, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import RiskBadge from './RiskBadge';
import ECGWave from './ECGWave';
import SleepStageChart from './SleepStageChart';
import BurnoutGauge from './BurnoutGauge';

const CustomTooltip = ({ active, payload, color }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                background: '#FFFFFF',
                border: `1px solid ${color}40`,
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '0.72rem',
                color: color,
                fontWeight: 700,
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
            }}>
                {payload[0].value}
            </div>
        );
    }
    return null;
};

const TABS = ['Hour', 'Day', 'Week'];

export default function DetailModal({ param, data, onClose }) {
    const [activeTab, setActiveTab] = useState('Hour');

    const historyMap = {
        Hour: data.history,
        Day: data.dayHistory,
        Week: data.weekHistory,
    };

    const chartData = historyMap[activeTab];
    const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
    const trendColor = data.trend === 'up' ? '#DC2626' : data.trend === 'down' ? '#2563EB' : '#A0ABBE';

    const displayValue = param.isSpecial === 'bp'
        ? `${data.value}/${data.diastolic}`
        : param.unit === 'steps'
            ? Number(data.value).toLocaleString()
            : data.value;

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(26,34,51,0.35)',
                backdropFilter: 'blur(6px)',
                zIndex: 200,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: '100%',
                    maxWidth: '430px',
                    background: '#FFFFFF',
                    borderTop: `3px solid ${param.color}`,
                    borderRadius: '24px 24px 0 0',
                    padding: '0 0 32px',
                    animation: 'slide-up 0.32s cubic-bezier(0.4,0,0.2,1)',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    boxShadow: 'var(--shadow-modal)',
                }}
            >
                {/* Handle */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                    <div style={{ width: '36px', height: '4px', borderRadius: '2px', background: 'var(--border)' }} />
                </div>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 20px 20px' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <span style={{ fontSize: '1.6rem' }}>{param.icon}</span>
                            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{param.name}</h2>
                        </div>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginLeft: '2px' }}>{param.description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'var(--bg-primary)',
                            border: '1px solid var(--border)',
                            borderRadius: '50%',
                            width: '34px', height: '34px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer',
                            flexShrink: 0,
                        }}
                    >
                        <X size={16} color="var(--text-secondary)" />
                    </button>
                </div>

                {/* Live value */}
                <div style={{
                    margin: '0 20px 20px',
                    background: `${param.color}0A`,
                    border: `1px solid ${param.color}25`,
                    borderRadius: 'var(--radius-md)',
                    padding: '18px 20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <div style={{
                            fontFamily: 'var(--font-mono)',
                            fontSize: '3rem',
                            fontWeight: 800,
                            color: param.color,
                            lineHeight: 1,
                            animation: 'number-tick 0.3s ease',
                        }}>
                            {displayValue}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '4px', fontWeight: 500 }}>
                            {param.unit}
                        </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <RiskBadge riskLevel={data.riskLevel} size="lg" />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <TrendIcon size={14} color={trendColor} />
                            <span style={{ fontSize: '0.7rem', color: trendColor, fontWeight: 600 }}>
                                {data.trend === 'up' ? 'Rising' : data.trend === 'down' ? 'Dropping' : 'Stable'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Special visualizations */}
                {param.isSpecial === 'ecg' && (
                    <div style={{ margin: '0 20px 16px', padding: '12px', background: `${param.color}06`, borderRadius: 'var(--radius-sm)', border: `1px solid ${param.color}18` }}>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Live ECG Waveform</p>
                        <ECGWave color={param.color} height={60} />
                    </div>
                )}
                {param.isSpecial === 'sleep' && (
                    <div style={{ margin: '0 20px 16px', padding: '14px', background: `${param.color}06`, borderRadius: 'var(--radius-sm)', border: `1px solid ${param.color}18` }}>
                        <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>Sleep Stage Breakdown</p>
                        <SleepStageChart totalHours={data.value} />
                    </div>
                )}
                {param.isSpecial === 'burnout' && (
                    <div style={{ margin: '0 20px 16px', padding: '14px', background: `${param.color}06`, borderRadius: 'var(--radius-sm)', border: `1px solid ${param.color}18`, display: 'flex', justifyContent: 'center' }}>
                        <BurnoutGauge value={data.value} />
                    </div>
                )}

                {/* Normal / Abnormal range */}
                <div style={{ margin: '0 20px 16px', display: 'flex', gap: '8px' }}>
                    <div style={{ flex: 1, background: 'rgba(18,163,122,0.06)', border: '1px solid rgba(18,163,122,0.18)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                        <p style={{ fontSize: '0.6rem', color: 'var(--green)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>✓ Normal</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{param.normalLabel}</p>
                    </div>
                    <div style={{ flex: 1, background: 'rgba(220,38,38,0.05)', border: '1px solid rgba(220,38,38,0.15)', borderRadius: 'var(--radius-sm)', padding: '10px 12px' }}>
                        <p style={{ fontSize: '0.6rem', color: 'var(--red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>⚠ Abnormal</p>
                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{param.abnormalLabel}</p>
                    </div>
                </div>

                {/* Graph tabs */}
                <div style={{ padding: '0 20px' }}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    padding: '6px 16px',
                                    borderRadius: '100px',
                                    border: `1px solid ${activeTab === tab ? param.color : 'var(--border)'}`,
                                    background: activeTab === tab ? `${param.color}12` : '#FFFFFF',
                                    color: activeTab === tab ? param.color : 'var(--text-secondary)',
                                    fontSize: '0.72rem',
                                    fontWeight: activeTab === tab ? 700 : 400,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    fontFamily: 'var(--font-main)',
                                }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* Area Chart */}
                    <div style={{ height: '160px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 5, right: 4, bottom: 0, left: -20 }}>
                                <defs>
                                    <linearGradient id={`grad-${param.id}`} x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={param.color} stopOpacity={0.25} />
                                        <stop offset="100%" stopColor={param.color} stopOpacity={0.01} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fill: 'var(--text-muted)', fontSize: 9 }}
                                    axisLine={false}
                                    tickLine={false}
                                    interval="preserveStartEnd"
                                />
                                <YAxis
                                    tick={{ fill: 'var(--text-muted)', fontSize: 9 }}
                                    axisLine={false}
                                    tickLine={false}
                                    domain={['auto', 'auto']}
                                />
                                <Tooltip content={<CustomTooltip color={param.color} />} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke={param.color}
                                    strokeWidth={2}
                                    fill={`url(#grad-${param.id})`}
                                    dot={false}
                                    activeDot={{ r: 4, fill: param.color, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
