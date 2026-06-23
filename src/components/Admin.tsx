import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
import type { Post } from '../types/blog';
import { renderMarkdown } from '../lib/markdown';
import { navigate } from '../lib/navigation';
import { 
  Key, LogOut, ArrowLeft, Plus, Edit3, Trash2, 
  Eye, FileText, CheckCircle, AlertCircle, Save 
} from 'lucide-react';

const Admin: React.FC = () => {
  // Auth state
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Articles state
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError, setPostsError] = useState<string | null>(null);

  // Editor state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [published, setPublished] = useState(true);
  const [editorError, setEditorError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Tab state (write vs manage)
  const [activeTab, setActiveTab] = useState<'manage' | 'editor'>('manage');

  // Lifecycle references to prevent memory leaks on unmount
  const isMountedRef = useRef(true);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  // Fetch all posts (published and drafts) when authenticated
  const fetchAdminPosts = async () => {
    try {
      if (isMountedRef.current) setPostsLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (isMountedRef.current) setPosts(data || []);
    } catch (err: unknown) {
      console.error('Error fetching admin posts:', err);
      let msg = 'Failed to load posts.';
      if (err && typeof err === 'object' && 'message' in err) {
        msg = String(err.message);
      } else if (err instanceof Error) {
        msg = err.message;
      }
      if (isMountedRef.current) setPostsError(msg);
    } finally {
      if (isMountedRef.current) setPostsLoading(false);
    }
  };

  // Monitor auth state on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (isMountedRef.current) setSession(currentSession);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (isMountedRef.current) setSession(newSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch posts when session is populated
  useEffect(() => {
    if (!session) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchAdminPosts();
  }, [session]);

  // Handler for title change that auto-generates slug
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!isEditing) {
      const generated = newTitle
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove non-word characters
        .replace(/\s+/g, '-')     // Replace spaces with hyphens
        .replace(/--+/g, '-')     // Collapse multiple hyphens
        .trim();
      setSlug(generated);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isMountedRef.current) {
        setLoginLoading(true);
        setAuthError(null);
      }
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err: unknown) {
      console.error('Authentication failure:', err);
      let msg = 'Invalid email or password.';
      if (err && typeof err === 'object' && 'message' in err) {
        msg = String(err.message);
      } else if (err instanceof Error) {
        msg = err.message;
      }
      if (isMountedRef.current) setAuthError(msg);
    } finally {
      if (isMountedRef.current) setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    if (isMountedRef.current) {
      setSession(null);
      setEmail('');
      setPassword('');
    }
  };

  const resetForm = () => {
    if (isMountedRef.current) {
      setIsEditing(false);
      setEditingId(null);
      setTitle('');
      setSlug('');
      setExcerpt('');
      setContent('');
      setTagsInput('');
      setPublished(true);
      setEditorError(null);
    }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !excerpt.trim()) {
      if (isMountedRef.current) setEditorError('Title, Excerpt, and Content are required fields.');
      return;
    }

    try {
      if (isMountedRef.current) {
        setSaveLoading(true);
        setEditorError(null);
        setSaveSuccess(false);
      }

      // Parse tags
      const tags = tagsInput
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      // Auto-calculate reading time
      const words = content.trim().split(/\s+/).filter(w => w.length > 0).length;
      const reading_time = Math.max(1, Math.ceil(words / 200));

      const postData = {
        title,
        slug,
        excerpt,
        content,
        tags,
        reading_time,
        published,
        updated_at: new Date().toISOString(),
      };

      if (isEditing && editingId) {
        // Update query
        const { error } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', editingId);

        if (error) throw error;
      } else {
        // Insert query
        const { error } = await supabase
          .from('posts')
          .insert([postData]);

        if (error) throw error;
      }

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (isMountedRef.current) setSaveSuccess(true);
      
      saveTimeoutRef.current = setTimeout(() => {
        if (isMountedRef.current) setSaveSuccess(false);
      }, 3000);
      
      // Refresh list and reset form
      await fetchAdminPosts();
      if (isMountedRef.current) {
        resetForm();
        setActiveTab('manage');
      }
    } catch (err: unknown) {
      console.error('Error saving post:', err);
      let msg = 'Failed to save post. Verify slug uniqueness.';
      if (err && typeof err === 'object' && 'message' in err) {
        msg = String(err.message);
      } else if (err instanceof Error) {
        msg = err.message;
      }
      if (isMountedRef.current) setEditorError(msg);
    } finally {
      if (isMountedRef.current) setSaveLoading(false);
    }
  };

  const startEdit = (post: Post) => {
    setIsEditing(true);
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setTagsInput(post.tags ? post.tags.join(', ') : '');
    setPublished(post.published);
    setActiveTab('editor');
  };

  const handleDelete = async (id: string, postTitle: string) => {
    if (!window.confirm(`Are you sure you want to delete "${postTitle}"?`)) return;

    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchAdminPosts();
    } catch (err: unknown) {
      console.error('Error deleting post:', err);
      let msg = 'Delete failed.';
      if (err && typeof err === 'object' && 'message' in err) {
        msg = String(err.message);
      } else if (err instanceof Error) {
        msg = err.message;
      }
      alert(msg);
    }
  };

  const handleBackToPortfolio = () => {
    navigate('/');
  };

  // RENDER LOGIN SCREEN (UNAUTHENTICATED)

  if (!session) {
    return (
      <section className="admin-container glass">
        <button className="back-link" onClick={handleBackToPortfolio}>
          <ArrowLeft size={16} />
          <span>Back to Portfolio</span>
        </button>

        <div className="admin-login-card">
          <div className="login-header">
            <Key className="login-icon" size={32} />
            <h2>Sagar's CMS Login</h2>
            <p className="login-subtitle">Authenticate to manage thoughts and articles securely.</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {authError && (
              <div className="admin-message error">
                <AlertCircle size={16} />
                <span>{authError}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="email">Admin Email</label>
              <input
                id="email"
                type="email"
                required
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn-login" disabled={loginLoading}>
              {loginLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </section>
    );
  }

  // RENDER DASHBOARD (AUTHENTICATED)
  return (
    <section className="admin-dashboard-container glass">
      {/* Top Navigation */}
      <header className="dashboard-header">
        <div className="dashboard-title-group">
          <h1>Sagar's Workspace</h1>
          <span className="auth-badge">Secure Session Live</span>
        </div>
        <div className="dashboard-actions">
          <button className="btn-secondary" onClick={handleBackToPortfolio}>
            <ArrowLeft size={16} />
            <span>Go to Site</span>
          </button>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Tabs Menu */}
      <nav className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => { setActiveTab('manage'); resetForm(); }}
        >
          <FileText size={18} />
          <span>Manage Articles ({posts.length})</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'editor' ? 'active' : ''}`}
          onClick={() => { resetForm(); setActiveTab('editor'); }}
        >
          <Plus size={18} />
          <span>Write New Post</span>
        </button>
      </nav>

      <hr className="dashboard-divider" />

      {/* RENDER ACTIVE TAB */}
      {activeTab === 'manage' ? (
        <div className="tab-panel manage-panel">
          {postsLoading ? (
            <div className="dashboard-state">
              <div className="loading-spinner"></div>
              <p>Fetching all files from server...</p>
            </div>
          ) : postsError ? (
            <div className="dashboard-state error">
              <AlertCircle size={24} />
              <p>{postsError}</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="dashboard-state empty">
              <p>No writings created yet. Let's write one!</p>
              <button 
                className="btn-primary" 
                onClick={() => { resetForm(); setActiveTab('editor'); }}
                style={{ marginTop: '16px' }}
              >
                Create your first article
              </button>
            </div>
          ) : (
            <div className="admin-posts-list">
              {posts.map((post) => (
                <div key={post.id} className="admin-post-row glass">
                  <div className="admin-post-row-info">
                    <div className="title-row">
                      <h3>{post.title}</h3>
                      <span className={`status-badge ${post.published ? 'published' : 'draft'}`}>
                        {post.published ? 'Live' : 'Draft'}
                      </span>
                    </div>
                    <p className="slug-text">slug: <code>/{post.slug}</code></p>
                    <p className="excerpt-text">{post.excerpt}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="tags-row">
                        {post.tags.map(t => <span key={t} className="tag-pill">#{t}</span>)}
                      </div>
                    )}
                  </div>
                  
                  <div className="admin-post-row-actions">
                    <button className="btn-edit" onClick={() => startEdit(post)}>
                      <Edit3 size={16} />
                      <span>Edit</span>
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(post.id, post.title)}>
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="tab-panel editor-panel">
          <form onSubmit={handleSavePost} className="editor-form">
            
            {editorError && (
              <div className="admin-message error">
                <AlertCircle size={16} />
                <span>{editorError}</span>
              </div>
            )}
            
            {saveSuccess && (
              <div className="admin-message success">
                <CheckCircle size={16} />
                <span>Article successfully saved!</span>
              </div>
            )}

            <div className="editor-columns">
              {/* Write Side */}
              <div className="editor-fields flex-col">
                <div className="form-group">
                  <label htmlFor="post-title">Article Title</label>
                  <input
                    id="post-title"
                    type="text"
                    required
                    placeholder="e.g. My Experience with Supabase Row Level Security"
                    value={title}
                    onChange={handleTitleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="post-slug">URL Slug</label>
                  <input
                    id="post-slug"
                    type="text"
                    required
                    placeholder="auto-generated-slug-path"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                  <small className="field-helper">Standard clean URL mapping path.</small>
                </div>

                <div className="form-group">
                  <label htmlFor="post-excerpt">Excerpt (Short Summary)</label>
                  <textarea
                    id="post-excerpt"
                    required
                    rows={2}
                    placeholder="Summarize your thoughts in 1-2 short sentences for page cards..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="post-tags">Tags (comma-separated)</label>
                  <input
                    id="post-tags"
                    type="text"
                    placeholder="React, Supabase, Security, WebDev"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                  />
                  <small className="field-helper">Separated by commas.</small>
                </div>

                <div className="form-group checkbox-group">
                  <label className="switch-container">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                    />
                    <span className="switch-label">Publish live to website feed</span>
                  </label>
                </div>

                <div className="form-group">
                  <label htmlFor="post-content">Content (Markdown syntax supported)</label>
                  <textarea
                    id="post-content"
                    required
                    rows={12}
                    placeholder="Write your article body here. Supports standard Markdown elements: ## Headers, - Lists, **Bold**, `Code`..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="code-textarea"
                  />
                </div>

                <div className="editor-submit-row">
                  <button type="submit" className="btn-primary" disabled={saveLoading}>
                    <Save size={16} />
                    <span>{saveLoading ? 'Saving...' : isEditing ? 'Update Post' : 'Publish Post'}</span>
                  </button>
                  <button 
                    type="button" 
                    className="btn-secondary" 
                    onClick={() => { resetForm(); setActiveTab('manage'); }}
                  >
                    Cancel
                  </button>
                </div>
              </div>

              {/* Preview Side */}
              <div className="editor-preview flex-col">
                <div className="preview-header">
                  <Eye size={16} />
                  <span>Live Rendering Preview</span>
                </div>
                
                <div className="preview-pane glass">
                  {title ? (
                    <div className="modal-header" style={{ padding: 0 }}>
                      <h1 className="modal-title" style={{ fontSize: '2rem' }}>{title}</h1>
                      <div className="modal-meta" style={{ marginTop: '8px' }}>
                        <span className="meta-item">
                          <span>Estimating: {Math.max(1, Math.ceil(content.trim().split(/\s+/).filter(w => w.length > 0).length / 200))} min read</span>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Article title preview...</p>
                  )}
                  
                  <hr className="modal-divider" style={{ margin: '16px 0' }} />
                  
                  <div className="modal-body" style={{ padding: 0 }}>
                    {content ? (
                      renderMarkdown(content)
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>Write content in the text editor area to preview formatting in real time.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default Admin;
