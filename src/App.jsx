import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github, Search, Activity, Star, Code, GitFork,
  MapPin, Link as LinkIcon, Users, Calendar, Award
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import './index.css';

import { fetchAllUserData } from './services/githubService';
import {
  processLanguageData,
  processActivityRhythm,
  processImpactIndex,
  determineDeveloperClass
} from './utils/dataProcessor';
import AuraGenerator from './components/AuraGenerator';

const COLORS = ['#8b5cf6', '#06b6d4', '#f43f5e', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#84cc16'];

function App() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const rawData = await fetchAllUserData(username);

      const languages = processLanguageData(rawData.repos);
      const rhythm = processActivityRhythm(rawData.events);
      const impact = processImpactIndex(rawData.repos);
      const devClass = determineDeveloperClass(rawData.profile, impact.totalStars, rhythm.totalCommits);

      setData({
        profile: rawData.profile,
        languages,
        rhythm,
        impact,
        devClass
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: data ? '40px' : '10vh', transition: 'margin 0.5s ease' }}
      >
        <motion.div
          animate={data ? { scale: 0.8, marginBottom: '-10px' } : { scale: 1 }}
        >
          <Github size={data ? 40 : 56} style={{ margin: '0 auto', color: 'var(--accent-primary)', transition: 'all 0.5s ease' }} />
          <h1 style={{ fontSize: data ? '2.5rem' : '3.5rem', margin: '16px 0 8px', transition: 'all 0.5s ease' }}>
            GitHub <span className="text-gradient">Visualizer</span>
          </h1>
          {!data && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
              Discover the beauty in your code contributions
            </p>
          )}
        </motion.div>
      </motion.div>

      <motion.form
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSearch}
        style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '40px' }}
      >
        <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
          <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Enter a GitHub username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', paddingLeft: '48px', height: '48px' }}
          />
        </div>
        <button type="submit" className="btn-primary" disabled={loading} style={{ display: 'flex', alignItems: 'center', gap: '8px', height: '48px' }}>
          {loading ? <div className="loader" /> : 'Visualize'}
        </button>
      </motion.form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            style={{ color: '#ef4444', textAlign: 'center', marginBottom: '20px', padding: '16px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.3)' }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {data && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}
        >
          {/* Profile Header Card */}
          <motion.div variants={itemVariants} className="glass glass-panel" style={{ display: 'flex', gap: '24px', alignItems: 'center', flexWrap: 'wrap' }}>
            <img
              src={data.profile.avatar_url}
              alt={data.profile.login}
              style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--glass-border)' }}
            />
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                <div>
                  <h2 style={{ fontSize: '2rem', margin: 0 }}>{data.profile.name || data.profile.login}</h2>
                  <a href={data.profile.html_url} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-secondary)', textDecoration: 'none', fontSize: '1.1rem' }}>@{data.profile.login}</a>
                </div>
                <div style={{ background: 'var(--accent-gradient)', padding: '6px 16px', borderRadius: '20px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <Award size={18} /> {data.devClass}
                </div>
              </div>

              <p style={{ color: 'var(--text-secondary)', marginTop: '12px', fontSize: '1.1rem' }}>
                {data.profile.bio || "This user hasn't added a bio yet."}
              </p>

              <div style={{ display: 'flex', gap: '16px', marginTop: '16px', flexWrap: 'wrap', color: 'var(--text-secondary)' }}>
                {data.profile.location && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={16} /> {data.profile.location}</span>}
                {data.profile.company && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Users size={16} /> {data.profile.company}</span>}
                {data.profile.blog && <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><LinkIcon size={16} /> <a href={data.profile.blog.startsWith('http') ? data.profile.blog : `https://${data.profile.blog}`} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{data.profile.blog}</a></span>}
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={16} /> Joined {new Date(data.profile.created_at).getFullYear()}</span>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { label: 'Public Repos', value: data.profile.public_repos, icon: <Github size={24} color="#8b5cf6" /> },
              { label: 'Total Stars', value: data.impact.totalStars, icon: <Star size={24} color="#fbbf24" /> },
              { label: 'Followers', value: data.profile.followers, icon: <Users size={24} color="#06b6d4" /> },
              { label: 'Recent Commits', value: data.rhythm.totalCommits, icon: <Activity size={24} color="#10b981" /> }
            ].map((stat, i) => (
              <motion.div key={i} variants={itemVariants} className="glass glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px' }}>
                <div style={{ padding: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>{stat.icon}</div>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{stat.value}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            {/* Language Galaxy */}
            <motion.div variants={itemVariants} className="glass glass-panel" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', margin: 0 }}>
                  <Code size={20} color="var(--accent-primary)" /> Language Galaxy
                </h3>
                {data.languages.length > 0 && <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Top: {data.languages[0].name}</span>}
              </div>

              {data.languages.length > 0 ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
                  <div style={{ flex: 1, minHeight: 0 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                        <Pie
                          data={data.languages.slice(0, 8)}
                          cx="50%"
                          cy="50%"
                          innerRadius={75}
                          outerRadius={105}
                          paddingAngle={2}
                          minAngle={15}
                          dataKey="value"
                          stroke="none"
                        >
                          {data.languages.slice(0, 8).map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                          itemStyle={{ color: '#fff' }}
                          formatter={(value, name, props) => {
                            const item = props.payload;
                            return [`${item.count} repos`, "Repos"];
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  {/* Legend below */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginTop: '16px' }}>
                    {data.languages.slice(0, 8).map((lang, idx) => (
                      <div key={lang.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: COLORS[idx % COLORS.length] }}></div>
                        {lang.name}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>No language data found</div>
              )}
            </motion.div>

            {/* Activity Rhythm */}
            <motion.div variants={itemVariants} className="glass glass-panel" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', margin: 0 }}>
                  <Activity size={20} color="var(--accent-secondary)" /> Activity Rhythm
                </h3>
                <span style={{ padding: '4px 12px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--accent-secondary)', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                  {data.rhythm.persona}
                </span>
              </div>

              <div style={{ flex: 1, minHeight: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.rhythm.chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.8} />
                        <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--glass-border)" vertical={false} />
                    <XAxis dataKey="hour" stroke="var(--text-secondary)" tick={{ fontSize: 13, fontWeight: 500 }} tickLine={false} axisLine={false} />
                    <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 13, fontWeight: 500 }} tickLine={false} axisLine={false} />
                    <Tooltip
                      contentStyle={{ background: 'var(--surface-color)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: 'white' }}
                      labelStyle={{ color: 'var(--text-secondary)', marginBottom: '4px' }}
                    />
                    <Area type="monotone" dataKey="commits" stroke={COLORS[1]} fillOpacity={1} fill="url(#colorCommits)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
            {/* Top Repositories */}
            <motion.div variants={itemVariants} className="glass glass-panel">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.2rem', margin: '0 0 24px 0' }}>
                <Star size={20} color="#fbbf24" /> Highest Impact Repositories
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.impact.mostStarred.map((repo, idx) => (
                  <a
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <div style={{
                      padding: '16px',
                      background: 'rgba(255,255,255,0.02)',
                      borderRadius: '12px',
                      border: '1px solid var(--glass-border)',
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.4)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'var(--accent-primary)', wordBreak: 'break-all', paddingRight: '12px' }}>{repo.name}</div>
                        <div style={{ display: 'flex', gap: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem', flexShrink: 0 }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Star size={14} color="#fbbf24" /> {repo.stargazers_count}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><GitFork size={14} /> {repo.forks_count}</span>
                        </div>
                      </div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {repo.description || "No description provided."}
                      </div>
                      {repo.language && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '12px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-secondary)' }}></div>
                          {repo.language}
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
            {/* Developer Aura Component */}
            <motion.div variants={itemVariants} style={{ minHeight: '400px' }}>
              <AuraGenerator data={data} />
            </motion.div>
          </div>

        </motion.div>
      )}
    </div>
  );
}

export default App;
