/**
 * Stress Analysis Engine
 * Calculates a weighted composite stress score (0–100) from all 12 live parameters.
 * Returns { score, level, factors }
 *
 * Level thresholds:
 *   low      0–39
 *   moderate 40–69
 *   severe   70–100
 */

/**
 * Normalize a value into a 0–1 stress contribution.
 * direction: 'up'   → high value = high stress (e.g. HR, GSR)
 *            'down' → low value  = high stress (e.g. HRV, Sleep)
 *            'both' → deviation from midpoint = stress (e.g. Temperature, Glucose)
 */
function normalize(value, normalMin, normalMax, criticalLow, criticalHigh, direction = 'up') {
    if (direction === 'up') {
        // stress increases as value rises above normalMin
        if (value <= normalMin) return 0;
        if (value >= criticalHigh) return 1;
        return (value - normalMin) / (criticalHigh - normalMin);
    }
    if (direction === 'down') {
        // stress increases as value falls below normalMax
        if (value >= normalMax) return 0;
        if (value <= criticalLow) return 1;
        return (normalMax - value) / (normalMax - criticalLow);
    }
    // 'both' — deviation from midpoint
    const mid = (normalMin + normalMax) / 2;
    const dev = Math.abs(value - mid);
    const maxDev = Math.max(mid - criticalLow, criticalHigh - mid);
    return Math.min(1, dev / maxDev);
}

/**
 * Parameter contributions
 * Each entry: { id, label, weight, direction }
 * Weights sum to 1.
 */
const CONTRIBUTIONS = [
    { id: 'hrv', label: 'Low HRV', weight: 0.22, direction: 'down' },
    { id: 'gsr', label: 'Skin Conductance', weight: 0.18, direction: 'up' },
    { id: 'hr', label: 'Elevated Heart Rate', weight: 0.14, direction: 'up' },
    { id: 'burnout', label: 'Burnout Risk', weight: 0.13, direction: 'up' },
    { id: 'respiratory', label: 'Rapid Breathing', weight: 0.10, direction: 'up' },
    { id: 'bloodPressure', label: 'Elevated BP', weight: 0.08, direction: 'up' },
    { id: 'eeg', label: 'Beta Wave Excess', weight: 0.05, direction: 'up' },
    { id: 'temperature', label: 'Body Temperature', weight: 0.04, direction: 'both' },
    { id: 'sleepCycles', label: 'Sleep Deficit', weight: 0.03, direction: 'down' },
    { id: 'sleepPulse', label: 'Elevated Sleep HR', weight: 0.01, direction: 'up' },
    { id: 'glucose', label: 'Blood Glucose', weight: 0.01, direction: 'both' },
    { id: 'activity', label: 'Activity Deviation', weight: 0.01, direction: 'both' },
];

export function computeStress(liveData, healthParams) {
    // Build a param lookup by id
    const paramMap = {};
    healthParams.forEach(p => { paramMap[p.id] = p; });

    let totalScore = 0;
    const factors = [];

    CONTRIBUTIONS.forEach(({ id, label, weight, direction }) => {
        const param = paramMap[id];
        const entry = liveData[id];
        if (!param || !entry) return;

        const raw = normalize(
            entry.value,
            param.normalMin,
            param.normalMax,
            param.criticalLow,
            param.criticalHigh,
            direction
        );

        const contribution = raw * weight * 100;
        totalScore += contribution;

        if (raw > 0.05) {
            factors.push({ id, label, raw, contribution, weight });
        }
    });

    const score = Math.min(100, Math.round(totalScore));
    const level = score >= 70 ? 'severe' : score >= 40 ? 'moderate' : 'low';

    // Top 3 contributing factors for display
    const topFactors = factors
        .sort((a, b) => b.contribution - a.contribution)
        .slice(0, 3)
        .map(f => ({ id: f.id, label: f.label, pct: Math.round(f.raw * 100) }));

    return { score, level, topFactors };
}

export const STRESS_CONFIG = {
    low: {
        label: 'Low Stress',
        color: '#12A37A',
        bg: '#F0FBF7',
        border: 'rgba(18,163,122,0.2)',
        emoji: '😌',
        tagline: 'All vitals calm · Monitoring active',
    },
    moderate: {
        label: 'Moderate Stress',
        color: '#D97706',
        bg: '#FFFBF0',
        border: 'rgba(217,119,6,0.2)',
        emoji: '😟',
        tagline: 'Stress indicators elevated · Action recommended',
    },
    severe: {
        label: 'Severe Stress',
        color: '#DC2626',
        bg: '#FFF5F5',
        border: 'rgba(220,38,38,0.2)',
        emoji: '🚨',
        tagline: 'Critical stress detected · Immediate action required',
    },
};
