import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MessageSquare, CornerDownLeft, RefreshCw, Wand2 } from 'lucide-react';
import { ChatMessage, DesignStyle } from '../types/interior';

interface ConsultantChatProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  style: DesignStyle;
  onApplyVisualRefinement: (refinement: { rugColor?: string; wallColor?: string; summary?: string }) => void;
  pendingRefinement?: { rugColor?: string; wallColor?: string; summary?: string } | null;
}

export const ConsultantChat: React.FC<ConsultantChatProps> = ({
  messages,
  onSendMessage,
  isLoading,
  style,
  onApplyVisualRefinement,
  pendingRefinement,
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleChipClick = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  return (
    <section id="consultant" className="w-full my-8 rounded-2xl border border-white/10 bg-[#14171f] p-5 sm:p-6 shadow-xl">
      {/* Consultant Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500/20 to-amber-300/30 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif text-lg font-semibold text-white">
                Aura Design Consultant
              </h3>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                ACTIVE · {style.name}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Context-aware architectural styling, layout refinement & shoppable recommendations
            </p>
          </div>
        </div>

        {/* Pending Refinement Apply Banner */}
        {pendingRefinement && (
          <div className="flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 px-3 py-1.5 rounded-lg text-xs text-amber-300">
            <Wand2 className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>Refinement ready: {pendingRefinement.summary || 'Visual tweaks'}</span>
            <button
              onClick={() => onApplyVisualRefinement(pendingRefinement)}
              className="ml-2 px-2.5 py-0.5 rounded bg-amber-400 text-slate-950 font-semibold text-[11px] hover:bg-amber-300 transition-colors"
            >
              Update Slider
            </button>
          </div>
        )}
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="my-3 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] text-slate-400 shrink-0 font-medium">Quick Refinements:</span>
        {style.suggestedPrompts.slice(0, 4).map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(prompt)}
            disabled={isLoading}
            className="shrink-0 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs transition-colors text-left"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Scrollable Conversation Thread */}
      <div className="h-[340px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-white/10 my-3">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-2 mb-1 px-1">
                <span className="text-[11px] font-mono text-slate-500 uppercase">
                  {isUser ? 'You' : 'Aura Consultant'}
                </span>
                <span className="text-[10px] text-slate-600">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  isUser
                    ? 'bg-amber-400 text-slate-950 font-medium rounded-tr-none shadow-md'
                    : 'bg-[#1a1f2c] text-slate-200 border border-white/10 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>

                {/* If assistant suggested a visual refinement */}
                {msg.suggestedChanges && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between gap-2">
                    <span className="text-xs text-amber-300 flex items-center gap-1.5 font-medium">
                      <Sparkles className="w-3 h-3" />
                      Visual refinement detected
                    </span>
                    <button
                      onClick={() => onApplyVisualRefinement(msg.suggestedChanges!)}
                      className="px-2.5 py-1 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold transition-colors"
                    >
                      Apply to Visualizer
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex flex-col items-start">
            <div className="text-[11px] font-mono text-slate-500 mb-1 px-1">
              Aura Consultant is styling...
            </div>
            <div className="rounded-2xl rounded-tl-none bg-[#1a1f2c] border border-white/10 px-4 py-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} className="relative mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask anything: e.g., "Keep this layout but make the rug navy blue", "Swap the coffee table", or "Suggest budget lighting"...`}
          disabled={isLoading}
          className="w-full pl-4 pr-24 py-3 rounded-xl bg-black/40 border border-white/15 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all"
        />

        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:opacity-40 disabled:hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors shadow-sm"
          >
            <span>Send</span>
            <CornerDownLeft className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </section>
  );
};
