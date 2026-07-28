import React, { useState } from 'react';
import { Wrench, CheckCircle2, Circle, Smartphone, Code2 } from 'lucide-react';

interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  color: string;
  description: string;
  tasks: { text: string; completed: boolean }[];
  tag: string;
}

const initialTools: ToolItem[] = [
  {
    id: "mobile-detox",
    title: "Mobile Detox Application",
    subtitle: "Screen time tracker & focus app blocker",
    progress: 35,
    color: "#F4C39D",
    tag: "Wellness Spike",
    description: "An experimental web application designed to help users limit screen time, block distracting apps, and cultivate focus through gamified digital wellness tools.",
    tasks: [
      { text: "UI wireframes & layout design", completed: true },
      { text: "Core screen-time tracking API integration", completed: true },
      { text: "App locking and session scheduler logic", completed: false },
      { text: "Gamification & rewards system implementation", completed: false },
      { text: "Local storage state sync & dashboard metrics", completed: false }
    ]
  },
  {
    id: "csv-analyzer",
    title: "Interactive CSV & Data Inspector",
    subtitle: "In-browser data visualization tool",
    progress: 90,
    color: "#98D8AA",
    tag: "Data Utility",
    description: "Lightweight client-side CSV analyzer providing instant summary statistics, column type inference, and interactive chart generation without uploading data to external servers.",
    tasks: [
      { text: "Fast CSV parsing engine", completed: true },
      { text: "Automatic column type detection", completed: true },
      { text: "Summary metrics & histogram rendering", completed: true },
      { text: "Export clean data options", completed: false }
    ]
  }
];

const TinyTools: React.FC = () => {
  const [tools] = useState<ToolItem[]>(initialTools);
  const [activeToolId, setActiveToolId] = useState<string>("mobile-detox");

  const activeTool = tools.find(t => t.id === activeToolId) || tools[0];

  return (
    <section className="panel tiny-tools-panel glass" style={{ marginTop: '36px', padding: '28px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(244, 195, 157, 0.15)', color: '#F4C39D' }}>
            <Wrench size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)', margin: 0 }}>Tiny Tools & Spikes</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '2px 0 0' }}>
              Experimental developer utilities, micro-apps, and workflow spikes.
            </p>
          </div>
        </div>
        <span style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '99px', background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-muted)' }}>
          {tools.length} Micro-Apps
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
        {tools.map((tool) => {
          const isActive = tool.id === activeToolId;
          return (
            <div
              key={tool.id}
              onClick={() => setActiveToolId(tool.id)}
              className="glass-hover"
              style={{
                padding: '20px',
                borderRadius: '16px',
                border: isActive ? `2px solid ${tool.color}` : '1px solid var(--card-border)',
                background: isActive ? `${tool.color}0d` : 'var(--card-bg)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: tool.color, background: `${tool.color}1a`, padding: '2px 8px', borderRadius: '99px' }}>
                  {tool.tag}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{tool.progress}%</span>
              </div>
              <h3 style={{ fontSize: '1.1rem', margin: '4px 0', color: 'var(--text-primary)' }}>{tool.title}</h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: 0, lineHeight: 1.4 }}>{tool.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Selected Tool Details Drawer */}
      <div style={{ marginTop: '24px', padding: '20px', borderRadius: '16px', border: '1px solid var(--card-border)', background: 'var(--card-bg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          {activeTool.id === 'mobile-detox' ? <Smartphone size={20} color={activeTool.color} /> : <Code2 size={20} color={activeTool.color} />}
          <h3 style={{ fontSize: '1.15rem', margin: 0, color: 'var(--text-primary)' }}>{activeTool.title} Overview</h3>
        </div>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-secondary)', marginBottom: '16px' }}>
          {activeTool.description}
        </p>

        <div style={{ borderTop: '1px solid var(--card-border)', paddingTop: '14px' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Spike Checklist ({activeTool.tasks.filter(t => t.completed).length}/{activeTool.tasks.length} Done)
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
            {activeTool.tasks.map((task, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: task.completed ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                {task.completed ? <CheckCircle2 size={16} color="#10B981" /> : <Circle size={16} color="var(--text-muted)" />}
                <span>{task.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TinyTools;
