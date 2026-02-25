import { useState, useEffect, useRef, useCallback } from 'react';
import { HEALTH_PARAMS, getRiskLevel } from '../data/healthConfig';
import { computeStress } from '../data/stressEngine';

const HISTORY_LENGTH = 60;
const UPDATE_INTERVAL = 1200; // ms

function generateValue(param, prev) {
    const range = param.fluctuation;
    const delta = (Math.random() - 0.5) * range;
    let next = prev + delta;
    // Keep within a wider "realistic" band
    const low = param.normalMin - (param.normalMin - param.criticalLow) * 0.5;
    const high = param.normalMax + (param.criticalHigh - param.normalMax) * 0.5;
    next = Math.max(low, Math.min(high, next));
    // Round appropriately
    if (param.unit === '°C') return Math.round(next * 10) / 10;
    if (param.unit === 'ms' || param.unit === 'hrs' || param.unit === '%') return Math.round(next * 10) / 10;
    return Math.round(next);
}

function generateDiastolic(param, prev) {
    const delta = (Math.random() - 0.5) * param.diastolicFluctuation;
    return Math.round(Math.max(60, Math.min(90, prev + delta)));
}

function buildInitialHistory(param) {
    const history = [];
    let val = param.baseValue;
    for (let i = 0; i < HISTORY_LENGTH; i++) {
        val = generateValue(param, val);
        history.push({ time: i, value: val });
    }
    return history;
}

function buildDayHistory(param) {
    const history = [];
    let val = param.baseValue;
    for (let i = 0; i < 24; i++) {
        val = generateValue(param, val);
        history.push({ time: `${i}:00`, value: val });
    }
    return history;
}

function buildWeekHistory(param) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const history = [];
    let val = param.baseValue;
    for (let i = 0; i < 7; i++) {
        val = generateValue(param, val);
        history.push({ time: days[i], value: val });
    }
    return history;
}

export function useLiveData() {
    const [liveData, setLiveData] = useState(() => {
        const initial = {};
        HEALTH_PARAMS.forEach((p) => {
            initial[p.id] = {
                value: p.baseValue,
                diastolic: p.baseDiastolic || null,
                history: buildInitialHistory(p),
                dayHistory: buildDayHistory(p),
                weekHistory: buildWeekHistory(p),
                riskLevel: getRiskLevel(p, p.baseValue),
                trend: 'stable', // 'up' | 'down' | 'stable'
            };
        });
        return initial;
    });

    const prevRef = useRef(liveData);

    useEffect(() => {
        const timer = setInterval(() => {
            setLiveData((prev) => {
                const next = { ...prev };
                HEALTH_PARAMS.forEach((p) => {
                    const old = prev[p.id];
                    const newVal = generateValue(p, old.value);
                    const newDiastolic = p.baseDiastolic ? generateDiastolic(p, old.diastolic) : null;
                    const newHistory = [
                        ...old.history.slice(1),
                        { time: old.history.length, value: newVal },
                    ];
                    next[p.id] = {
                        ...old,
                        value: newVal,
                        diastolic: newDiastolic,
                        history: newHistory,
                        riskLevel: getRiskLevel(p, newVal),
                        trend: newVal > old.value ? 'up' : newVal < old.value ? 'down' : 'stable',
                    };
                });
                return next;
            });
        }, UPDATE_INTERVAL);
        return () => clearInterval(timer);
    }, []);

    const getOverallRisk = useCallback(() => {
        const criticals = HEALTH_PARAMS.filter(
            (p) => liveData[p.id]?.riskLevel === 'critical'
        ).length;
        const warnings = HEALTH_PARAMS.filter(
            (p) => liveData[p.id]?.riskLevel === 'warning'
        ).length;
        if (criticals > 0) return 'critical';
        if (warnings > 1) return 'warning';
        return 'normal';
    }, [liveData]);

    const getWellnessScore = useCallback(() => {
        const criticals = HEALTH_PARAMS.filter(
            (p) => liveData[p.id]?.riskLevel === 'critical'
        ).length;
        const warnings = HEALTH_PARAMS.filter(
            (p) => liveData[p.id]?.riskLevel === 'warning'
        ).length;
        const score = Math.max(0, 100 - criticals * 15 - warnings * 5);
        return score;
    }, [liveData]);

    const getStressAnalysis = useCallback(() => {
        return computeStress(liveData, HEALTH_PARAMS);
    }, [liveData]);

    return { liveData, getOverallRisk, getWellnessScore, getStressAnalysis };
}
