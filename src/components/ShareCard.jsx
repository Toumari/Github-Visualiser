import React from 'react';
import { Github, Star, Activity, Award } from 'lucide-react';

const COLORS = ['#8b5cf6', '#06b6d4', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#84cc16'];

/**
 * ShareCard is a hidden component specifically styled with fixed inline constraints
 * so that html2canvas can perfectly render it as a social media "Trading Card".
 */
const ShareCard = React.forwardRef(({ data }, ref) => {
    if (!data) return null;

    return (
        <div
            ref={ref}
            style={{
                position: 'absolute',
                top: '-9999px',
                left: '-9999px',
                width: '1200px', // Standard Twitter/LinkedIn image width
                height: '630px', // Standard Twitter/LinkedIn image height
                background: '#05050a', /* Match --bg-color */
                backgroundImage: 'radial-gradient(circle at top, #130a2a 0%, #05050a 100%)',
                color: '#ffffff',
                fontFamily: "'Outfit', sans-serif",
                display: 'flex',
                flexDirection: 'column',
                padding: '60px 80px',
                boxSizing: 'border-box',
                overflow: 'hidden'
            }}
        >
            {/* Background Decorative Elements */}
            <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, rgba(0,0,0,0) 70%)', borderRadius: '50%' }} />

            {/* Header with Branding */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Github size={48} color="#8b5cf6" />
                    <h1 style={{ fontSize: '2.5rem', margin: 0, fontWeight: 700 }}>
                        GitHub <span style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Visualizer</span>
                    </h1>
                </div>
                <div style={{ fontSize: '1.2rem', color: '#cbd5e1', fontWeight: 500 }}>
                    github-visualizer.app {/* Replace with real domain if available */}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '60px', flex: 1, zIndex: 1 }}>

                {/* Left Column: User Profile */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px', marginBottom: '40px' }}>
                        <img
                            src={data.profile.avatar_url}
                            alt={data.profile.login}
                            style={{ width: '160px', height: '160px', borderRadius: '50%', border: '6px solid rgba(255, 255, 255, 0.1)', objectFit: 'cover' }}
                            crossOrigin="anonymous" // Crucial for html2canvas to load external images
                        />
                        <div>
                            <h2 style={{ fontSize: '3.5rem', margin: '0 0 8px 0', lineHeight: 1.1 }}>{data.profile.name || data.profile.login}</h2>
                            <div style={{ fontSize: '1.8rem', color: '#06b6d4', marginBottom: '16px' }}>@{data.profile.login}</div>
                            <div style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '12px',
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                                padding: '10px 24px',
                                borderRadius: '30px',
                                fontWeight: 'bold',
                                fontSize: '1.4rem'
                            }}>
                                <Award size={24} /> {data.devClass}
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '40px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                                <Star size={32} color="#fbbf24" />
                                <span style={{ fontSize: '3rem', fontWeight: 700 }}>{data.impact.totalStars}</span>
                            </div>
                            <div style={{ color: '#cbd5e1', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Total Stars</div>
                        </div>

                        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '24px', flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                                <Activity size={32} color="#10b981" />
                                <span style={{ fontSize: '3rem', fontWeight: 700 }}>{data.rhythm.totalCommits}</span>
                            </div>
                            <div style={{ color: '#cbd5e1', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Recent Commits</div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Top Languages List */}
                <div style={{ width: '400px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '40px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.8rem', margin: '0 0 30px 0', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '16px' }}>Top Languages</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                        {data.languages.slice(0, 5).map((lang, idx) => (
                            <div key={lang.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '1.4rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: COLORS[idx % COLORS.length] }}></div>
                                    <span style={{ fontWeight: 600 }}>{lang.name}</span>
                                </div>
                                <span style={{ color: '#cbd5e1' }}>{lang.count} repos</span>
                            </div>
                        ))}
                        {data.languages.length === 0 && (
                            <div style={{ color: '#cbd5e1', fontStyle: 'italic', fontSize: '1.2rem' }}>No language data found.</div>
                        )}
                    </div>

                    <div style={{ alignSelf: 'center', padding: '12px 24px', background: 'rgba(6, 182, 212, 0.1)', color: '#06b6d4', borderRadius: '20px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                        {data.rhythm.persona}
                    </div>
                </div>

            </div>
        </div>
    );
});

export default ShareCard;
