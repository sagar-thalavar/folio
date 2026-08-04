import React from 'react';
import { Cpu, Code2, Users } from 'lucide-react';

const WhatIDo: React.FC = () => {
  return (
    <section className="panel glass" style={{ padding: '36px', borderRadius: 'var(--radius-xl)' }}>
      <div className="section-header" style={{ marginBottom: '24px' }}>
        <h2>What I Do</h2>
        <p className="section-subtitle" style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
          Core technical domains and capabilities I focus on daily.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
        {/* Pillar 1: AI Development */}
        <div 
          className="glass-hover"
          style={{
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            background: 'var(--card-bg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.1)', color: '#10B981' }}>
              <Cpu size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--text-primary)' }}>
              AI Development
            </h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Building practical AI apps, chatbots, automation tools, and LLM-powered software using modern APIs and frameworks.
          </p>
        </div>

        {/* Pillar 2: Software Engineering */}
        <div 
          className="glass-hover"
          style={{
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            background: 'var(--card-bg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.1)', color: '#3B82F6' }}>
              <Code2 size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--text-primary)' }}>
              Software Engineering
            </h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Building modern full-stack web applications, REST/GraphQL APIs, interactive dashboards, and developer tools.
          </p>
        </div>

        {/* Pillar 3: 1-on-1 Mentorship */}
        <div 
          className="glass-hover"
          style={{
            padding: '24px',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            background: 'var(--card-bg)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)', margin: 0, color: 'var(--text-primary)' }}>
              1-on-1 Mentorship
            </h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            Helping students and developers through practical live debugging, portfolio reviews, and technical guidance.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhatIDo;
