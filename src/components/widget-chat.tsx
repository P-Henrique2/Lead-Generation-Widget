"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";

type MessageWithParts = {
  id: string;
  role: string;
  content?: string | null;
  parts?: Array<unknown>;
};

function getMessageText(message: MessageWithParts | undefined) {
  if (!message) {
    return "";
  }

  if (typeof message.content === "string") {
    return message.content;
  }

  if (Array.isArray(message.parts)) {
    return message.parts
      .map((part) => {
        if (typeof part === "string") {
          return part;
        }

        if (typeof part === "object" && part !== null) {
          const candidate = part as { text?: unknown; content?: unknown };

          if (typeof candidate.text === "string") {
            return candidate.text;
          }

          if (typeof candidate.content === "string") {
            return candidate.content;
          }
        }

        return "";
      })
      .join("");
  }

  return "";
}

export function WidgetChat() {
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const isNearBottomRef = useRef(true);
  const [input, setInput] = useState("");
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);
  const { messages, status, stop, error, sendMessage } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const latestAssistantMessage = [...messages].reverse().find((message) => message.role === "assistant");
  const latestAssistantText = getMessageText(latestAssistantMessage);
  const isStreaming = status === "submitted" || status === "streaming";
  const latestMessage = messages[messages.length - 1];
  const isLatestMessageEmptyAssistant =
    latestMessage?.role === "assistant" && getMessageText(latestMessage).length === 0;
  const shouldShowThinking =
    isStreaming && (latestMessage?.role !== "assistant" || isLatestMessageEmptyAssistant);

  const scrollToBottom = (smooth = false) => {
    const viewport = scrollViewportRef.current;

    if (!viewport) {
      return;
    }

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  };

  useEffect(() => {
    const viewport = scrollViewportRef.current;

    if (!viewport) {
      return;
    }

    const handleScroll = () => {
      const distanceFromBottom = viewport.scrollHeight - (viewport.scrollTop + viewport.clientHeight);
      const nearBottom = distanceFromBottom <= 48;

      isNearBottomRef.current = nearBottom;

      if (nearBottom) {
        setShowJumpToLatest(false);
      }
    };

    viewport.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      viewport.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!isNearBottomRef.current) {
      setShowJumpToLatest(true);
      return;
    }

    const frame = requestAnimationFrame(() => {
      if (isNearBottomRef.current) {
        scrollToBottom(false);
      } else {
        setShowJumpToLatest(true);
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [messages, status]);


  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const messageText = input.trim();

    if (!messageText || isStreaming) {
      return;
    }

    setShowJumpToLatest(false);
    setInput("");
    void sendMessage({ text: messageText });
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      const messageText = input.trim();

      if (!messageText || isStreaming) {
        return;
      }

      setShowJumpToLatest(false);
      setInput("");
      void sendMessage({ text: messageText });
    }
  };

  return (
    <div className="flex h-[72vh] min-h-[540px] flex-col overflow-hidden rounded-[2rem] border border-slate-800 bg-slate-950/80 shadow-2xl">
      <header className="border-b border-slate-800 px-4 py-4 sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-400">Widget chat</p>
            <h2 className="mt-1 text-lg font-semibold text-white">Ask about your team and timeline</h2>
          </div>
          <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-200">
            {isStreaming ? "Reply streaming" : "Ready"}
          </div>
        </div>
      </header>

      <div ref={scrollViewportRef} className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-4 text-sm leading-7 text-cyan-100">
              Start with a question about your team size, current workflow pain points, or your timeline and I’ll help qualify whether Flowstate is a fit.
            </div>
          )}

          {messages.map((message) => {
            const text = getMessageText(message);
            const isUser = message.role === "user";

            return (
              <div key={message.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-7 shadow-sm sm:max-w-[78%] ${
                    isUser
                      ? "bg-cyan-500 text-slate-950"
                      : "border border-slate-800 bg-slate-900/90 text-slate-100"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{text}</p>
                </div>
              </div>
            );
          })}

          {shouldShowThinking && (
            <div className="flex justify-start">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/90 px-4 py-3 text-sm text-slate-300">
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
                  <span className="h-2 w-2 animate-[pulse_1.4s_ease-in-out_infinite] rounded-full bg-cyan-400/80" />
                  <span className="h-2 w-2 animate-[pulse_1.8s_ease-in-out_infinite] rounded-full bg-cyan-400/60" />
                </span>
                <span>Thinking…</span>
              </div>
            </div>
          )}

          {error ? (
            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-200" role="alert">
              {error.message}
            </div>
          ) : null}
        </div>
      </div>

      <div className="border-t border-slate-800 bg-slate-950/90 px-3 py-3 sm:px-4 sm:py-4">
        {showJumpToLatest && (
          <div className="mx-auto mb-2 flex max-w-3xl justify-center">
            <button
              type="button"
              onClick={() => {
                setShowJumpToLatest(false);
                scrollToBottom(true);
              }}
              className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400/20"
            >
              Jump to latest
            </button>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="mx-auto flex max-w-3xl items-end gap-2">
          <label className="sr-only" htmlFor="widget-chat-input">
            Message
          </label>

          <textarea
            id="widget-chat-input"
            rows={1}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message…"
            className="min-h-[52px] flex-1 resize-none rounded-2xl border border-slate-700 bg-slate-900/90 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:border-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/30"
            style={{ maxHeight: "144px" }}
          />

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => stop()}
              disabled={!isStreaming}
              className="h-[52px] rounded-2xl border border-slate-700 bg-slate-900/90 px-4 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Stop
            </button>
            <button
              type="submit"
              disabled={!input.trim() || isStreaming}
              className="h-[52px] rounded-2xl bg-cyan-500 px-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
