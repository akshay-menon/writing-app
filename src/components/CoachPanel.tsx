"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { sendCoachMessage } from "@/lib/coach/actions";
import type { CoachMessage } from "@/lib/coach/chat";

interface CoachPanelProps {
  promptText: string;
  currentWriting: string;
  entryType: "daily" | "fiction";
  sessionKey: string; // unique key for localStorage (e.g., promptId or date)
}

export function CoachPanel({
  promptText,
  currentWriting,
  entryType,
  sessionKey,
}: CoachPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [input, setInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const storageKey = `coach-chat-${sessionKey}`;

  // Load messages from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        // Invalid stored data, start fresh
      }
    }
  }, [storageKey]);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(storageKey, JSON.stringify(messages));
    }
  }, [messages, storageKey]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleSend = () => {
    if (!input.trim() || isPending) return;

    const userMessage: CoachMessage = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setError(null);

    startTransition(async () => {
      const result = await sendCoachMessage(newMessages, {
        promptText,
        currentWriting,
        entryType,
      });

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: result.response! },
        ]);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle Button - visible when panel is closed */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-4 top-1/2 -translate-y-1/2 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-800 px-3 py-4 rounded-l-lg shadow-lg hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors z-40"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          Coach
        </button>
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full bg-white dark:bg-stone-900 border-l border-stone-200 dark:border-stone-700 shadow-xl transition-transform duration-300 z-50 flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "min(400px, 100vw)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-stone-200 dark:border-stone-700">
          <h2 className="font-medium text-stone-900 dark:text-stone-100">
            Writing Coach
          </h2>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-stone-500 dark:text-stone-400 py-8">
              <p className="mb-2">Need help thinking through your writing?</p>
              <p className="text-sm">
                Ask questions, share where you&apos;re stuck, or explore ideas.
              </p>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`${
                msg.role === "user" ? "ml-8" : "mr-8"
              }`}
            >
              <div
                className={`p-3 rounded-lg ${
                  msg.role === "user"
                    ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                    : "bg-amber-50 dark:bg-amber-950/30 text-stone-800 dark:text-stone-200 border border-amber-200 dark:border-amber-900"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))}

          {isPending && (
            <div className="mr-8">
              <div className="p-3 rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900">
                <p className="text-sm text-stone-500 dark:text-stone-400">
                  Thinking<span className="animate-pulse">...</span>
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-700">
          <div className="flex gap-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="What's on your mind?"
              rows={2}
              className="flex-1 p-2 text-sm border border-stone-200 dark:border-stone-700 rounded-lg bg-transparent text-stone-900 dark:text-stone-100 placeholder:text-stone-400 resize-none focus:outline-none focus:ring-1 focus:ring-stone-400"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isPending}
              className="px-3 py-2 bg-stone-800 dark:bg-stone-200 text-white dark:text-stone-800 rounded-lg text-sm font-medium hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed self-end"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-stone-400 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
