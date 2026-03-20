'use client';

import React, { useState, useRef, useCallback, use } from 'react';
import type { Division, ContentStatus } from '@/lib/supabase/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType = 'blog_post' | 'faq' | 'case_study' | 'announcement';

interface ContentItem {
  id: string;
  type: ContentType;
  division: Division | 'parent';
  title: string;
  slug: string | null;
  status: ContentStatus;
  author: string;
  published_at: string | null;
  created_at: string;
  body: { excerpt: string; text?: string };
}

// ─── Shared mock data ─────────────────────────────────────────────────────────

const MOCK_CONTENT: ContentItem[] = [
  {
    id: 'cnt1',
    type: 'blog_post',
    division: 'labs' as const,
    title: 'How AI Agents Are Replacing Dev Teams (And What That Means For You)',
    slug: 'ai-agents-replacing-dev-teams',
    status: 'published' as const,
    author: 'Kamrul Hasan',
    published_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    body: { excerpt: "The landscape of software development is shifting fast. Here's what founders need to know.", text: "The landscape of software development is shifting fast. Here's what founders need to know.\n\nAI agents are no longer science fiction — they're writing production code, reviewing pull requests, and shipping features at a pace human teams can't match alone. But they need architects. Engineers who understand *when* to trust the AI, and when to override it.\n\n## What This Means For Founders\n\nIf you're building a product in 2026, you have two realistic options:\n\n- Hire a traditional dev team and pay $20K+/month\n- Work with an AI-native team like SocioFi that moves faster for a fraction of the cost\n\nThe second option isn't 'cheaper and worse'. It's genuinely how modern software gets built." },
  },
  {
    id: 'cnt2',
    type: 'faq',
    division: 'studio' as const,
    title: 'Studio FAQ — Project Process & Pricing',
    slug: null,
    status: 'published' as const,
    author: 'Arifur Rahman',
    published_at: new Date(Date.now() - 86400000 * 14).toISOString(),
    created_at: new Date(Date.now() - 86400000 * 16).toISOString(),
    body: { excerpt: 'Common questions about how Studio projects work, timeline, pricing and handoffs.', text: 'Common questions about how Studio projects work, timeline, pricing and handoffs.\n\n## How long does a typical project take?\n\nMost builds run 4–8 weeks from kickoff to handoff. Rescue projects (existing codebases) can be faster because we\'re not starting from zero.\n\n## What do I need to bring?\n\nJust your idea and access to your existing code (if any). We handle the rest: design, architecture, development, deployment.\n\n## Do you do fixed-price or hourly?\n\nFixed-price, scoped in advance. No surprise invoices.' },
  },
  {
    id: 'cnt3',
    type: 'blog_post',
    division: 'parent' as const,
    title: "SocioFi Technology: How We're Building the AI-Native Dev Team",
    slug: 'ai-native-dev-team',
    status: 'draft' as const,
    author: 'Arifur Rahman',
    published_at: null,
    created_at: new Date(Date.now() - 86400000 * 1).toISOString(),
    body: { excerpt: "We started SocioFi with a simple belief: great software shouldn't require a 10-person engineering team.", text: "We started SocioFi with a simple belief: great software shouldn't require a 10-person engineering team.\n\nKamrul and I have spent the last decade building software for companies ranging from Dhaka startups to London fintechs. The pattern was always the same: clients with great ideas, blocked by the cost and complexity of building an engineering team.\n\n## The AI Shift Changes Everything\n\nWhen AI coding tools started producing genuinely usable code, we saw the opportunity immediately. Not to replace engineers — but to make a small, senior team perform like a team ten times its size.\n\nThat's what SocioFi is." },
  },
  {
    id: 'cnt4',
    type: 'case_study',
    division: 'studio' as const,
    title: 'From Broken MVP to $2M ARR: The FounderHQ Rescue Story',
    slug: 'founderhq-rescue',
    status: 'review' as const,
    author: 'Kamrul Hasan',
    published_at: null,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    body: { excerpt: 'James came to us with a React codebase nobody could maintain. Six weeks later, they shipped their Series A demo.', text: 'James came to us with a React codebase nobody could maintain. Six weeks later, they shipped their Series A demo.\n\n## The Problem\n\nFounderHQ had raised a pre-seed round and built an MVP with an offshore team. The code worked — barely. No tests, no documentation, components copied from StackOverflow, state management that made senior engineers wince.\n\nEvery new feature broke something else. The offshore team had moved on. James was stuck.\n\n## What We Did\n\n- Audited the full codebase in week 1\n- Identified the 20% of code causing 80% of bugs\n- Rebuilt the core state layer without touching the UI\n- Added a CI/CD pipeline and automated tests\n- Shipped the Series A demo in week 6\n\n## The Result\n\n$2M ARR 8 months post-rescue. James now has a stable foundation to hire his own engineering team onto.' },
  },
  {
    id: 'cnt5',
    type: 'announcement',
    division: 'parent' as const,
    title: 'Introducing SocioFi Agents: AI Development Agents On Demand',
    slug: 'introducing-agents',
    status: 'draft' as const,
    author: 'Arifur Rahman',
    published_at: null,
    created_at: new Date(Date.now() - 86400000 * 0.5).toISOString(),
    body: { excerpt: "Today we're launching Agents, our new division for autonomous AI development agents.", text: "Today we're launching Agents, our new division for autonomous AI development agents.\n\nAgents are AI-powered development workers that can be spun up on-demand for specific tasks: writing tests, refactoring modules, building integrations, generating documentation.\n\n## What Agents Can Do\n\n- **Code review** at scale — every PR reviewed before a human sees it\n- **Test generation** — coverage reports that actually mean something\n- **Integration builds** — connect your app to any API\n- **Documentation** — always up to date with your codebase\n\nAgents work alongside our human engineering team. When they hit a wall, a real engineer takes over." },
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function wordCount(text: string): number {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

function simpleMarkdownToHtml(md: string): string {
  let html = md
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)$/gm, '<li>$1</li>');

  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  const lines = html.split('\n');
  const result: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      result.push('');
    } else if (/^<(h[1-3]|ul|li|p)/.test(trimmed)) {
      result.push(trimmed);
    } else {
      result.push(`<p>${trimmed}</p>`);
    }
  }

  return result.join('\n');
}

// ─── Division / status config ─────────────────────────────────────────────────

const DIVISION_COLORS: Record<string, string> = {
  studio: '#72C4B2', services: '#4DBFA8', labs: '#7B6FE8', products: '#E8916F',
  academy: '#E8B84D', ventures: '#6BA3E8', cloud: '#5BB5E0', parent: '#4A6CB8', agents: '#8B5CF6',
};

const TYPE_LABELS: Record<ContentType, string> = {
  blog_post: 'Blog Post', faq: 'FAQ', case_study: 'Case Study', announcement: 'Announcement',
};

const CONTENT_TYPES: ContentType[] = ['blog_post', 'faq', 'case_study', 'announcement'];

const DIVISIONS: Array<Division | 'parent'> = [
  'parent', 'studio', 'services', 'labs', 'academy', 'ventures', 'cloud', 'agents',
];

// ─── Toolbar ──────────────────────────────────────────────────────────────────

type ToolAction = { label: string; prefix: string; suffix: string; block?: boolean };

const TOOLBAR_ACTIONS: (ToolAction | null)[] = [
  { label: 'B', prefix: '**', suffix: '**' },
  { label: 'I', prefix: '*', suffix: '*' },
  null,
  { label: 'H2', prefix: '## ', suffix: '', block: true },
  { label: 'H3', prefix: '### ', suffix: '', block: true },
  null,
  { label: '• List', prefix: '- ', suffix: '', block: true },
  { label: 'Code', prefix: '`', suffix: '`' },
];

function applyMarkdown(
  textarea: HTMLTextAreaElement,
  action: ToolAction,
  setText: (v: string) => void,
) {
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;
  const value = textarea.value;
  const selected = value.slice(start, end);

  let newText: string;
  let newStart: number;
  let newEnd: number;

  if (action.block) {
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const before = value.slice(0, lineStart);
    const after = value.slice(lineStart);
    newText = before + action.prefix + after;
    newStart = lineStart + action.prefix.length + (start - lineStart);
    newEnd = newStart + (end - start);
  } else {
    const wrapped = action.prefix + (selected || 'text') + action.suffix;
    newText = value.slice(0, start) + wrapped + value.slice(end);
    newStart = start + action.prefix.length;
    newEnd = newStart + (selected.length || 4);
  }

  setText(newText);
  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(newStart, newEnd);
  }, 0);
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
  .cmsf-page {
    min-height: 100%;
    display: flex; flex-direction: column; gap: 20px;
  }

  .cmsf-topbar {
    display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
    margin-bottom: 4px;
  }
  .cmsf-back {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 12px; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
    color: #6B7B9E; background: transparent;
    border: 1px solid rgba(89,163,146,0.1);
    cursor: pointer; text-decoration: none;
    transition: all 0.15s;
  }
  .cmsf-back:hover { color: #E2E8F0; border-color: rgba(89,163,146,0.25); }
  .cmsf-heading {
    font-family: 'Manrope', sans-serif; font-size: 18px; font-weight: 700;
    color: #E2E8F0; letter-spacing: -0.02em; flex: 1;
  }

  .cmsf-editor {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 16px; overflow: hidden;
    display: flex; flex-direction: column;
  }

  .cmsf-editor-header {
    padding: 18px 24px;
    border-bottom: 1px solid rgba(89,163,146,0.08);
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
  }
  .cmsf-editor-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 600; letter-spacing: 0.12em;
    text-transform: uppercase; color: #6B7B9E;
  }
  .cmsf-status-badge {
    display: inline-flex; align-items: center;
    padding: 3px 10px; border-radius: 8px;
    font-size: 12px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }
  .cmsf-preview-toggle {
    padding: 5px 12px; border-radius: 7px;
    font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1px solid rgba(89,163,146,0.15);
    background: transparent; color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .cmsf-preview-toggle:hover { color: #59A392; border-color: rgba(89,163,146,0.3); }
  .cmsf-preview-toggle.active { color: #59A392; border-color: rgba(89,163,146,0.3); background: rgba(89,163,146,0.06); }

  .cmsf-body { padding: 24px; display: flex; flex-direction: column; gap: 20px; }

  .cmsf-title-input {
    width: 100%; background: transparent; border: none; outline: none;
    font-family: 'Manrope', sans-serif; font-size: 26px; font-weight: 800;
    color: #E2E8F0; letter-spacing: -0.03em; line-height: 1.2;
    resize: none; padding: 0;
  }
  .cmsf-title-input::placeholder { color: #2E3655; }

  .cmsf-meta-row {
    display: flex; gap: 10px; flex-wrap: wrap; align-items: center;
  }
  .cmsf-meta-select {
    background: rgba(89,163,146,0.05); border: 1px solid rgba(89,163,146,0.1);
    color: #E2E8F0; border-radius: 8px;
    padding: 6px 10px; font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; outline: none;
    transition: border-color 0.15s; flex: 1; min-width: 100px;
  }
  .cmsf-meta-select:hover, .cmsf-meta-select:focus { border-color: rgba(89,163,146,0.25); }

  .cmsf-field-group { display: flex; flex-direction: column; gap: 6px; }
  .cmsf-field-label {
    font-size: 11px; font-weight: 600; color: #6B7B9E;
    text-transform: uppercase; letter-spacing: 0.09em;
    font-family: 'JetBrains Mono', monospace;
  }
  .cmsf-field-input {
    background: rgba(89,163,146,0.04); border: 1px solid rgba(89,163,146,0.1);
    color: #E2E8F0; border-radius: 9px;
    padding: 8px 12px; font-size: 13px; font-family: 'JetBrains Mono', monospace;
    outline: none; width: 100%;
    transition: border-color 0.15s;
  }
  .cmsf-field-input:hover, .cmsf-field-input:focus { border-color: rgba(89,163,146,0.25); }
  .cmsf-field-input::placeholder { color: #4A5578; }

  /* Markdown */
  .cmsf-md-editor { display: flex; flex-direction: column; }
  .cmsf-md-toolbar {
    display: flex; gap: 2px; flex-wrap: wrap;
    padding: 8px 10px;
    background: rgba(89,163,146,0.04);
    border: 1px solid rgba(89,163,146,0.1);
    border-bottom: none;
    border-radius: 10px 10px 0 0;
  }
  .cmsf-md-tool {
    padding: 4px 10px; border-radius: 6px;
    font-size: 12.5px; font-weight: 600;
    cursor: pointer; border: none;
    background: transparent; color: #6B7B9E;
    font-family: 'JetBrains Mono', monospace;
    transition: background 0.15s, color 0.15s;
  }
  .cmsf-md-tool:hover { background: rgba(89,163,146,0.1); color: #E2E8F0; }
  .cmsf-md-tool-sep {
    width: 1px; background: rgba(89,163,146,0.12); margin: 5px 2px;
  }
  .cmsf-md-area {
    width: 100%; min-height: 420px; resize: vertical;
    background: rgba(89,163,146,0.03);
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 0 0 10px 10px;
    color: #E2E8F0; font-family: 'JetBrains Mono', monospace;
    font-size: 13px; line-height: 1.8;
    padding: 14px 16px; outline: none;
    transition: border-color 0.15s;
  }
  .cmsf-md-area:hover, .cmsf-md-area:focus { border-color: rgba(89,163,146,0.25); }

  /* Split preview */
  .cmsf-md-split { display: flex; }
  .cmsf-md-split .cmsf-md-area { border-radius: 0 0 0 10px; border-right: none; flex: 1; }
  .cmsf-md-preview {
    flex: 1; min-height: 420px;
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 0 0 10px 0;
    background: rgba(12,12,29,0.5);
    padding: 14px 18px; overflow-y: auto;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px; line-height: 1.8; color: #C8D0E0;
  }
  .cmsf-md-preview h1, .cmsf-md-preview h2, .cmsf-md-preview h3 {
    font-family: 'Manrope', sans-serif; font-weight: 700; color: #E2E8F0;
    margin: 14px 0 8px;
  }
  .cmsf-md-preview h1 { font-size: 20px; }
  .cmsf-md-preview h2 { font-size: 17px; }
  .cmsf-md-preview h3 { font-size: 15px; }
  .cmsf-md-preview p { margin-bottom: 10px; }
  .cmsf-md-preview ul { padding-left: 20px; margin-bottom: 10px; }
  .cmsf-md-preview li { margin-bottom: 4px; }
  .cmsf-md-preview strong { color: #E2E8F0; font-weight: 600; }
  .cmsf-md-preview em { color: #A3B4CC; }
  .cmsf-md-preview code {
    background: rgba(89,163,146,0.1); color: #72C4B2;
    padding: 2px 6px; border-radius: 4px;
    font-family: 'JetBrains Mono', monospace; font-size: 12px;
  }

  .cmsf-md-count {
    font-size: 11.5px; color: #4A5578;
    font-family: 'JetBrains Mono', monospace;
    text-align: right; margin-top: 6px;
  }

  .cmsf-date-input {
    background: rgba(89,163,146,0.04); border: 1px solid rgba(89,163,146,0.1);
    color: #E2E8F0; border-radius: 9px;
    padding: 8px 12px; font-size: 13px; font-family: 'DM Sans', sans-serif;
    outline: none; width: 100%;
    transition: border-color 0.15s; color-scheme: dark;
  }
  .cmsf-date-input:focus { border-color: rgba(89,163,146,0.25); }

  .cmsf-footer {
    padding: 18px 24px;
    border-top: 1px solid rgba(89,163,146,0.08);
    display: flex; align-items: center; gap: 10px; justify-content: flex-end;
  }
  .cmsf-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 18px; border-radius: 9px;
    font-family: 'Manrope', sans-serif; font-size: 13.5px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.18s ease;
  }
  .cmsf-btn-accent { background: #3A589E; color: #fff; }
  .cmsf-btn-accent:hover { background: #4A6CB8; transform: translateY(-1px); }
  .cmsf-btn-ghost {
    background: transparent; color: #E2E8F0;
    border: 1px solid rgba(89,163,146,0.14) !important;
  }
  .cmsf-btn-ghost:hover { border-color: rgba(89,163,146,0.3) !important; color: #59A392; }

  .cmsf-save-msg {
    font-size: 12px; color: #59A392;
    font-family: 'JetBrains Mono', monospace;
    opacity: 0; transition: opacity 0.3s;
  }
  .cmsf-save-msg.visible { opacity: 1; }

  .cmsf-not-found {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 400px; gap: 12px;
    color: #6B7B9E; font-family: 'DM Sans', sans-serif;
  }
  .cmsf-not-found h2 {
    font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 700;
    color: #C8D0E0;
  }
`;

// ─── Full Editor ───────────────────────────────────────────────────────────────

interface FullEditorProps {
  initial: ContentItem;
}

function FullEditor({ initial }: FullEditorProps) {
  const [item, setItem] = useState<ContentItem>(initial);
  const [title, setTitle] = useState(item.title);
  const [type, setType] = useState<ContentType>(item.type);
  const [division, setDivision] = useState<Division | 'parent'>(item.division);
  const [status, setStatus] = useState<ContentStatus>(item.status);
  const [slug, setSlug] = useState(item.slug ?? slugify(item.title));
  const [bodyText, setBodyText] = useState(item.body.text ?? item.body.excerpt ?? '');
  const [publishedAt, setPublishedAt] = useState(
    item.published_at ? item.published_at.slice(0, 16) : '',
  );
  const [showPreview, setShowPreview] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    setSlug(slugify(v));
  };

  const buildUpdated = useCallback(
    (overrides: Partial<ContentItem> = {}): ContentItem => ({
      ...item,
      title, type, division, status,
      slug: slug || null,
      published_at: publishedAt || null,
      body: { excerpt: bodyText.slice(0, 200), text: bodyText },
      ...overrides,
    }),
    [item, title, type, division, status, slug, publishedAt, bodyText],
  );

  const handleSaveDraft = () => {
    setItem(buildUpdated());
    setSavedAt(Date.now());
  };

  const handlePublish = () => {
    const now = new Date().toISOString().slice(0, 16);
    const pub = publishedAt || now;
    setStatus('published');
    setPublishedAt(pub);
    setItem(buildUpdated({ status: 'published', published_at: pub }));
    setSavedAt(Date.now());
  };

  const st = (() => {
    const map: Record<ContentStatus, { color: string; bg: string }> = {
      draft: { color: '#6B7B9E', bg: 'rgba(107,123,158,0.12)' },
      review: { color: '#E8B84D', bg: 'rgba(232,184,77,0.12)' },
      published: { color: '#59A392', bg: 'rgba(89,163,146,0.12)' },
      archived: { color: '#4A5578', bg: 'rgba(74,85,120,0.12)' },
    };
    return map[status];
  })();

  const divColor = DIVISION_COLORS[division] ?? '#6B7B9E';
  const chars = bodyText.length;
  const words = wordCount(bodyText);

  return (
    <div className="cmsf-editor">
      <div className="cmsf-editor-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <span className="cmsf-editor-label">Full Editor</span>
          <span
            className="cmsf-status-badge"
            style={{ color: st.color, background: st.bg }}
          >
            {status}
          </span>
          <span
            className="cmsf-status-badge"
            style={{ color: divColor, background: `${divColor}18` }}
          >
            {division}
          </span>
        </div>
        <button
          className={`cmsf-preview-toggle${showPreview ? ' active' : ''}`}
          onClick={() => setShowPreview((v) => !v)}
        >
          {showPreview ? 'Hide Preview' : 'Toggle Preview'}
        </button>
      </div>

      <div className="cmsf-body">
        {/* Title */}
        <textarea
          className="cmsf-title-input"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Entry title..."
          rows={2}
          style={{ resize: 'none' }}
        />

        {/* Meta */}
        <div className="cmsf-meta-row">
          <select className="cmsf-meta-select" value={type} onChange={(e) => setType(e.target.value as ContentType)}>
            {CONTENT_TYPES.map((t) => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
          <select className="cmsf-meta-select" value={division} onChange={(e) => setDivision(e.target.value as Division | 'parent')}>
            {DIVISIONS.map((d) => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
          <select className="cmsf-meta-select" value={status} onChange={(e) => setStatus(e.target.value as ContentStatus)}>
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Slug */}
        <div className="cmsf-field-group">
          <label className="cmsf-field-label">Slug</label>
          <input
            type="text"
            className="cmsf-field-input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated-from-title"
          />
        </div>

        {/* Markdown editor */}
        <div className="cmsf-field-group">
          <label className="cmsf-field-label">Body</label>
          <div className="cmsf-md-editor">
            <div className="cmsf-md-toolbar">
              {TOOLBAR_ACTIONS.map((action, i) =>
                action === null ? (
                  <div key={`sep-${i}`} className="cmsf-md-tool-sep" />
                ) : (
                  <button
                    key={action.label}
                    className="cmsf-md-tool"
                    onClick={() => {
                      if (textareaRef.current) {
                        applyMarkdown(textareaRef.current, action, setBodyText);
                      }
                    }}
                  >
                    {action.label}
                  </button>
                ),
              )}
            </div>

            {showPreview ? (
              <div className="cmsf-md-split">
                <textarea
                  ref={textareaRef}
                  className="cmsf-md-area"
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Write in markdown..."
                />
                <div
                  className="cmsf-md-preview"
                  dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(bodyText) }}
                />
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                className="cmsf-md-area"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Write in markdown..."
                style={{ borderRadius: '0 0 10px 10px' }}
              />
            )}

            <div className="cmsf-md-count">{chars} chars · {words} words</div>
          </div>
        </div>

        {/* Published at */}
        {status === 'published' && (
          <div className="cmsf-field-group">
            <label className="cmsf-field-label">Published at</label>
            <input
              type="datetime-local"
              className="cmsf-date-input"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="cmsf-footer">
        <span className={`cmsf-save-msg${savedAt ? ' visible' : ''}`}>Saved</span>
        <button className="cmsf-btn cmsf-btn-ghost" onClick={handleSaveDraft}>Save Draft</button>
        <button className="cmsf-btn cmsf-btn-accent" onClick={handlePublish}>Publish</button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const item = MOCK_CONTENT.find((c) => c.id === id) ?? null;

  return (
    <div className="cmsf-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="cmsf-topbar">
        <a href="/admin/content" className="cmsf-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          All Content
        </a>
        <h1 className="cmsf-heading">
          {item ? item.title || 'Untitled' : 'Content Editor'}
        </h1>
      </div>

      {item ? (
        <FullEditor initial={item} />
      ) : (
        <div className="cmsf-not-found">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: '#4A5578' }}>
            <circle cx="12" cy="12" r="10"/>
            <line x1="15" y1="9" x2="9" y2="15"/>
            <line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <h2>Content not found</h2>
          <p>No content item with ID <code style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, color: '#59A392' }}>{id}</code> exists.</p>
          <a href="/admin/content" className="cmsf-back" style={{ marginTop: 8 }}>
            Back to Content
          </a>
        </div>
      )}
    </div>
  );
}
