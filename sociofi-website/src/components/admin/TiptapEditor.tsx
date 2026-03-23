'use client'

import { useCallback, useState } from 'react'
import { MOCK_MEDIA } from '@/lib/admin/mock-data'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TiptapLink from '@tiptap/extension-link'
import TiptapImage from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'
import TaskList from '@tiptap/extension-task-list'
import TaskItem from '@tiptap/extension-task-item'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'
import CharacterCount from '@tiptap/extension-character-count'
import { Table, TableRow, TableCell, TableHeader } from '@tiptap/extension-table'

// ── Toolbar button ────────────────────────────────────────────
function ToolBtn({ onClick, active, title, disabled, children }: {
  onClick: () => void; active?: boolean; title: string; disabled?: boolean; children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        background: active ? 'rgba(89,163,146,0.2)' : 'transparent',
        color: active ? '#59A392' : disabled ? '#2d3748' : '#94A3B8',
        border: active ? '1px solid rgba(89,163,146,0.3)' : '1px solid transparent',
        borderRadius: '5px',
        padding: '5px 7px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontSize: '0.72rem',
        fontFamily: "'Fira Code', monospace",
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minWidth: '28px', height: '28px',
        transition: 'all 0.1s',
      }}
      onMouseEnter={e => { if (!disabled && !active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)' }}
      onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.07)', margin: '0 4px' }} />
}

// ── SVG Icons ─────────────────────────────────────────────────
const icons = {
  bold: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M6 4h8a4 4 0 010 8H6z"/><path d="M6 12h9a4 4 0 010 8H6z"/></svg>,
  italic: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>,
  strike: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17.3 4.9c-2.3-.6-4.4-1-6.2-.9-2.7 0-5.3.7-5.3 3.6 0 1.5 1.8 3.3 6 3.9h.2m6.9 3.7c-.2 3.5-3.6 4.8-7 4.8-2.6 0-5.4-.6-7.5-1.8"/><line x1="2" y1="12" x2="22" y2="12"/></svg>,
  code: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
  quote: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>,
  bulletList: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>,
  orderedList: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1.5"/></svg>,
  link: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
  image: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  table: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>,
  undo: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 00-4-4H4"/></svg>,
  redo: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 014-4h12"/></svg>,
  highlight: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  codeBlock: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="18" rx="2"/><path d="M8 10l-3 2 3 2"/><path d="M16 10l3 2-3 2"/><path d="M12 8l-2 8"/></svg>,
}

interface TiptapEditorProps {
  content?: string
  onChange?: (html: string, json: Record<string, unknown>) => void
  placeholder?: string
  onWordCountChange?: (count: number) => void
}

export default function TiptapEditor({ content = '', onChange, placeholder = 'Start writing…', onWordCountChange }: TiptapEditorProps) {
  const [showMediaPicker, setShowMediaPicker] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      TiptapLink.configure({ openOnClick: false, HTMLAttributes: { class: 'editor-link' } }),
      TiptapImage.configure({ HTMLAttributes: { class: 'editor-image' } }),
      Placeholder.configure({ placeholder }),
      TaskList,
      TaskItem,
      Highlight.configure({ multicolor: true }),
      Typography,
      CharacterCount,
      Table.configure({ resizable: false }),
      TableRow,
      TableCell,
      TableHeader,
    ],
    content,
    editorProps: {
      attributes: {
        class: 'tiptap-editor-content',
        spellcheck: 'true',
      },
    },
    onUpdate: ({ editor }) => {
      if (onChange) onChange(editor.getHTML(), editor.getJSON() as Record<string, unknown>)
      if (onWordCountChange) {
        const text = editor.getText()
        const words = text.trim() ? text.trim().split(/\s+/).length : 0
        onWordCountChange(words)
      }
    },
  })

  const setLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('Enter URL:')
    if (url !== null && url !== '') {
      editor.chain().focus().setLink({ href: url }).run()
    } else if (url === '') {
      editor.chain().focus().unsetLink().run()
    }
  }, [editor])

  const addTable = useCallback(() => {
    if (!editor) return
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  if (!editor) return null

  const charCount = editor.storage.characterCount?.characters?.() ?? 0
  const wordCount = editor.storage.characterCount?.words?.() ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', overflow: 'hidden', background: '#0A0E1A' }}>
      {/* Toolbar */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: '#12162A', padding: '6px 10px' }}>
        <div style={{ display: 'flex', gap: '2px', alignItems: 'center', flexWrap: 'wrap' }}>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive('heading', { level: 2 })} title="Heading 2">H2</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} active={editor.isActive('heading', { level: 3 })} title="Heading 3">H3</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()} active={editor.isActive('heading', { level: 4 })} title="Heading 4">H4</ToolBtn>
          <Divider />
          <ToolBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">{icons.bold}</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">{icons.italic}</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">{icons.strike}</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Inline Code">{icons.code}</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleHighlight().run()} active={editor.isActive('highlight')} title="Highlight">{icons.highlight}</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">{icons.quote}</ToolBtn>
          <Divider />
          <ToolBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">{icons.bulletList}</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Ordered List">{icons.orderedList}</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive('taskList')} title="Task List">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
          </ToolBtn>
          <Divider />
          <ToolBtn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Code Block">{icons.codeBlock}</ToolBtn>
          <ToolBtn onClick={setLink} active={editor.isActive('link')} title="Link">{icons.link}</ToolBtn>
          <ToolBtn onClick={() => setShowMediaPicker(true)} active={false} title="Insert Image">{icons.image}</ToolBtn>
          <ToolBtn onClick={addTable} active={editor.isActive('table')} title="Insert Table">{icons.table}</ToolBtn>
          <Divider />
          <ToolBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">{icons.undo}</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">{icons.redo}</ToolBtn>
          <ToolBtn onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()} title="Clear Formatting">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6.33 3h11.34L12 12.6"/><line x1="3" y1="21" x2="21" y2="3"/></svg>
          </ToolBtn>
        </div>
      </div>

      {/* Editor area */}
      <div style={{ padding: '24px 28px', minHeight: '500px' }}>
        <EditorContent editor={editor} />
      </div>

      {/* Word/char count */}
      <div style={{ padding: '8px 14px', borderTop: '1px solid rgba(255,255,255,0.04)', display: 'flex', gap: '16px', background: '#0A0E1A' }}>
        <span style={{ color: '#475569', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace" }}>{wordCount} words</span>
        <span style={{ color: '#475569', fontSize: '0.68rem', fontFamily: "'Fira Code', monospace" }}>{charCount} characters</span>
      </div>

      {/* Media picker modal */}
      {showMediaPicker && (
        <>
          <div
            onClick={() => setShowMediaPicker(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 900 }}
          />
          <div style={{
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            width: '640px', maxHeight: '480px',
            background: '#0F1320', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '14px', zIndex: 901,
            display: 'flex', flexDirection: 'column',
            boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
          }}>
            {/* Modal header */}
            <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ color: '#59A392', fontSize: '0.65rem', fontFamily: "'Fira Code', monospace", textTransform: 'uppercase', letterSpacing: '0.12em' }}>Select Image</div>
              <button onClick={() => setShowMediaPicker(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B', padding: '4px' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            {/* Image grid */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
              {MOCK_MEDIA.filter(item => item.media_type === 'image').map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (editor) {
                      editor.chain().focus().setImage({ src: item.public_url, alt: item.alt_text ?? '' }).run()
                    }
                    setShowMediaPicker(false)
                  }}
                  style={{
                    background: '#12162A', border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '8px', overflow: 'hidden', cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(89,163,146,0.4)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)' }}
                >
                  <div style={{ height: '90px', overflow: 'hidden', background: 'rgba(0,0,0,0.3)' }}>
                    <img src={item.public_url} alt={item.alt_text ?? item.filename}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                  <div style={{ padding: '6px 8px' }}>
                    <div style={{ color: '#94A3B8', fontSize: '0.62rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.filename}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Editor styles */}
      <style>{`
        .tiptap-editor-content { outline: none; color: #E2E8F0; font-family: 'Outfit', sans-serif; font-size: 0.95rem; line-height: 1.8; }
        .tiptap-editor-content h2 { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 700; color: #E2E8F0; margin: 1.5em 0 0.5em; letter-spacing: -0.02em; }
        .tiptap-editor-content h3 { font-family: 'Syne', sans-serif; font-size: 1.2rem; font-weight: 600; color: #E2E8F0; margin: 1.2em 0 0.4em; letter-spacing: -0.01em; }
        .tiptap-editor-content h4 { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 600; color: #E2E8F0; margin: 1em 0 0.3em; }
        .tiptap-editor-content p { margin: 0 0 1em; color: #94A3B8; }
        .tiptap-editor-content p.is-editor-empty:first-child::before { content: attr(data-placeholder); color: #2d3a50; pointer-events: none; float: left; height: 0; font-style: italic; }
        .tiptap-editor-content blockquote { border-left: 3px solid #59A392; padding-left: 16px; margin: 1.2em 0; color: #64748B; font-style: italic; }
        .tiptap-editor-content code { background: rgba(89,163,146,0.1); color: #72C4B2; padding: 1px 6px; border-radius: 4px; font-family: 'Fira Code', monospace; font-size: 0.85em; }
        .tiptap-editor-content pre { background: #0C0C1D; border: 1px solid rgba(89,163,146,0.1); border-radius: 8px; padding: 16px; overflow-x: auto; margin: 1.2em 0; }
        .tiptap-editor-content pre code { background: none; padding: 0; color: #E2E8F0; font-size: 0.85rem; }
        .tiptap-editor-content ul, .tiptap-editor-content ol { padding-left: 1.5em; margin: 0.8em 0; color: #94A3B8; }
        .tiptap-editor-content li { margin: 0.3em 0; }
        .tiptap-editor-content a.editor-link { color: #59A392; text-decoration: underline; }
        .tiptap-editor-content img.editor-image { max-width: 100%; border-radius: 8px; margin: 1em 0; }
        .tiptap-editor-content mark { background: rgba(232,184,77,0.25); color: #E8B84D; border-radius: 2px; padding: 0 2px; }
        .tiptap-editor-content table { border-collapse: collapse; width: 100%; margin: 1em 0; }
        .tiptap-editor-content th, .tiptap-editor-content td { border: 1px solid rgba(255,255,255,0.08); padding: 8px 12px; text-align: left; }
        .tiptap-editor-content th { background: rgba(255,255,255,0.04); color: #E2E8F0; font-weight: 600; }
        .tiptap-editor-content td { color: #94A3B8; }
        .tiptap-editor-content ul[data-type="taskList"] { list-style: none; padding-left: 0; }
        .tiptap-editor-content ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 8px; }
        .tiptap-editor-content ul[data-type="taskList"] li > label { flex-shrink: 0; margin-top: 4px; }
        .tiptap-editor-content hr { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 2em 0; }
      `}</style>
    </div>
  )
}
