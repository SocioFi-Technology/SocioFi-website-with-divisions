'use client';

import React, { useState, useRef, useCallback } from 'react';
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

// ─── Mock data (inline) ───────────────────────────────────────────────────────

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
    body: { excerpt: "The landscape of software development is shifting fast. Here's what founders need to know." },
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
    body: { excerpt: 'Common questions about how Studio projects work, timeline, pricing and handoffs.' },
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
    body: { excerpt: "We started SocioFi with a simple belief: great software shouldn't require a 10-person engineering team." },
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
    body: { excerpt: 'James came to us with a React codebase nobody could maintain. Six weeks later, they shipped their Series A demo.' },
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
    body: { excerpt: "Today we're launching Agents, our new division for autonomous AI development agents." },
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d}d ago`;
  return `${Math.floor(d / 30)}mo ago`;
}

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
    // Escape HTML first
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Headings
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`(.+?)`/g, '<code>$1</code>')
    // Bullet lists — collect consecutive lines
    .replace(/^- (.+)$/gm, '<li>$1</li>');

  // Wrap consecutive <li> items in <ul>
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Paragraphs: lines not already wrapped
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
  studio: '#72C4B2',
  services: '#4DBFA8',
  labs: '#7B6FE8',
  products: '#E8916F',
  academy: '#E8B84D',
  ventures: '#6BA3E8',
  cloud: '#5BB5E0',
  parent: '#4A6CB8',
  agents: '#8B5CF6',
};

const STATUS_STYLES: Record<ContentStatus, { color: string; bg: string; label: string }> = {
  draft: { color: '#6B7B9E', bg: 'rgba(107,123,158,0.12)', label: 'Draft' },
  review: { color: '#E8B84D', bg: 'rgba(232,184,77,0.12)', label: 'Review' },
  published: { color: '#59A392', bg: 'rgba(89,163,146,0.12)', label: 'Published' },
  archived: { color: '#4A5578', bg: 'rgba(74,85,120,0.12)', label: 'Archived' },
};

const TYPE_LABELS: Record<ContentType, string> = {
  blog_post: 'Blog Post',
  faq: 'FAQ',
  case_study: 'Case Study',
  announcement: 'Announcement',
};

const DIVISIONS: Array<Division | 'parent'> = [
  'parent', 'studio', 'services', 'labs', 'academy', 'ventures', 'cloud', 'agents',
];

const CONTENT_TYPES: ContentType[] = ['blog_post', 'faq', 'case_study', 'announcement'];

// ─── Styles ───────────────────────────────────────────────────────────────────

const STYLES = `
  .cms-page { display: flex; flex-direction: column; gap: 0; height: 100%; }

  /* Top bar */
  .cms-topbar {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 20px; gap: 12px; flex-wrap: wrap;
  }
  .cms-title {
    font-family: 'Manrope', sans-serif;
    font-size: 20px; font-weight: 700;
    color: #E2E8F0; letter-spacing: -0.02em;
  }
  .cms-topbar-actions { display: flex; align-items: center; gap: 8px; }

  .cms-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 8px;
    font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.18s ease;
    white-space: nowrap;
  }
  .cms-btn-accent {
    background: #3A589E; color: #fff;
  }
  .cms-btn-accent:hover { background: #4A6CB8; transform: translateY(-1px); }
  .cms-btn-ghost {
    background: transparent; color: #E2E8F0;
    border: 1px solid rgba(89,163,146,0.14) !important;
  }
  .cms-btn-ghost:hover { border-color: rgba(89,163,146,0.3) !important; color: #59A392; }

  /* Filter bar */
  .cms-filterbar {
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 16px; flex-wrap: wrap;
  }

  /* Tabs */
  .cms-tabs {
    display: flex; align-items: center; gap: 2px;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(89,163,146,0.08);
    padding-bottom: 0;
  }
  .cms-tab {
    padding: 8px 14px; font-size: 13px; font-weight: 500;
    color: #6B7B9E; background: none; border: none;
    cursor: pointer; border-bottom: 2px solid transparent;
    margin-bottom: -1px; transition: color 0.18s, border-color 0.18s;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-tab:hover { color: #E2E8F0; }
  .cms-tab.active { color: #59A392; border-bottom-color: #59A392; }
  .cms-tab-count {
    display: inline-block; padding: 1px 6px; border-radius: 10px;
    background: rgba(89,163,146,0.1); color: #59A392;
    font-size: 11px; font-weight: 600; margin-left: 4px;
    font-family: 'JetBrains Mono', monospace;
  }

  /* Selects */
  .cms-select {
    background: #111128; border: 1px solid rgba(89,163,146,0.1);
    color: #E2E8F0; border-radius: 8px;
    padding: 6px 10px; font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; outline: none;
    transition: border-color 0.18s;
  }
  .cms-select:hover, .cms-select:focus { border-color: rgba(89,163,146,0.25); }

  /* Main 2-col layout */
  .cms-body {
    display: grid;
    grid-template-columns: 1fr 420px;
    gap: 20px;
    align-items: start;
  }
  @media (max-width: 1100px) { .cms-body { grid-template-columns: 1fr; } }

  /* Content list */
  .cms-list { display: flex; flex-direction: column; gap: 10px; }

  .cms-item {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.08);
    border-radius: 12px;
    padding: 16px 18px;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s;
    position: relative;
    overflow: hidden;
  }
  .cms-item:hover { border-color: rgba(89,163,146,0.2); background: #131330; }
  .cms-item.selected { border-color: rgba(89,163,146,0.35); background: #131330; }
  .cms-item.selected::before {
    content: '';
    position: absolute; left: 0; top: 0; bottom: 0;
    width: 3px; background: #59A392; border-radius: 12px 0 0 12px;
  }

  .cms-item-title {
    font-family: 'Manrope', sans-serif;
    font-size: 14px; font-weight: 600; color: #E2E8F0;
    margin-bottom: 8px; line-height: 1.4;
    padding-right: 80px;
  }

  .cms-item-meta {
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
    margin-bottom: 8px;
  }

  .cms-badge {
    display: inline-flex; align-items: center;
    padding: 2px 8px; border-radius: 6px;
    font-size: 11px; font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
  }

  .cms-item-footer {
    display: flex; align-items: center; gap: 8px;
    font-size: 12px; color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
  }
  .cms-item-footer-dot {
    width: 3px; height: 3px; border-radius: 50%; background: #4A5578;
  }

  /* Hover actions */
  .cms-item-actions {
    position: absolute; top: 14px; right: 14px;
    display: flex; gap: 6px; opacity: 0;
    transition: opacity 0.18s;
  }
  .cms-item:hover .cms-item-actions { opacity: 1; }
  .cms-item-action-btn {
    padding: 4px 10px; border-radius: 6px;
    font-size: 11.5px; font-weight: 600;
    cursor: pointer; border: 1px solid rgba(89,163,146,0.15);
    background: #0C0C1D; color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .cms-item-action-btn:hover { color: #E2E8F0; border-color: rgba(89,163,146,0.3); }
  .cms-item-action-btn.archive:hover { color: #F87171; border-color: rgba(248,113,113,0.25); }

  .cms-empty {
    text-align: center; padding: 60px 20px;
    color: #6B7B9E; font-size: 14px;
    background: #111128; border: 1px solid rgba(89,163,146,0.08);
    border-radius: 12px;
  }

  /* Editor panel */
  .cms-editor-panel {
    background: #111128;
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 14px;
    overflow: hidden;
    position: sticky; top: 80px;
  }
  .cms-editor-panel-empty {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 60px 24px;
    background: #111128; border: 1px solid rgba(89,163,146,0.08);
    border-radius: 14px; text-align: center; gap: 10px;
    color: #6B7B9E; font-size: 14px; min-height: 320px;
    position: sticky; top: 80px;
  }
  .cms-editor-panel-empty-icon { opacity: 0.25; margin-bottom: 6px; }

  .cms-editor-header {
    padding: 16px 18px;
    border-bottom: 1px solid rgba(89,163,146,0.08);
    display: flex; align-items: center; justify-content: space-between;
    gap: 10px;
  }
  .cms-editor-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 600; letter-spacing: 0.1em;
    text-transform: uppercase; color: #6B7B9E;
  }
  .cms-editor-preview-toggle {
    padding: 4px 10px; border-radius: 6px;
    font-size: 11.5px; font-weight: 600;
    cursor: pointer; border: 1px solid rgba(89,163,146,0.15);
    background: transparent; color: #6B7B9E;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.15s;
  }
  .cms-editor-preview-toggle:hover { color: #59A392; border-color: rgba(89,163,146,0.3); }
  .cms-editor-preview-toggle.active { color: #59A392; border-color: rgba(89,163,146,0.3); background: rgba(89,163,146,0.06); }

  .cms-editor-body { padding: 18px; display: flex; flex-direction: column; gap: 14px; }

  .cms-title-input {
    width: 100%; background: transparent; border: none; outline: none;
    font-family: 'Manrope', sans-serif; font-size: 17px; font-weight: 700;
    color: #E2E8F0; letter-spacing: -0.02em; line-height: 1.3;
    resize: none; padding: 0;
  }
  .cms-title-input::placeholder { color: #4A5578; }

  .cms-meta-row {
    display: flex; gap: 8px; flex-wrap: wrap; align-items: center;
  }
  .cms-meta-select {
    background: rgba(89,163,146,0.05); border: 1px solid rgba(89,163,146,0.1);
    color: #E2E8F0; border-radius: 7px;
    padding: 5px 8px; font-size: 12px;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer; outline: none; flex: 1; min-width: 80px;
    transition: border-color 0.15s;
  }
  .cms-meta-select:hover, .cms-meta-select:focus { border-color: rgba(89,163,146,0.25); }

  .cms-field-group { display: flex; flex-direction: column; gap: 5px; }
  .cms-field-label {
    font-size: 11px; font-weight: 600; color: #6B7B9E;
    text-transform: uppercase; letter-spacing: 0.08em;
    font-family: 'JetBrains Mono', monospace;
  }
  .cms-field-input {
    background: rgba(89,163,146,0.04); border: 1px solid rgba(89,163,146,0.1);
    color: #E2E8F0; border-radius: 8px;
    padding: 7px 10px; font-size: 12.5px; font-family: 'JetBrains Mono', monospace;
    outline: none; width: 100%;
    transition: border-color 0.15s;
  }
  .cms-field-input:hover, .cms-field-input:focus { border-color: rgba(89,163,146,0.25); }
  .cms-field-input::placeholder { color: #4A5578; }

  /* Markdown editor */
  .cms-md-editor { display: flex; flex-direction: column; gap: 0; }
  .cms-md-toolbar {
    display: flex; gap: 2px; flex-wrap: wrap;
    padding: 6px 8px;
    background: rgba(89,163,146,0.04);
    border: 1px solid rgba(89,163,146,0.1);
    border-bottom: none;
    border-radius: 8px 8px 0 0;
  }
  .cms-md-tool {
    padding: 3px 8px; border-radius: 5px;
    font-size: 12px; font-weight: 600;
    cursor: pointer; border: none;
    background: transparent; color: #6B7B9E;
    font-family: 'JetBrains Mono', monospace;
    transition: background 0.15s, color 0.15s;
  }
  .cms-md-tool:hover { background: rgba(89,163,146,0.1); color: #E2E8F0; }
  .cms-md-tool-sep {
    width: 1px; background: rgba(89,163,146,0.1); margin: 4px 2px;
  }
  .cms-md-area {
    width: 100%; min-height: 220px; resize: vertical;
    background: rgba(89,163,146,0.03);
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 0 0 8px 8px;
    color: #E2E8F0; font-family: 'JetBrains Mono', monospace;
    font-size: 12.5px; line-height: 1.7;
    padding: 10px 12px; outline: none;
    transition: border-color 0.15s;
  }
  .cms-md-area:hover, .cms-md-area:focus { border-color: rgba(89,163,146,0.25); }

  /* Split preview */
  .cms-md-split { display: flex; gap: 0; }
  .cms-md-split .cms-md-area { border-radius: 0 0 0 8px; border-right: none; flex: 1; }
  .cms-md-preview {
    flex: 1; min-height: 220px;
    border: 1px solid rgba(89,163,146,0.1);
    border-radius: 0 0 8px 0;
    background: rgba(12,12,29,0.6);
    padding: 10px 12px; overflow-y: auto;
    font-family: 'DM Sans', sans-serif;
    font-size: 12.5px; line-height: 1.7;
    color: #C8D0E0;
  }
  .cms-md-preview h1, .cms-md-preview h2, .cms-md-preview h3 {
    font-family: 'Manrope', sans-serif; font-weight: 700; color: #E2E8F0;
    margin: 10px 0 6px;
  }
  .cms-md-preview h1 { font-size: 16px; }
  .cms-md-preview h2 { font-size: 14px; }
  .cms-md-preview h3 { font-size: 13px; }
  .cms-md-preview p { margin-bottom: 8px; }
  .cms-md-preview ul { padding-left: 18px; margin-bottom: 8px; }
  .cms-md-preview li { margin-bottom: 3px; }
  .cms-md-preview strong { color: #E2E8F0; font-weight: 600; }
  .cms-md-preview em { color: #A3B4CC; }
  .cms-md-preview code {
    background: rgba(89,163,146,0.1); color: #72C4B2;
    padding: 1px 5px; border-radius: 4px;
    font-family: 'JetBrains Mono', monospace; font-size: 11.5px;
  }

  .cms-md-count {
    font-size: 11px; color: #4A5578;
    font-family: 'JetBrains Mono', monospace;
    text-align: right; margin-top: 4px;
  }

  .cms-editor-footer {
    padding: 14px 18px;
    border-top: 1px solid rgba(89,163,146,0.08);
    display: flex; align-items: center; gap: 8px; justify-content: flex-end;
  }

  /* Date input */
  .cms-date-input {
    background: rgba(89,163,146,0.04); border: 1px solid rgba(89,163,146,0.1);
    color: #E2E8F0; border-radius: 8px;
    padding: 7px 10px; font-size: 12.5px; font-family: 'DM Sans', sans-serif;
    outline: none; width: 100%;
    transition: border-color 0.15s;
    color-scheme: dark;
  }
  .cms-date-input:focus { border-color: rgba(89,163,146,0.25); }

  /* Save feedback */
  .cms-save-feedback {
    font-size: 12px; color: #59A392;
    font-family: 'JetBrains Mono', monospace;
    opacity: 0; transition: opacity 0.3s;
  }
  .cms-save-feedback.visible { opacity: 1; }
`;

// ─── Markdown toolbar helper ───────────────────────────────────────────────────

type ToolAction = {
  label: string;
  prefix: string;
  suffix: string;
  block?: boolean;
};

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
    // Insert at the start of the line
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
  // Restore focus and selection after state update
  setTimeout(() => {
    textarea.focus();
    textarea.setSelectionRange(newStart, newEnd);
  }, 0);
}

// ─── Editor panel component ───────────────────────────────────────────────────

interface EditorPanelProps {
  item: ContentItem;
  onUpdate: (updated: ContentItem) => void;
  onClose: () => void;
}

function EditorPanel({ item, onUpdate, onClose }: EditorPanelProps) {
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

  // Sync when item changes from outside
  React.useEffect(() => {
    setTitle(item.title);
    setType(item.type);
    setDivision(item.division);
    setStatus(item.status);
    setSlug(item.slug ?? slugify(item.title));
    setBodyText(item.body.text ?? item.body.excerpt ?? '');
    setPublishedAt(item.published_at ? item.published_at.slice(0, 16) : '');
    setSavedAt(null);
    setShowPreview(false);
  }, [item.id]);

  // Auto-slug from title
  const handleTitleChange = (v: string) => {
    setTitle(v);
    setSlug(slugify(v));
  };

  const buildUpdated = useCallback(
    (overrides: Partial<ContentItem> = {}): ContentItem => ({
      ...item,
      title,
      type,
      division,
      status,
      slug: slug || null,
      published_at: publishedAt || null,
      body: { excerpt: bodyText.slice(0, 200), text: bodyText },
      ...overrides,
    }),
    [item, title, type, division, status, slug, publishedAt, bodyText],
  );

  const handleSaveDraft = () => {
    onUpdate(buildUpdated({ status: status === 'published' ? 'published' : 'draft' }));
    setSavedAt(Date.now());
  };

  const handlePublish = () => {
    const now = new Date().toISOString().slice(0, 16);
    const pub = publishedAt || now;
    setStatus('published');
    setPublishedAt(pub);
    onUpdate(buildUpdated({ status: 'published', published_at: pub }));
    setSavedAt(Date.now());
  };

  const chars = bodyText.length;
  const words = wordCount(bodyText);

  return (
    <div className="cms-editor-panel">
      <div className="cms-editor-header">
        <span className="cms-editor-label">
          {item.id.startsWith('new-') ? 'New Entry' : 'Editing'}
        </span>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <button
            className={`cms-editor-preview-toggle${showPreview ? ' active' : ''}`}
            onClick={() => setShowPreview((v) => !v)}
          >
            {showPreview ? 'Hide Preview' : 'Toggle Preview'}
          </button>
          <button
            className="cms-editor-preview-toggle"
            onClick={onClose}
            aria-label="Close editor"
            style={{ padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="cms-editor-body">
        {/* Title */}
        <textarea
          className="cms-title-input"
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          placeholder="Entry title..."
          rows={2}
          style={{ resize: 'none' }}
        />

        {/* Meta selectors */}
        <div className="cms-meta-row">
          <select
            className="cms-meta-select"
            value={type}
            onChange={(e) => setType(e.target.value as ContentType)}
          >
            {CONTENT_TYPES.map((t) => (
              <option key={t} value={t}>{TYPE_LABELS[t]}</option>
            ))}
          </select>
          <select
            className="cms-meta-select"
            value={division}
            onChange={(e) => setDivision(e.target.value as Division | 'parent')}
          >
            {DIVISIONS.map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
          <select
            className="cms-meta-select"
            value={status}
            onChange={(e) => setStatus(e.target.value as ContentStatus)}
          >
            <option value="draft">Draft</option>
            <option value="review">Review</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Slug */}
        <div className="cms-field-group">
          <label className="cms-field-label">Slug</label>
          <input
            type="text"
            className="cms-field-input"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto-generated-from-title"
          />
        </div>

        {/* Markdown editor */}
        <div className="cms-field-group">
          <label className="cms-field-label">Body</label>
          <div className="cms-md-editor">
            <div className="cms-md-toolbar">
              {TOOLBAR_ACTIONS.map((action, i) =>
                action === null ? (
                  <div key={`sep-${i}`} className="cms-md-tool-sep" />
                ) : (
                  <button
                    key={action.label}
                    className="cms-md-tool"
                    onClick={() => {
                      if (textareaRef.current) {
                        applyMarkdown(textareaRef.current, action, setBodyText);
                      }
                    }}
                    title={action.label}
                  >
                    {action.label}
                  </button>
                ),
              )}
            </div>

            {showPreview ? (
              <div className="cms-md-split">
                <textarea
                  ref={textareaRef}
                  className="cms-md-area"
                  value={bodyText}
                  onChange={(e) => setBodyText(e.target.value)}
                  placeholder="Write in markdown..."
                  style={{ minHeight: 220 }}
                />
                <div
                  className="cms-md-preview"
                  dangerouslySetInnerHTML={{ __html: simpleMarkdownToHtml(bodyText) }}
                />
              </div>
            ) : (
              <textarea
                ref={textareaRef}
                className="cms-md-area"
                value={bodyText}
                onChange={(e) => setBodyText(e.target.value)}
                placeholder="Write in markdown..."
                style={{ minHeight: 220, borderRadius: '0 0 8px 8px' }}
              />
            )}

            <div className="cms-md-count">
              {chars} chars · {words} words
            </div>
          </div>
        </div>

        {/* Published at — only if published */}
        {status === 'published' && (
          <div className="cms-field-group">
            <label className="cms-field-label">Published at</label>
            <input
              type="datetime-local"
              className="cms-date-input"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="cms-editor-footer">
        <span className={`cms-save-feedback${savedAt ? ' visible' : ''}`}>
          Saved
        </span>
        <button className="cms-btn cms-btn-ghost" onClick={handleSaveDraft}>
          Save Draft
        </button>
        <button className="cms-btn cms-btn-accent" onClick={handlePublish}>
          Publish
        </button>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

type TabType = 'all' | ContentType;

const TABS: Array<{ id: TabType; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'blog_post', label: 'Blog Posts' },
  { id: 'faq', label: 'FAQs' },
  { id: 'case_study', label: 'Case Studies' },
  { id: 'announcement', label: 'Announcements' },
];

let newIdCounter = 0;

export default function ContentPage() {
  const [items, setItems] = useState<ContentItem[]>(MOCK_CONTENT);
  const [activeTab, setActiveTab] = useState<TabType>('all');
  const [divisionFilter, setDivisionFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedItem = items.find((i) => i.id === selectedId) ?? null;

  const filtered = items.filter((item) => {
    if (activeTab !== 'all' && item.type !== activeTab) return false;
    if (divisionFilter !== 'all' && item.division !== divisionFilter) return false;
    if (statusFilter !== 'all' && item.status !== statusFilter) return false;
    return true;
  });

  const tabCount = (tab: TabType) => {
    if (tab === 'all') return items.length;
    return items.filter((i) => i.type === tab).length;
  };

  const handleUpdate = (updated: ContentItem) => {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
  };

  const handleArchive = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, status: 'archived' as ContentStatus } : i)),
    );
    if (selectedId === id) setSelectedId(null);
  };

  const handleNewPost = () => {
    newIdCounter += 1;
    const newItem: ContentItem = {
      id: `new-${newIdCounter}`,
      type: 'blog_post',
      division: 'parent',
      title: '',
      slug: null,
      status: 'draft',
      author: 'Arifur Rahman',
      published_at: null,
      created_at: new Date().toISOString(),
      body: { excerpt: '', text: '' },
    };
    setItems((prev) => [newItem, ...prev]);
    setSelectedId(newItem.id);
    setActiveTab('all');
  };

  const handleNewFaq = () => {
    newIdCounter += 1;
    const newItem: ContentItem = {
      id: `new-${newIdCounter}`,
      type: 'faq',
      division: 'parent',
      title: '',
      slug: null,
      status: 'draft',
      author: 'Arifur Rahman',
      published_at: null,
      created_at: new Date().toISOString(),
      body: { excerpt: '', text: '' },
    };
    setItems((prev) => [newItem, ...prev]);
    setSelectedId(newItem.id);
    setActiveTab('all');
  };

  return (
    <div className="cms-page">
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      {/* Top bar */}
      <div className="cms-topbar">
        <h1 className="cms-title">Content</h1>
        <div className="cms-topbar-actions">
          <button className="cms-btn cms-btn-ghost" onClick={handleNewFaq}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New FAQ
          </button>
          <button className="cms-btn cms-btn-accent" onClick={handleNewPost}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Post
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="cms-tabs" role="tablist">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`cms-tab${activeTab === tab.id ? ' active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            <span className="cms-tab-count">{tabCount(tab.id)}</span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div className="cms-filterbar">
        <select
          className="cms-select"
          value={divisionFilter}
          onChange={(e) => setDivisionFilter(e.target.value)}
          aria-label="Filter by division"
        >
          <option value="all">All Divisions</option>
          {DIVISIONS.map((d) => (
            <option key={d} value={d}>
              {d.charAt(0).toUpperCase() + d.slice(1)}
            </option>
          ))}
        </select>
        <select
          className="cms-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="review">Review</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* 2-col body */}
      <div className="cms-body">
        {/* Content list */}
        <div className="cms-list">
          {filtered.length === 0 ? (
            <div className="cms-empty">No content matches these filters.</div>
          ) : (
            filtered.map((item) => {
              const divColor = DIVISION_COLORS[item.division] ?? '#6B7B9E';
              const st = STATUS_STYLES[item.status];
              return (
                <div
                  key={item.id}
                  className={`cms-item${selectedId === item.id ? ' selected' : ''}`}
                  onClick={() => setSelectedId(item.id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedId(item.id); }}
                  aria-pressed={selectedId === item.id}
                >
                  <div className="cms-item-title">
                    {item.title || <em style={{ color: '#4A5578' }}>Untitled</em>}
                  </div>
                  <div className="cms-item-meta">
                    <span
                      className="cms-badge"
                      style={{ color: divColor, background: `${divColor}18` }}
                    >
                      {item.division}
                    </span>
                    <span
                      className="cms-badge"
                      style={{ color: '#A3B4CC', background: 'rgba(163,180,204,0.1)' }}
                    >
                      {TYPE_LABELS[item.type]}
                    </span>
                    <span
                      className="cms-badge"
                      style={{ color: st.color, background: st.bg }}
                    >
                      {st.label}
                    </span>
                  </div>
                  <div className="cms-item-footer">
                    <span>{item.author}</span>
                    <span className="cms-item-footer-dot" />
                    <span>
                      {item.published_at
                        ? `Published ${timeAgo(item.published_at)}`
                        : `Created ${timeAgo(item.created_at)}`}
                    </span>
                  </div>

                  {/* Hover actions */}
                  <div className="cms-item-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      className="cms-item-action-btn"
                      onClick={() => setSelectedId(item.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="cms-item-action-btn archive"
                      onClick={() => handleArchive(item.id)}
                    >
                      Archive
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Editor panel */}
        {selectedItem ? (
          <EditorPanel
            key={selectedItem.id}
            item={selectedItem}
            onUpdate={handleUpdate}
            onClose={() => setSelectedId(null)}
          />
        ) : (
          <div className="cms-editor-panel-empty">
            <div className="cms-editor-panel-empty-icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ color: '#59A392' }}>
                <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
                <polyline points="13 2 13 9 20 9"/>
              </svg>
            </div>
            <div style={{ fontFamily: 'Manrope, sans-serif', fontWeight: 600, color: '#C8D0E0', fontSize: 14 }}>
              Select an entry to edit
            </div>
            <div style={{ fontSize: 13, lineHeight: 1.5, maxWidth: 240 }}>
              Click any content item in the list, or create a new one using the buttons above.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
