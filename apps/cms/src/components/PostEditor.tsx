'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useCallback } from 'react'

interface PostEditorProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
  minHeight?: number
}

export default function PostEditor({
  content = '',
  onChange,
  placeholder = 'Start writing...',
  minHeight = 320,
}: PostEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: false }),
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Placeholder.configure({ placeholder }),
    ],
    content,
    editorProps: {
      attributes: { class: 'tiptap', style: `min-height: ${minHeight}px` },
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    immediatelyRender: false,
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, { emitUpdate: false })
    }
  }, [content, editor])

  const setLink = useCallback(() => {
    if (!editor) return
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)
    if (url === null) return
    if (url === '') { editor.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  const toolbarBtnStyle = (active: boolean) => ({
    background: active ? 'rgba(89,163,146,0.2)' : 'transparent',
    border: '1px solid ' + (active ? 'rgba(89,163,146,0.4)' : 'transparent'),
    borderRadius: '6px',
    color: active ? 'var(--teal-light)' : 'var(--text-secondary)',
    cursor: 'pointer',
    padding: '5px 8px',
    fontSize: '0.8rem',
    fontFamily: 'var(--font-display)',
    fontWeight: 600,
    transition: 'all 0.15s',
  })

  return (
    <div style={{
      border: '1px solid var(--border)',
      borderRadius: '12px',
      overflow: 'hidden',
      background: 'var(--bg)',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '4px',
        padding: '10px 12px',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg-2)',
      }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()} style={toolbarBtnStyle(editor.isActive('bold'))} title="Bold">B</button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} style={{ ...toolbarBtnStyle(editor.isActive('italic')), fontStyle: 'italic' }} title="Italic">I</button>
        <button onClick={() => editor.chain().focus().toggleCode().run()} style={{ ...toolbarBtnStyle(editor.isActive('code')), fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }} title="Inline code">`</button>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }} />

        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} style={toolbarBtnStyle(editor.isActive('heading', { level: 1 }))} title="Heading 1">H1</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} style={toolbarBtnStyle(editor.isActive('heading', { level: 2 }))} title="Heading 2">H2</button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} style={toolbarBtnStyle(editor.isActive('heading', { level: 3 }))} title="Heading 3">H3</button>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }} />

        <button onClick={() => editor.chain().focus().toggleBulletList().run()} style={toolbarBtnStyle(editor.isActive('bulletList'))} title="Bullet list">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
            <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
          </svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} style={toolbarBtnStyle(editor.isActive('orderedList'))} title="Numbered list">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
            <path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
          </svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} style={toolbarBtnStyle(editor.isActive('blockquote'))} title="Blockquote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
          </svg>
        </button>
        <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} style={toolbarBtnStyle(editor.isActive('codeBlock'))} title="Code block">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>
          </svg>
        </button>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }} />

        <button onClick={setLink} style={toolbarBtnStyle(editor.isActive('link'))} title="Insert link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
        </button>

        <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 4px' }} />

        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} style={{ ...toolbarBtnStyle(false), opacity: editor.can().undo() ? 1 : 0.4 }} title="Undo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
          </svg>
        </button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} style={{ ...toolbarBtnStyle(false), opacity: editor.can().redo() ? 1 : 0.4 }} title="Redo">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>
          </svg>
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  )
}
