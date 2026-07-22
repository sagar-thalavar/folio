import React, { useState } from 'react';
import { Gamepad2, CheckCircle2, Circle, Plus, AlertTriangle } from 'lucide-react';

interface PlaygroundItem {
  id: string;
  title: string;
  subtitle: string;
  progress: number;
  color: string;
  description: string;
  tasks: { text: string; completed: boolean }[];
}

const initialItems: PlaygroundItem[] = [
  {
    id: "mobile-detox",
    title: "Mobile Detox application",
    subtitle: "Screen time tracker & app blocker",
    progress: 0,
    color: "#F4C39D", // Peach
    description: "An experimental web application designed to help users limit screen time, block distracting apps, and cultivate better focus through gamified digital wellness tools.",
    tasks: [
      { text: "UI wireframes & layout design", completed: false },
      { text: "Core screen-time tracking API integration", completed: false },
      { text: "App locking and session scheduler logic", completed: false },
      { text: "Gamification & rewards system implementation", completed: false },
      { text: "Local storage state sync & dashboard metrics", completed: false }
    ]
  }
];

const Playground: React.FC = () => {
  const [items] = useState<PlaygroundItem[]>(initialItems);
  const [activeTab, setActiveTab] = useState<string>("mobile-detox");

  const currentItem = items.find(item => item.id === activeTab) || items[0];

  return (
    <section className="panel playground-panel glass">
      <div className="section-header">
        <div className="section-title-group">
          <Gamepad2 className="section-icon" size={24} />
          <h2>Sagar's Playground</h2>
        </div>
        <p className="section-subtitle">
          A development sandbox for exploring random features, experimental tech, and workflow spikes.
        </p>
      </div>

      <div className="playground-layout">
        {/* Left Sidebar Pane */}
        <aside className="playground-sidebar">
          <div className="sidebar-header">
            <h3>Active Spikes</h3>
            <span className="spike-count">{items.length}</span>
          </div>
          
          <div className="tab-list">
            {items.map((item) => {
              const isActive = item.id === activeTab;
              return (
                <button
                  key={item.id}
                  className={`tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(item.id)}
                  style={
                    isActive 
                      ? { 
                          borderLeftColor: item.color,
                          backgroundColor: `${item.color}0c`
                        } 
                      : undefined
                  }
                >
                  <div className="tab-btn-title">
                    <span 
                      className="indicator-dot" 
                      style={{ backgroundColor: item.color }}
                    ></span>
                    <h4>{item.title}</h4>
                  </div>
                  <div className="tab-btn-meta">
                    <span className="badge-text">{item.subtitle}</span>
                    <span className="progress-value">{item.progress}%</span>
                  </div>
                </button>
              );
            })}

            <button className="add-spike-btn" disabled>
              <Plus size={16} />
              <span>Create New Spike</span>
            </button>
          </div>
        </aside>

        {/* Right Workspace Pane */}
        <main className="playground-workspace glass-hover">
          <header className="workspace-header">
            <div className="title-group">
              <span 
                className="category-pill"
                style={{ 
                  backgroundColor: `${currentItem.color}1a`, 
                  color: currentItem.color,
                  borderColor: `${currentItem.color}33`
                }}
              >
                In Planning
              </span>
              <h2>{currentItem.title}</h2>
              <p className="subtitle">{currentItem.subtitle}</p>
            </div>
            
            <div className="progress-card">
              <div className="progress-info">
                <span>Overall Progress</span>
                <span className="progress-num" style={{ color: currentItem.color }}>
                  {currentItem.progress}%
                </span>
              </div>
              <div className="progress-bar-track">
                <div 
                  className="progress-bar-fill" 
                  style={{ 
                    width: `${currentItem.progress}%`,
                    backgroundColor: currentItem.color
                  }}
                ></div>
              </div>
            </div>
          </header>

          <div className="workspace-body">
            <div className="desc-section">
              <h3>Description</h3>
              <p>{currentItem.description}</p>
            </div>

            <div className="checklist-section">
              <div className="checklist-header">
                <h3>Feature Checklist</h3>
                <span>{currentItem.tasks.filter(t => t.completed).length} / {currentItem.tasks.length} done</span>
              </div>
              
              <ul className="task-list">
                {currentItem.tasks.map((task, idx) => (
                  <li key={idx} className={`task-item ${task.completed ? 'completed' : ''}`}>
                    {task.completed ? (
                      <CheckCircle2 size={18} className="icon-done" />
                    ) : (
                      <Circle size={18} className="icon-todo" />
                    )}
                    <span>{task.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="sandbox-info-banner">
              <AlertTriangle size={18} />
              <p>This is a sandboxed display. You can edit this workspace file to start building the actual application UI here in React!</p>
            </div>
          </div>
        </main>
      </div>
    </section>
  );
};

export default Playground;
