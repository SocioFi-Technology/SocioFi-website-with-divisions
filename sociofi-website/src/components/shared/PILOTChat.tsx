'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import PILOTAvatar from './PILOTAvatar';
import type { Division } from '@/lib/divisions';

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'pilot' | 'user';
  content: string;
  quickActions?: string[];
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
  const [conversationId] = useState(() => Math.random().toString(36).slice(2));
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const reduced = useReducedMotion();
  const proactiveSentRef = useRef(0);

  const accent = division.accent || 'var(--teal)';
  const divisionKey = division.slug || 'technology';
  const opener = DIVISION_OPENERS[divisionKey] ?? DEFAULT_OPENER;

  // ── Scroll to bottom ────────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ── Init messages with opener ───────────────────────────────────────────────
  useEffect(() => {
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

  // ── Keyboard: Escape to close ───────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  // ── Send message ────────────────────────────────────────────────────────────
  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

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
        const response = await fetch('/api/pilot/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text.trim(),
            conversation_id: conversationId,
            division: divisionKey,
            page_url: pageUrl,
            page_title: pageTitle,
            history: messages
              .filter(m => m.id !== 'welcome')
              .map(m => ({
                role: m.role === 'pilot' ? 'assistant' : 'user',
                content: m.content,
              })),
          }),
        });

        const data = (await response.json()) as { message?: string; quickActions?: string[] };

        setMessages(prev => [
          ...prev.filter(m => m.id !== typingId),
          {
            id: Date.now().toString(),
            role: 'pilot',
            content:
              data.message ||
              "I'm not sure how to help with that. Want me to connect you with a real person?",
            quickActions: data.quickActions,
            timestamp: new Date(),
          },
        ]);
      } catch {
        setMessages(prev => [
          ...prev.filter(m => m.id !== typingId),
          {
            id: Date.now().toString(),
            role: 'pilot',
            content:
              'Something went wrong on my end. For immediate help, email hello@sociofitechnology.com or use the contact form.',
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, conversationId, divisionKey, pageUrl, pageTitle, messages],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

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
      />
    );
  }

  // ── Floating mode ───────────────────────────────────────────────────────────
  return (
    <>
      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
            animate={reduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            role="dialog"
            aria-label="PILOT chat assistant"
            aria-modal="true"
            style={{
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
              boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
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
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close PILOT chat' : 'Open PILOT chat'}
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: accent,
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 4px 20px rgba(0,0,0,0.25), 0 0 0 0px ${accent}`,
          zIndex: 10000,
          transition: 'transform 0.2s var(--ease), box-shadow 0.2s var(--ease)',
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
}: PanelProps) {
  return (
    <>
      {/* Header */}
      <div
        style={{
          padding: '14px 16px 12px',
          borderBottom: '1px solid var(--border)',
          background: `linear-gradient(135deg, ${accent}12 0%, transparent 100%)`,
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
                fontSize: '0.82rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                letterSpacing: '0.05em',
              }}
            >
              PILOT
            </div>
            <div
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.65rem',
                color: accent,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {division.name} · AI Assistant
            </div>
          </div>
        </div>
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

      {/* Messages */}
      <div
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '16px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        {messages.map(msg => (
          <MessageBubble
            key={msg.id}
            msg={msg}
            accent={accent}
            onQuickAction={sendMessage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        style={{
          padding: '12px 14px',
          borderTop: '1px solid var(--border)',
          display: 'flex',
          gap: 8,
          flexShrink: 0,
          background: 'var(--bg-card)',
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
            padding: '9px 12px',
            background: 'var(--bg-2)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
            color: 'var(--text-primary)',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => {
            e.target.style.borderColor = accent;
          }}
          onBlur={e => {
            e.target.style.borderColor = 'var(--border)';
          }}
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          aria-label="Send message"
          style={{
            padding: '9px 14px',
            background: accent,
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius-sm)',
            cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
            opacity: input.trim() && !isLoading ? 1 : 0.5,
            transition: 'opacity 0.2s, transform 0.15s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
}: {
  msg: Message;
  accent: string;
  onQuickAction: (text: string) => void;
}) {
  const isPilot = msg.role === 'pilot';
  const isTyping = msg.content === '...';

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
          padding: isTyping ? '10px 16px' : '10px 14px',
          borderRadius: isPilot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
          background: isPilot ? `${accent}14` : 'var(--bg-3)',
          border: isPilot ? `1px solid ${accent}20` : '1px solid var(--border)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          lineHeight: 1.6,
          color: 'var(--text-primary)',
        }}
      >
        {isTyping ? (
          <TypingDots accent={accent} />
        ) : (
          <span style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
        )}
      </div>

      {/* Quick Actions */}
      {isPilot && msg.quickActions && msg.quickActions.length > 0 && !isTyping && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, maxWidth: '85%' }}>
          {msg.quickActions.map(action => (
            <button
              key={action}
              onClick={() => onQuickAction(action)}
              style={{
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                background: `${accent}12`,
                border: `1px solid ${accent}30`,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: accent,
                cursor: 'pointer',
                letterSpacing: '0.04em',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => {
                (e.target as HTMLElement).style.background = `${accent}22`;
              }}
              onMouseLeave={e => {
                (e.target as HTMLElement).style.background = `${accent}12`;
              }}
            >
              {action}
            </button>
          ))}
        </div>
      )}

      {/* Timestamp */}
      <span
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.58rem',
          color: 'var(--text-muted)',
          paddingInline: 4,
        }}
      >
        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
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
