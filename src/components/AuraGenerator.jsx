import React from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles } from 'lucide-react';
import '../index.css';

// Fallback colors if user has fewer than 3 languages
const DEFAULT_COLORS = ['#8b5cf6', '#06b6d4', '#f43f5e', '#10b981'];

/**
 * AuraGenerator builds an SVG piece of generative art based on the user's GitHub data.
 */
const AuraGenerator = ({ data }) => {
    const svgRef = React.useRef(null);

    const handleDownload = () => {
        if (!svgRef.current) return;

        // We need to serialize the SVG to a string and create a functional download link
        const svgData = new XMLSerializer().serializeToString(svgRef.current);
        const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.profile.login}_aura.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // 1. Map Top Languages to Colors
    const colors = data.languages.slice(0, 3).map((lang, idx) => DEFAULT_COLORS[idx % DEFAULT_COLORS.length]);
    // Ensure we always have 3 colors for the gradient math
    while (colors.length < 3) colors.push(DEFAULT_COLORS[colors.length]);

    // 2. Stars define the Glow / Blur radius (min 20, max 80)
    const blurVal = Math.min(80, Math.max(20, 20 + (data.impact.totalStars / 100)));

    // 3. Commits define the number of "nodes" or "blobs" (min 3, max 8)
    const numBlobs = Math.min(8, Math.max(3, Math.floor(data.rhythm.totalCommits / 20)));

    // 4. Activity Persona defines the animation pattern/rhythm
    let animationDuration = 10;
    if (data.rhythm.persona === 'Night Owl') animationDuration = 20; // Slow, sleepy
    if (data.rhythm.persona === 'Early Bird') animationDuration = 5; // Fast, energetic

    const generateBlobPaths = () => {
        const blobs = [];
        for (let i = 0; i < numBlobs; i++) {
            const x = 30 + (Math.random() * 40); // 30% to 70%
            const y = 30 + (Math.random() * 40);
            const r = 15 + (Math.random() * 25);
            const color = colors[i % colors.length];

            blobs.push(
                <motion.circle
                    key={i}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r={`${r}%`}
                    fill={color}
                    opacity={0.6 + (Math.random() * 0.3)}
                    animate={{
                        cx: [`${x}%`, `${x + (Math.random() * 20 - 10)}%`, `${x}%`],
                        cy: [`${y}%`, `${y + (Math.random() * 20 - 10)}%`, `${y}%`],
                        scale: [1, 1.1 + Math.random() * 0.3, 1]
                    }}
                    transition={{
                        duration: animationDuration + Math.random() * 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            );
        }
        return blobs;
    };

    return (
        <div className="glass glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', margin: 0 }}>
                    <Sparkles size={20} color={colors[0]} /> Developer Aura
                </h3>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Unique Code Fingerprint</span>
            </div>

            <div
                style={{
                    flex: 1,
                    minHeight: '250px',
                    background: 'var(--bg-color)',
                    borderRadius: '12px',
                    position: 'relative',
                    overflow: 'hidden',
                    border: '1px solid var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                id="aura-container"
            >
                <svg ref={svgRef} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" style={{ background: 'var(--bg-color)' }}>
                    <defs>
                        <filter id="aura-blur" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation={blurVal} />
                        </filter>
                    </defs>
                    <g filter="url(#aura-blur)">
                        {generateBlobPaths()}
                    </g>
                </svg>

                {/* Overlay a subtle glass effect on top of the aura to make it look sealed inside */}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)', pointerEvents: 'none' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontStyle: 'italic', margin: 0, flex: 1 }}>
                    Colors derived from {data.languages.length > 0 ? data.languages.slice(0, 3).map(l => l.name).join(', ') : 'your code'}. Intensity tied to {data.impact.totalStars} stars.
                </p>
                <button
                    type="button"
                    className="btn-primary"
                    onClick={handleDownload}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', fontSize: '0.9rem' }}
                >
                    <Download size={16} /> Mint Aura
                </button>
            </div>
        </div>
    );
};

export default AuraGenerator;
