import React, { useEffect, useRef } from 'react';

const ECG_PATH = "M0,50 L20,50 L30,50 L35,20 L40,80 L45,10 L50,65 L55,50 L80,50 L90,50 L95,20 L100,80 L105,10 L110,65 L115,50 L140,50 L150,50 L155,20 L160,80 L165,10 L170,65 L175,50 L200,50";

export default function ECGWave({ color = '#00FF9C', height = 50 }) {
    const pathRef = useRef(null);

    useEffect(() => {
        const animate = () => {
            if (pathRef.current) {
                const len = pathRef.current.getTotalLength?.() || 800;
                pathRef.current.style.strokeDasharray = len;
                pathRef.current.style.strokeDashoffset = len;
                pathRef.current.style.animation = 'none';
                // Force reflow
                void pathRef.current.getBoundingClientRect();
                pathRef.current.style.animation = `ecg-draw 1.2s linear forwards`;
            }
        };
        animate();
        const interval = setInterval(animate, 2400);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ width: '100%', height: `${height}px`, overflow: 'hidden', position: 'relative' }}>
            <svg
                viewBox="0 0 200 100"
                preserveAspectRatio="none"
                style={{ width: '100%', height: '100%' }}
            >
                <defs>
                    <filter id="ecg-glow">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {/* Background glow path */}
                <path
                    d={ECG_PATH}
                    fill="none"
                    stroke={color}
                    strokeWidth="6"
                    strokeOpacity="0.12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                {/* Main glowing path */}
                <path
                    ref={pathRef}
                    d={ECG_PATH}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeOpacity="0.9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#ecg-glow)"
                    style={{
                        strokeDasharray: 800,
                        strokeDashoffset: 800,
                    }}
                />
            </svg>
        </div>
    );
}
