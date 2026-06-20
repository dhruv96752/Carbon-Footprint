import { useState, useEffect, useRef, useCallback, useReducer } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Sparkles, Trash2, User, WifiOff } from 'lucide-react';
import { generateReply, welcomeMessage } from '../lib/chat';
import { useChatHistory, useProfile } from '../lib/store';
import PageTransition from '../components/PageTransition';

/**
 * Simulated streaming — reveals text character by character.
 * Uses useReducer to avoid lint "setState in effect" warnings;
 * the reset is dispatched at the start of the interval callback.
 */
function StreamingText({ text, speed = 18 }) {
  const [state, dispatch] = useReducer(
    (prev, action) => {
      if (action.type === 'tick') return { ...prev, displayed: text.slice(0, prev.i), i: prev.i + 1, done: prev.i + 1 >= text.length };
      if (action.type === 'reset') return { displayed: '', i: 0, done: false };
      return prev;
    },
    { displayed: '', i: 0, done: false }
  );

  useEffect(() => {
    dispatch({ type: 'reset' });
    let running = true;
    const interval = setInterval(() => {
      if (!running) return;
      dispatch({ type: 'tick' });
    }, speed);
    return () => { running = false; clearInterval(interval); };
  }, [text, speed]);

  // Parse simple markdown-like bold **text**
  const renderText = (str) => {
    const parts = str.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-earth-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      // Handle newlines
      return part.split('\n').map((line, j) => (
        <span key={`${i}-${j}`}>
          {line}
          {j < part.split('\n').length - 1 && <br />}
        </span>
      ));
    });
  };

  return (
    <span>
      {renderText(state.displayed)}
      {!state.done && <span className="inline-block w-1.5 h-4 bg-leaf-500 ml-0.5 animate-pulse rounded-sm" />}
    </span>
  );
}

/**
 * Sage chat page — a local AI chatbot that answers sustainability questions
 * using keyword-scoring intent classification and a curated knowledge base.
 * All processing happens in-browser with zero network calls.
 */
export default function Chat() {
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { messages, addMessage, clearHistory } = useChatHistory();
  const { footprint, streak, xp, level } = useProfile();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Welcome message on first visit
  useEffect(() => {
    if (messages.length === 0) {
      const welcome = welcomeMessage(footprint, { streak, xp, level });
      addMessage({ role: 'bot', text: welcome });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isTyping) return;
    setInput('');
    addMessage({ role: 'user', text });
    setIsTyping(true);

    // Small artificial delay for realism
    setTimeout(() => {
      const reply = generateReply(text, footprint, { streak, xp, level });
      addMessage({ role: 'bot', text: reply });
      setIsTyping(false);
    }, 400 + Math.random() * 400);
  }, [input, isTyping, footprint, streak, xp, level, addMessage]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const suggestions = [
    'What\'s my biggest emission source?',
    'How can I reduce my footprint?',
    'Tell me about food emissions',
    'How does my footprint compare?',
  ];

  return (
    <PageTransition className="min-h-screen flex flex-col">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 sm:px-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-leaf-400 to-leaf-700 text-white shadow-soft">
              <Bot className="h-5 w-5" strokeWidth={2.5} aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-earth-950 dark:text-white">Sage</h1>
              <p className="text-xs text-earth-500 flex items-center gap-1">
                <WifiOff className="h-3 w-3" aria-hidden="true" /> Runs locally — 100% private
              </p>
            </div>
          </div>
          {messages.length > 1 && (
            <button
              onClick={clearHistory}
              className="grid h-9 w-9 place-items-center rounded-lg border border-earth-200 dark:border-earth-700 text-earth-500 transition hover:text-red-500 hover:border-red-300"
              aria-label="Clear chat"
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto py-4 no-scrollbar"
          style={{ minHeight: '300px', maxHeight: 'calc(100vh - 320px)' }}
          role="log"
          aria-label="Conversation with Sage"
          aria-live="polite"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                    msg.role === 'user'
                      ? 'bg-earth-200 dark:bg-earth-700'
                      : 'bg-leaf-100 dark:bg-leaf-950'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="h-4 w-4 text-earth-600 dark:text-earth-300" aria-hidden="true" />
                  ) : (
                    <Sparkles className="h-4 w-4 text-leaf-600 dark:text-leaf-400" aria-hidden="true" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-leaf-600 text-white rounded-tr-md'
                      : 'bg-white dark:bg-earth-900 border border-earth-100 dark:border-earth-800 text-earth-700 dark:text-earth-300 rounded-tl-md'
                  }`}
                >
                  {msg.role === 'bot' ? (
                    <StreamingText text={msg.text} speed={14} />
                  ) : (
                    msg.text
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-leaf-100 dark:bg-leaf-950">
                <Sparkles className="h-4 w-4 text-leaf-600 dark:text-leaf-400" aria-hidden="true" />
              </div>
              <div className="rounded-2xl rounded-tl-md border border-earth-100 dark:border-earth-800 bg-white dark:bg-earth-900 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-earth-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 rounded-full bg-earth-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 rounded-full bg-earth-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => { setInput(s); inputRef.current?.focus(); }}
                className="pill border border-earth-200 dark:border-earth-700 bg-white/60 dark:bg-earth-900/40 text-earth-600 dark:text-earth-400 hover:border-leaf-400 hover:text-leaf-600 dark:hover:text-leaf-300 transition-all cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask Sage anything about carbon..."
            aria-label="Message for Sage"
            className="input flex-1"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="btn-primary disabled:opacity-40"
            aria-label="Send"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </PageTransition>
  );
}
