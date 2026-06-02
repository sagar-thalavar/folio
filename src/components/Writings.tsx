import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Post } from '../types/blog';
import { renderMarkdown } from '../lib/markdown';
import { BookOpen, Calendar, Clock, AlertCircle } from 'lucide-react';

const Writings: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPostId, setExpandedPostId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchPosts() {
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase
          .from('posts')
          .select('*')
          .eq('published', true)
          .order('created_at', { ascending: false });

        if (dbError) throw dbError;

        if (isMounted) {
          setPosts(data || []);
        }
      } catch (err: unknown) {
        console.error('Error fetching articles:', err);
        if (isMounted) {
          let msg = 'Failed to connect to database.';
          if (err && typeof err === 'object' && 'message' in err) {
            msg = String(err.message);
          } else if (err instanceof Error) {
            msg = err.message;
          }
          setError(msg);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const handleToggleExpand = (id: string) => {
    setExpandedPostId(prev => (prev === id ? null : id));
  };

  return (
    <section className="panel writings-panel glass">
      <div className="section-header">
        <div className="section-title-group">
          <BookOpen className="section-icon" size={24} />
          <h2>Writings & Thoughts</h2>
        </div>
        <p className="section-subtitle">
          Notes, experiences, and technical guides that I share.
        </p>
      </div>

      {loading ? (
        <div className="writings-state-container">
          <div className="loading-spinner"></div>
          <p>Fetching thoughts from database...</p>
        </div>
      ) : error ? (
        <div className="writings-state-container error">
          <AlertCircle className="error-icon" size={20} />
          <p>{error}</p>
          <small className="error-helper">
            If this is a new setup, ensure your Supabase credentials are configured in your local environment.
          </small>
        </div>
      ) : posts.length === 0 ? (
        <div className="writings-state-container empty">
          <p>No thoughts or articles have been published yet.</p>
          <small className="empty-helper">Log in through the admin panel to publish your first post!</small>
        </div>
      ) : (
        <div className="writings-list">
          {posts.map((post) => {
            const isExpanded = expandedPostId === post.id;
            return (
              <article 
                key={post.id} 
                className={`writing-card glass-hover ${isExpanded ? 'expanded' : ''}`}
                onClick={() => !isExpanded && handleToggleExpand(post.id)}
                style={{ cursor: isExpanded ? 'default' : 'pointer' }}
              >
                <div className="writing-card-meta">
                  <span className="meta-item">
                    <Calendar size={13} />
                    <span>{formatDate(post.created_at)}</span>
                  </span>
                  <span className="meta-item">
                    <Clock size={13} />
                    <span>{post.reading_time} min read</span>
                  </span>
                </div>
                
                <h3 className="writing-card-title">{post.title}</h3>
                <p className="writing-card-excerpt">{post.excerpt}</p>
                
                {isExpanded && (
                  <div className="writing-card-content">
                    {renderMarkdown(post.content)}
                  </div>
                )}
                
                {post.tags && post.tags.length > 0 && (
                  <div className="writing-card-tags">
                    {post.tags.map((tag) => (
                      <span key={tag} className="tag-pill">
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
                
                <button 
                  type="button"
                  className="btn-read-more"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent duplicate triggers if clicking the card background
                    handleToggleExpand(post.id);
                  }}
                  style={{ marginTop: isExpanded ? '16px' : '8px' }}
                >
                  {isExpanded ? '← Close Article' : 'Read Article →'}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Writings;

