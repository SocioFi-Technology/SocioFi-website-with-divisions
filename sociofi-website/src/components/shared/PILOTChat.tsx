'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import PILOTAvatar from './PILOTAvatar';
import type { Division } from '@/lib/divisions';
import { matchIntent } from '@/lib/pilot-knowledge';

// ── Mobile detection hook ────────────────────────────────────────────────────

function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuickAction {
  label: string;
  action?: 'navigate' | 'message';
  url?: string;
}

interface Message {
  id: string;
  role: 'pilot' | 'user';
  content: string;
  quickActions?: (string | QuickAction)[];
  timestamp: Date;
}

interface PILOTChatProps {
  division: Division;
  pageUrl?: string;
  pageTitle?: string;
  embedded?: boolean;
  initialMessage?: string;
}

// ── Division-specific prompts ─────────────────────────────────────────────────

const DIVISION_OPENERS: Record<string, { prompt: string; quickActions: string[] }> = {
  studio: {
    prompt: "What are you building? I can help you figure out which Studio service fits your project and give you a rough estimate.",
    quickActions: ["I need an MVP built", "I have a broken prototype", "I need internal tools", "Just browsing"],
  },
  services: {
    prompt: "What software do you currently have running? I can recommend the right maintenance plan for your situation.",
    quickActions: ["A web app", "Mobile app", "Internal tool", "Not live yet"],
  },
  labs: {
    prompt: "What are you curious about? I can point you to our research, open-source projects, or latest thinking.",
    quickActions: ["AI development research", "Open-source tools", "Technical writing", "Just exploring"],
  },
  products: {
    prompt: "Which product are you interested in? I can walk you through FabricxAI, NEXUS ARIA, or DevBridge.",
    quickActions: ["FabricxAI", "NEXUS ARIA", "DevBridge", "Tell me about all three"],
  },
  academy: {
    prompt: "What do you want to learn? I can recommend the right course or workshop for your goals.",
    quickActions: ["Ship with AI tools", "Build production apps", "Team training", "Free resources"],
  },
  ventures: {
    prompt: "Tell me about your startup. I'll help you figure out if SocioFi Ventures is the right fit.",
    quickActions: ["Early-stage idea", "Working prototype", "Revenue but need tech", "Just curious about the model"],
  },
  cloud: {
    prompt: "What does your app run on? I'll help you figure out the right hosting setup.",
    quickActions: ["Node.js / Next.js", "Python / Django", "Docker containers", "Not sure yet"],
  },
  technology: {
    prompt: "Hey! I'm PILOT, SocioFi's assistant. What are you trying to do today? I can route you to the right division.",
    quickActions: ["Build a product", "Maintain my app", "Learn to build", "Host my app"],
  },
};

const DEFAULT_OPENER = {
  prompt: "Hey! I'm PILOT, SocioFi's assistant. What can I help you with today?",
  quickActions: ["What does SocioFi do?", "Which division is right for me?", "Pricing info", "Talk to a human"],
};

// ── Rich text parser ─────────────────────────────────────────────────────────
// Converts plain-text PILOT responses into React nodes:
// - **bold** → <strong>
// - [link text](url) → <a>
// - /path/to/page → clickable internal link
// - Lines starting with - or • → list items

function parseRichText(text: string, accent: string): React.ReactNode[] {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];

  lines.forEach((line, li) => {
    if (li > 0) nodes.push(<br key={`br-${li}`} />);

    // List item detection
    const listMatch = line.match(/^(\s*[-•]\s+)(.*)/);
    const content = listMatch ? listMatch[2] : line;
    const isListItem = !!listMatch;

    // Parse inline: **bold**, [text](url), and bare /paths
    const inlinePattern = /(\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)]+)\)|(\/[a-z][a-z0-9\-/]*(?:#[a-z0-9\-]*)?))/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = inlinePattern.exec(content)) !== null) {
      // Text before the match
      if (match.index > lastIndex) {
        parts.push(content.slice(lastIndex, match.index));
      }

      if (match[2]) {
        // **bold**
        parts.push(
          <strong key={`b-${li}-${match.index}`} style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
            {match[2]}
          </strong>
        );
      } else if (match[3] && match[4]) {
        // [text](url)
        const isExternal = match[4].startsWith('http');
        parts.push(
          <a
            key={`a-${li}-${match.index}`}
            href={match[4]}
            target={isExternal ? '_blank' : undefined}
            rel={isExternal ? 'noopener noreferrer' : undefined}
            style={{ color: accent, textDecoration: 'underline', textUnderlineOffset: 2 }}
          >
            {match[3]}
          </a>
        );
      } else if (match[5]) {
        // Bare /path
        parts.push(
          <a
            key={`p-${li}-${match.index}`}
            href={match[5]}
            style={{ color: accent, textDecoration: 'underline', textUnderlineOffset: 2 }}
          >
            {match[5]}
          </a>
        );
      }

      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
      parts.push(content.slice(lastIndex));
    }

    if (isListItem) {
      nodes.push(
        <span key={`li-${li}`} style={{ display: 'flex', gap: 6, paddingLeft: 4 }}>
          <span style={{ color: accent, flexShrink: 0 }}>&#x2022;</span>
          <span>{parts}</span>
        </span>
      );
    } else {
      nodes.push(<span key={`t-${li}`}>{parts}</span>);
    }
  });

  return nodes;
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function PILOTChat({
  division,
  pageUrl = '',
  pageTitle = '',
  embedded = false,
}: PILOTChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [conversationId] = useState(() => Math.random().toString(36).slice(2));
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const reduced = useReducedMotion();
  const isMobile = useIsMobile();
  const proactiveSentRef = useRef(0);

  const accent = division.accent || 'var(--teal)';
  const divisionKey = division.slug || 'technology';
  const opener = DIVISION_OPENERS[divisionKey] ?? DEFAULT_OPENER;

  // ── Session storage key ─────────────────────────────────────────────────────
  const storageKey = `pilot-chat-${divisionKey}`;

  // ── Scroll to bottom ────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ── Persist messages to sessionStorage ─────────────────────────────────────
  const skipPersistRef = useRef(true);
  useEffect(() => {
    if (skipPersistRef.current) { skipPersistRef.current = false; return; }
    if (messages.length <= 1) return; // Don't persist just the welcome message
    try {
      const toStore = messages
        .filter(m => m.content !== '...' && m.content !== '')
        .map(m => ({
          id: m.id,
          role: m.role,
          content: m.content,
          quickActions: m.quickActions,
          timestamp: m.timestamp.toISOString(),
        }));
      sessionStorage.setItem(storageKey, JSON.stringify({
        messages: toStore,
        conversationId,
        savedAt: Date.now(),
      }));
    } catch { /* sessionStorage full or unavailable */ }
  }, [messages, storageKey, conversationId]);

  // ── Init messages: restore from session or show opener ─────────────────────
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const data = JSON.parse(stored) as {
          messages: Array<{ id: string; role: 'pilot' | 'user'; content: string; quickActions?: (string | QuickAction)[]; timestamp: string }>;
          savedAt: number;
        };
        // Restore if saved within the last 24 hours
        const age = Date.now() - data.savedAt;
        if (age < 24 * 60 * 60 * 1000 && data.messages.length > 1) {
          setMessages(data.messages.map(m => ({ ...m, timestamp: new Date(m.timestamp) })));
          return;
        }
        sessionStorage.removeItem(storageKey);
      }
    } catch { /* ignore parse errors */ }

    setMessages([
      {
        id: 'welcome',
        role: 'pilot',
        content: opener.prompt,
        quickActions: opener.quickActions,
        timestamp: new Date(),
      },
    ]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [divisionKey]);

  // ── Proactive trigger ───────────────────────────────────────────────────────
  useEffect(() => {
    if (embedded || isOpen) return;
    const delay = pageUrl.includes('/pricing') || pageUrl.includes('/plans') ? 15000 : 8000;
    const timer = setTimeout(() => {
      if (proactiveSentRef.current < 3 && !isOpen) {
        setHasUnread(true);
        proactiveSentRef.current += 1;
      }
    }, delay);
    return () => clearTimeout(timer);
  }, [pageUrl, embedded, isOpen]);

  // ── Focus input when opened ─────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // ── Keyboard: Escape to close + focus trap ───────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab' || !isOpen || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), textarea, input:not([disabled]), select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      // Direct lead capture trigger phrases
      const lowerText = text.trim().toLowerCase();
      if (lowerText === 'talk to a human' || lowerText === 'connect me with someone' || lowerText === 'talk to someone' || lowerText === 'leave my details') {
        setMessages(prev => [
          ...prev,
          { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: new Date() },
          {
            id: (Date.now() + 1).toString(),
            role: 'pilot',
            content: "Absolutely! Let me collect a couple of details so the right person can reach out to you with full context of our conversation.",
            timestamp: new Date(),
          },
        ]);
        setInput('');
        setShowLeadForm(true);
        return;
      }

      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');
      setIsLoading(true);

      // Optimistic typing indicator
      const typingId = 'typing-' + Date.now();
      setMessages(prev => [
        ...prev,
        { id: typingId, role: 'pilot', content: '...', timestamp: new Date() },
      ]);

      try {
        // Short artificial delay so the typing indicator is visible
        await new Promise(resolve => setTimeout(resolve, 320 + Math.random() * 180));

        const result = matchIntent(text.trim(), divisionKey);

        const handoffSignals = ['connect you with', 'pass your details', 'reach out to you', 'connect you to', 'email hello@'];
        const shouldShowForm = handoffSignals.some(s => result.message.toLowerCase().includes(s));

        setMessages(prev => [
          ...prev.filter(m => m.id !== typingId),
          {
            id: Date.now().toString(),
            role: 'pilot',
            content: result.message,
            quickActions: shouldShowForm
              ? [{ label: 'Leave my details', action: 'message' as const }, ...result.quickActions]
              : result.quickActions,
            timestamp: new Date(),
          },
        ]);

        if (shouldShowForm) setShowLeadForm(true);
      } catch {
        setMessages(prev => [
          ...prev.filter(m => m.id !== typingId),
          {
            id: Date.now().toString(),
            role: 'pilot',
            content: 'Something went wrong. Email hello@sociofitechnology.com for immediate help.',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, divisionKey],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  // ── Lead capture ────────────────────────────────────────────────────────
  const requestLeadCapture = useCallback(() => {
    setShowLeadForm(true);
  }, []);

  const handleLeadComplete = useCallback((name: string) => {
    setShowLeadForm(false);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'pilot',
        content: `Done! I've passed everything along to the ${division.name} team. They'll reach out within 4 hours on business days. In the meantime, feel free to keep exploring or ask me anything else.`,
        quickActions: [
          { label: 'Browse services', action: 'navigate', url: '/studio' },
          { label: 'See pricing', action: 'navigate', url: '/studio/start-project' },
        ],
        timestamp: new Date(),
      },
    ]);
  }, [division.name]);

  // ── Embedded mode ───────────────────────────────────────────────────────────
  if (embedded) {
    return (
      <EmbeddedPanel
        messages={messages}
        input={input}
        setInput={setInput}
        handleSubmit={handleSubmit}
        sendMessage={sendMessage}
        isLoading={isLoading}
        accent={accent}
        messagesEndRef={messagesEndRef}
        inputRef={inputRef}
        division={division}
        showLeadForm={showLeadForm}
        onRequestLead={requestLeadCapture}
        onLeadComplete={handleLeadComplete}
        conversationId={conversationId}
        pageUrl={pageUrl}
      />
    );
  }

  // ── Floating mode ───────────────────────────────────────────────────────────
  return (
    <>
      {/* Mobile backdrop overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.5)',
              zIndex: 9998,
            }}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            ref={panelRef}
            initial={reduced ? { opacity: 0 } : isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, y: 20, scale: 0.97 }}
            animate={reduced ? { opacity: 1 } : isMobile ? { opacity: 1, y: 0 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : isMobile ? { opacity: 0, y: '100%' } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={isMobile
              ? { duration: 0.3, ease: [0.32, 0.72, 0, 1] }
              : { duration: 0.25, ease: [0.16, 1, 0.3, 1] }
            }
            role="dialog"
            aria-label="PILOT chat assistant"
            aria-modal="true"
            style={isMobile ? {
              // ── Mobile: full-width bottom sheet ──────────────────────
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              width: '100%',
              height: '75vh',
              maxHeight: 'calc(100vh - 40px)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-card)',
              border: `1px solid ${accent}26`,
              borderRadius: '24px 24px 0 0',
              boxShadow: `0 -8px 40px rgba(0,0,0,0.35), 0 0 0 1px ${accent}15`,
              overflow: 'hidden',
            } : {
              // ── Desktop: positioned panel ───────────────────────────
              position: 'fixed',
              bottom: 96,
              right: 24,
              width: 380,
              maxWidth: 'calc(100vw - 48px)',
              height: 520,
              maxHeight: 'calc(100vh - 120px)',
              zIndex: 9999,
              display: 'flex',
              flexDirection: 'column',
              background: 'var(--bg-card)',
              border: `1px solid ${accent}26`,
              borderRadius: 'var(--radius-lg)',
              boxShadow: `0 24px 80px rgba(0,0,0,0.35), 0 0 0 1px ${accent}15`,
              overflow: 'hidden',
            }}
          >
            <ChatPanel
              messages={messages}
              input={input}
              setInput={setInput}
              handleSubmit={handleSubmit}
              sendMessage={sendMessage}
              isLoading={isLoading}
              accent={accent}
              messagesEndRef={messagesEndRef}
              inputRef={inputRef}
              division={division}
              onClose={() => setIsOpen(false)}
              showLeadForm={showLeadForm}
              onRequestLead={requestLeadCapture}
              onLeadComplete={handleLeadComplete}
              conversationId={conversationId}
              pageUrl={pageUrl}
              isMobile={isMobile}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        ref={triggerRef}
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close PILOT chat' : 'Open PILOT chat'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        style={{
          position: 'fixed',
          bottom: isMobile ? 16 : 24,
          right: isMobile ? 16 : 24,
          width: isMobile ? 48 : 56,
          height: isMobile ? 48 : 56,
          borderRadius: '50%',
          background: accent,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 20px rgba(0,0,0,0.25), 0 0 0 0px ${accent}`,
          zIndex: 10000,
          transition: 'transform 0.2s var(--ease), box-shadow 0.2s var(--ease), width 0.2s, height 0.2s, bottom 0.2s, right 0.2s',
        }}
        whileHover={{ scale: 1.08, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
        whileTap={{ scale: 0.96 }}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            </motion.span>
          ) : (
            <motion.span
              key="avatar"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <PILOTAvatar size="md" mode="accent" accentColor="transparent" />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Unread badge */}
        <AnimatePresence>
          {hasUnread && !isOpen && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#EF4444',
                border: '2px solid var(--bg)',
              }}
              aria-label="New message"
            />
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
}

// ── Chat Panel Inner ───────────────────────────────────────────────────────────

interface PanelProps {
  messages: Message[];
  input: string;
  setInput: (v: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  sendMessage: (text: string) => void;
  isLoading: boolean;
  accent: string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  division: Division;
  onClose?: () => void;
  showLeadForm?: boolean;
  onRequestLead?: () => void;
  onLeadComplete?: (name: string) => void;
  conversationId?: string;
  pageUrl?: string;
  isMobile?: boolean;
}

function ChatPanel({
  messages,
  input,
  setInput,
  handleSubmit,
  sendMessage,
  isLoading,
  accent,
  messagesEndRef,
  inputRef,
  division,
  onClose,
  showLeadForm,
  onLeadComplete,
  conversationId = '',
  pageUrl = '',
  isMobile = false,
}: PanelProps) {
  return (
    <>
      {/* Mobile drag handle */}
      {isMobile && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: 10,
            paddingBottom: 2,
            flexShrink: 0,
            background: `linear-gradient(135deg, ${accent}18 0%, transparent 100%)`,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: 'var(--text-muted)',
              opacity: 0.35,
            }}
          />
        </div>
      )}

      {/* Header */}
      <div
        style={{
          padding: isMobile ? '10px 18px 14px' : '16px 18px 14px',
          borderBottom: `1px solid ${accent}15`,
          background: `linear-gradient(135deg, ${accent}20 0%, ${accent}08 50%, transparent 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <PILOTAvatar size="sm" mode="accent" accentColor={accent} />
          <div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '0.08em',
              }}
            >
              PILOT
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.7rem',
                color: 'var(--text-secondary)',
                letterSpacing: '0.02em',
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginTop: 1,
              }}
            >
              <span style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: '#22C55E',
                display: 'inline-block',
                boxShadow: '0 0 0 2px rgba(34,197,94,0.2)',
              }} />
              {division.name} · AI Assistant
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {/* Export conversation */}
          {messages.length > 1 && (
            <button
              onClick={() => {
                const transcript = messages
                  .filter(m => m.content !== '...' && m.content !== '')
                  .map(m => `[${m.role === 'pilot' ? 'PILOT' : 'You'}] ${m.content}`)
                  .join('\n\n');
                const blob = new Blob(
                  [`SocioFi PILOT Conversation\n${division.name} Division\n${new Date().toLocaleDateString()}\n${'─'.repeat(40)}\n\n${transcript}\n`],
                  { type: 'text/plain' }
                );
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `pilot-conversation-${Date.now()}.txt`;
                a.click();
                URL.revokeObjectURL(url);
              }}
              aria-label="Export conversation"
              title="Export conversation"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: 4,
                borderRadius: 8,
                display: 'flex',
                transition: 'color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = accent; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          )}
          {onClose && (
            <button
              onClick={onClose}
              aria-label="Close chat"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: 4,
                borderRadius: 8,
                display: 'flex',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        aria-busy={isLoading}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '18px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
        }}
      >
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            accent={accent}
            onQuickAction={sendMessage}
            conversationId={conversationId}
            divisionKey={division.slug}
          />
        ))}
        {showLeadForm && onLeadComplete && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
            <LeadCaptureForm
              accent={accent}
              division={division.slug || 'technology'}
              pageUrl={pageUrl}
              conversationId={conversationId}
              transcript={messages.filter(m => m.id !== 'welcome').map(m => ({
                role: m.role === 'pilot' ? 'assistant' : 'user',
                content: m.content,
              }))}
              onComplete={onLeadComplete}
            />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '12px 14px 14px',
          borderTop: `1px solid ${accent}15`,
          display: 'flex',
          gap: 8,
          flexShrink: 0,
          background: `linear-gradient(180deg, transparent 0%, ${accent}06 100%)`,
        }}
      >
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={isLoading}
          aria-label="Message PILOT"
          style={{
            flex: 1,
            padding: '10px 16px',
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = accent;
            e.target.style.boxShadow = `0 0 0 3px ${accent}18`;
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--border)';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          style={{
            padding: '10px 16px',
            background: `linear-gradient(135deg, var(--navy) 0%, ${accent} 100%)`,
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-full)',
            cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
            opacity: input.trim() && !isLoading ? 1 : 0.45,
            transition: 'opacity 0.2s, transform 0.15s, box-shadow 0.2s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: input.trim() && !isLoading ? `0 4px 12px ${accent}40` : 'none',
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </form>
      <style>{`
        .pilot-msg-meta {
          opacity: 0.55;
          transition: opacity 0.2s;
        }
      `}</style>
    </>
  );
}

// ── Embedded Panel ─────────────────────────────────────────────────────────────

function EmbeddedPanel(props: Omit<PanelProps, 'onClose'>) {
  const accent = props.accent;
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${accent}26`,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 400,
      }}
    >
      <ChatPanel {...props} />
    </div>
  );
}

// ── Message Bubble ─────────────────────────────────────────────────────────────

function MessageBubble({
  msg,
  accent,
  onQuickAction,
  conversationId,
  divisionKey,
}: {
  msg: Message;
  accent: string;
  onQuickAction: (text: string) => void;
  conversationId?: string;
  divisionKey?: string;
}) {
  const isPilot = msg.role === 'pilot';
  const isTyping = msg.content === '...' || msg.content === '';
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const handleFeedback = (rating: 'up' | 'down') => {
    if (feedback) return; // Already voted
    setFeedback(rating);
    fetch('/api/pilot/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message_id: msg.id,
        conversation_id: conversationId,
        rating,
        division: divisionKey,
      }),
    }).catch(() => { /* silent fail */ });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isPilot ? 'flex-start' : 'flex-end',
        gap: 6,
      }}
    >
      <div
        style={{
          maxWidth: '85%',
          padding: isTyping ? '10px 16px' : '12px 16px',
          borderRadius: isPilot ? '2px 18px 18px 18px' : '18px 2px 18px 18px',
          background: isPilot
            ? `linear-gradient(135deg, ${accent}18 0%, ${accent}08 100%)`
            : `linear-gradient(135deg, var(--navy-deep) 0%, var(--navy) 100%)`,
          border: isPilot ? `1px solid ${accent}30` : 'none',
          borderLeft: isPilot ? `2.5px solid ${accent}` : undefined,
          fontFamily: 'var(--font-body)',
          fontSize: '0.9rem',
          lineHeight: 1.65,
          color: isPilot ? 'var(--text-primary)' : '#FFFFFF',
        }}
      >
        {isTyping ? (
          <TypingDots accent={accent} />
        ) : isPilot ? (
          <span style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {parseRichText(msg.content, accent)}
          </span>
        ) : (
          <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
        )}
      </div>

      {/* Quick Actions */}
      {isPilot && msg.quickActions && msg.quickActions.length > 0 && !isTyping && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, maxWidth: '85%', marginTop: 2 }}>
          {msg.quickActions.map((raw, idx) => {
            const qa: QuickAction = typeof raw === 'string' ? { label: raw } : raw;
            const isNav = qa.action === 'navigate' && qa.url;

            if (isNav) {
              return (
                <a
                  key={`${qa.label}-${idx}`}
                  href={qa.url}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 'var(--radius-full)',
                    background: `${accent}10`,
                    border: `1px solid ${accent}35`,
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: accent,
                    cursor: 'pointer',
                    letterSpacing: '0.01em',
                    transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = `${accent}20`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${accent}60`;
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = `${accent}10`;
                    (e.currentTarget as HTMLElement).style.borderColor = `${accent}35`;
                  }}
                >
                  {qa.label}
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ opacity: 0.6 }}>
                    <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              );
            }

            return (
              <button
                key={`${qa.label}-${idx}`}
                onClick={() => onQuickAction(qa.label)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  background: `${accent}10`,
                  border: `1px solid ${accent}35`,
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  color: accent,
                  cursor: 'pointer',
                  letterSpacing: '0.01em',
                  transition: 'background 0.2s, border-color 0.2s, transform 0.15s',
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = `${accent}20`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${accent}60`;
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = `${accent}10`;
                  (e.currentTarget as HTMLElement).style.borderColor = `${accent}35`;
                }}
              >
                {qa.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Feedback + Timestamp */}
      <div className="pilot-msg-meta" style={{ display: 'flex', alignItems: 'center', gap: 8, paddingInline: 4, marginTop: 2, opacity: 0.55, transition: 'opacity 0.2s' }}>
        {isPilot && !isTyping && msg.id !== 'welcome' && msg.content.length > 0 && (
          <div style={{ display: 'flex', gap: 2 }}>
            <button
              onClick={() => handleFeedback('up')}
              aria-label="Good response"
              title="Good response"
              style={{
                background: 'none',
                border: 'none',
                cursor: feedback ? 'default' : 'pointer',
                padding: 2,
                borderRadius: 4,
                display: 'flex',
                opacity: feedback === 'down' ? 0.25 : feedback === 'up' ? 1 : 0.4,
                color: feedback === 'up' ? accent : 'var(--text-muted)',
                transition: 'opacity 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { if (!feedback) (e.currentTarget).style.opacity = '0.8'; }}
              onMouseLeave={e => { if (!feedback) (e.currentTarget).style.opacity = '0.4'; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill={feedback === 'up' ? 'currentColor' : 'none'} aria-hidden="true">
                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={() => handleFeedback('down')}
              aria-label="Poor response"
              title="Poor response"
              style={{
                background: 'none',
                border: 'none',
                cursor: feedback ? 'default' : 'pointer',
                padding: 2,
                borderRadius: 4,
                display: 'flex',
                opacity: feedback === 'up' ? 0.25 : feedback === 'down' ? 1 : 0.4,
                color: feedback === 'down' ? '#EF4444' : 'var(--text-muted)',
                transition: 'opacity 0.2s, color 0.2s',
              }}
              onMouseEnter={e => { if (!feedback) (e.currentTarget).style.opacity = '0.8'; }}
              onMouseLeave={e => { if (!feedback) (e.currentTarget).style.opacity = '0.4'; }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill={feedback === 'down' ? 'currentColor' : 'none'} aria-hidden="true">
                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--text-muted)',
            opacity: 0.7,
          }}
        >
          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

// ── Lead Capture Form (In-Chat) ───────────────────────────────────────────────

interface LeadFormProps {
  accent: string;
  division: string;
  pageUrl: string;
  conversationId: string;
  transcript: { role: string; content: string }[];
  onComplete: (name: string) => void;
}

function LeadCaptureForm({ accent, division, pageUrl, conversationId, transcript, onComplete }: LeadFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/pilot/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          notes: notes.trim(),
          division,
          page_url: pageUrl,
          conversation_id: conversationId,
          transcript,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Something went wrong.');
        return;
      }

      onComplete(name.trim());
    } catch {
      setError('Connection failed. Try emailing hello@sociofitechnology.com directly.');
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 10px',
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.82rem',
    color: 'var(--text-primary)',
    outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box' as const,
  };

  const labelStyle: React.CSSProperties = {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.65rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    marginBottom: 3,
    display: 'block',
  };

  return (
    <div
      style={{
        maxWidth: '85%',
        padding: '14px 16px',
        borderRadius: '4px 16px 16px 16px',
        background: `${accent}10`,
        border: `1px solid ${accent}25`,
      }}
    >
      <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.84rem', color: 'var(--text-primary)', marginBottom: 12, lineHeight: 1.5 }}>
        To connect you with the right person, I just need a couple of details. They will have the full context of our conversation.
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <label style={labelStyle}>Name *</label>
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Your name"
            required
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = accent; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
          />
        </div>

        <div>
          <label style={labelStyle}>Email *</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@example.com"
            type="email"
            required
            style={inputStyle}
            onFocus={e => { e.target.style.borderColor = accent; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
          />
        </div>

        <div>
          <label style={labelStyle}>Anything else? (optional)</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Budget, timeline, or other details..."
            rows={2}
            style={{ ...inputStyle, resize: 'vertical', minHeight: 48 }}
            onFocus={e => { e.target.style.borderColor = accent; }}
            onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
          />
        </div>

        {error && (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: '#EF4444' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={submitting || !name.trim() || !email.trim()}
          style={{
            padding: '9px 16px',
            background: accent,
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.82rem',
            fontWeight: 600,
            cursor: submitting ? 'wait' : 'pointer',
            opacity: submitting || !name.trim() || !email.trim() ? 0.6 : 1,
            transition: 'opacity 0.2s, transform 0.15s',
            letterSpacing: '-0.01em',
          }}
        >
          {submitting ? 'Sending...' : 'Send to Team'}
        </button>
      </form>
    </div>
  );
}

// ── Typing dots ────────────────────────────────────────────────────────────────

function TypingDots({ accent }: { accent: string }) {
  return (
    <span
      style={{ display: 'flex', gap: 4, alignItems: 'center', height: 16 }}
      aria-label="PILOT is typing"
    >
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
          style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: accent,
            display: 'inline-block',
          }}
        />
      ))}
    </span>
  );
}
