import React, { useEffect, useRef, useState } from "react";
import { FiCpu, FiMessageSquare, FiSend, FiStar, FiX, FiTrash2 } from "react-icons/fi";
import useAxiosPublic from "../../Hooks/UsePublic";

interface ChatMessage {
  sender: "user" | "ai";
  text: string;
}

const STORAGE_KEY = "quickbuzz_ai_chat_history";

export const AiSuggestionsChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Initialize state from localStorage if it exists
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error("Failed to parse saved chat history:", err);
      }
    }
    return [
      {
        sender: "ai",
        text: "Hello! 👋 I'm your QuickBuzz AI Shopping Assistant. Ask me anything about our products, categories, or prices and I'll suggest the best match for you!",
      },
    ];
  });
  
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const axiosPublic = useAxiosPublic();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  // Persist chat messages to localStorage whenever they update
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom whenever messages list grows or loading starts
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoading]);

  const clearChat = () => {
    setShowClearConfirm(true);
  };

  const confirmClearChat = () => {
    const initialChat: ChatMessage[] = [
      {
        sender: "ai",
        text: "Hello! 👋 I'm your QuickBuzz AI Shopping Assistant. Ask me anything about our products, categories, or prices and I'll suggest the best match for you!",
      },
    ];
    setMessages(initialChat);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialChat));
    setShowClearConfirm(false);
  };

  const parseMessageText = (text: string) => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      const [, linkText, url] = match;
      const matchIndex = match.index;

      if (matchIndex > lastIndex) {
        parts.push(text.substring(lastIndex, matchIndex));
      }

      parts.push(
        <a
          key={matchIndex}
          href={url}
          className="text-orange-500 hover:text-orange-600 underline font-bold transition-colors"
        >
          {linkText}
        </a>
      );

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
    setIsLoading(true);

    try {
      const res = await axiosPublic.post("/ai/chat", { message: userMessage });
      const reply = res.data?.data?.reply || "I couldn't process that request right now.";
      setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    } catch (err) {
      console.error("Chat API Error:", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "I am experiencing some database connectivity issues. Please try again soon! 🚀",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Glow Effect / Ping */}
      {!isOpen && (
        <span className="absolute inset-0 rounded-full bg-orange-500/40 animate-ping -z-10 pointer-events-none" />
      )}

      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className={`w-14 h-14 bg-gradient-to-tr from-orange-500 via-orange-600 to-amber-500 text-white rounded-full shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer border border-white/10 group focus:outline-none z-50`}
        aria-label="AI Chatbot Assistant"
      >
        {isOpen ? (
          <FiX className="text-2xl transition-transform duration-300 rotate-90" />
        ) : (
          <div className="relative">
            <FiMessageSquare className="text-2xl transition-transform duration-300 group-hover:rotate-6" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
            </span>
          </div>
        )}
      </button>

      {/* Interactive Chat Window Popup */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-76 sm:w-80 h-96 max-h-[420px] bg-white rounded-2xl shadow-2xl border border-gray-150 overflow-hidden flex flex-col animate-fadeIn transition-all duration-300 z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 text-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <FiCpu className="text-base animate-pulse" />
              <h3 className="text-xs font-bold flex items-center gap-1 leading-none">
                QuickBuzz AI <FiStar size={10} className="text-amber-300 fill-amber-300" />
              </h3>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={clearChat}
                title="Clear Chat History"
                className="p-1 hover:bg-white/10 rounded-md transition-colors focus:outline-none cursor-pointer"
              >
                <FiTrash2 className="text-sm" />
              </button>
              <button
                onClick={toggleChat}
                className="p-1 hover:bg-white/10 rounded-md transition-colors focus:outline-none cursor-pointer"
              >
                <FiX className="text-base" />
              </button>
            </div>
          </div>

          {/* Messages List Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 flex flex-col gap-3">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-start gap-2.5 max-w-[85%] ${
                  msg.sender === "user" ? "self-end flex-row-reverse" : "self-start"
                }`}
              >
                {msg.sender === "ai" && (
                  <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0 border border-orange-200/50 shadow-sm">
                    <FiCpu size={13} />
                  </div>
                )}
                <div
                  className={`px-3 py-2 text-[11px] leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-tr from-orange-500 to-orange-600 text-white rounded-2xl rounded-tr-none border border-orange-600/30"
                      : "bg-white text-gray-800 rounded-2xl rounded-tl-none border border-gray-150"
                  }`}
                >
                  {parseMessageText(msg.text)}
                </div>
              </div>
            ))}

            {/* Bouncing Dots Typing Loader */}
            {isLoading && (
              <div className="flex items-start gap-2.5 self-start">
                <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 flex-shrink-0 border border-orange-200/50 shadow-sm">
                  <FiCpu size={13} />
                </div>
                <div className="flex items-center gap-1 px-3 py-2.5 bg-white border border-gray-150 rounded-2xl rounded-tl-none shadow-sm">
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Active Input form */}
          <form
            onSubmit={handleSend}
            className="p-2.5 border-t border-gray-150 bg-white flex items-center gap-2 flex-shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me for suggestions..."
              disabled={isLoading}
              className="flex-1 bg-gray-50 border border-gray-200/80 rounded-xl px-4 py-2 text-[11px] text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:bg-white transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl focus:outline-none transition-all duration-200 disabled:bg-gray-100 disabled:text-gray-300 disabled:cursor-not-allowed shadow-md shadow-orange-500/20 active:scale-95"
            >
              <FiSend size={12} />
            </button>
          </form>

          {/* Custom Confirmation Modal Overlay */}
          {showClearConfirm && (
            <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-50 animate-fadeIn">
              <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-150 max-w-[85%] text-center animate-scaleIn">
                <h4 className="text-xs font-bold text-gray-800 mb-1.5">Clear Chat History?</h4>
                <p className="text-[10px] text-gray-500 mb-4 leading-relaxed">
                  This will permanently erase your shopping assistant conversation history.
                </p>
                <div className="flex gap-2 justify-center">
                  <button
                    type="button"
                    onClick={() => setShowClearConfirm(false)}
                    className="px-3 py-1.5 bg-gray-150 hover:bg-gray-200 text-gray-700 text-[10px] font-bold rounded-lg transition-all active:scale-95 cursor-pointer focus:outline-none"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmClearChat}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-lg transition-all active:scale-95 shadow-md shadow-red-500/25 cursor-pointer focus:outline-none"
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
