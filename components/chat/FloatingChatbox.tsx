"use client";

import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useChat } from "@ai-sdk/react";
import { X } from "lucide-react";
import { useLanguage } from "@/components/providers/language-provider";

const WELCOME_MESSAGE =
  "Chào bạn! Mình là DasiLari, trợ lý ảo chuyên về du lịch Đà Lạt. Bạn cần mình gợi ý quán cafe, chỗ ăn uống hay lên lịch trình chữa lành tại đây không?";

const WELCOME_MESSAGE_EN =
  "Hello! I'm DasiLari, your local Da Lat travel assistant. Would you like cafe suggestions, food spots, or a healing itinerary here?";

const getMessageText = (message: UIMessage) => {
  return message.parts
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("\n")
    .trim();
};

function TypingIndicator() {
  return (
    <div className="mr-auto flex max-w-[85%] items-center gap-1 rounded-2xl bg-amber-50 px-3 py-3 text-slate-600">
      <span className="sr-only">DasiLari dang tra loi</span>
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="h-2.5 w-2.5 rounded-full bg-emerald-500"
          animate={{ y: [0, -4, 0], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.15,
          }}
        />
      ))}
    </div>
  );
}

const FloatingChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { language } = useLanguage();
  const formRef = useRef<HTMLFormElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const initialMessages = useMemo<UIMessage[]>(
    () => [
      {
        id: "dasilari-welcome",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: language === "en" ? WELCOME_MESSAGE_EN : WELCOME_MESSAGE,
          },
        ],
      },
    ],
    [language],
  );

  const { messages, sendMessage, status, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      headers: {
        "x-dasilari-language": language,
      },
    }),
    messages: initialMessages,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  const isSending = status === "submitted" || status === "streaming";

  const sendCurrentMessage = async () => {
    const text = input.trim();

    if (!text || isSending) {
      return;
    }

    setInput("");
    await sendMessage({ text });
  };

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendCurrentMessage();
  };

  const onMessageKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendCurrentMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-9999">
      <button
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Mo tro ly ao DasiLari"
        className="h-14 rounded-full bg-emerald-600 px-5 text-sm font-semibold text-white shadow-xl transition hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        Tro ly AI
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: 16,
              scale: 0.94,
              transformOrigin: "bottom right",
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-16 right-0 w-[min(92vw,24rem)] overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between bg-emerald-600 px-5 py-4 text-base font-semibold text-white">
              <span>DasiLari Chat</span>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Dong tro ly ao"
                className="rounded-full p-1 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <X size={18} />
              </button>
            </div>

            <div className="h-80 space-y-3 overflow-y-auto bg-emerald-50/25 px-4 py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.role === "user" ? "ml-auto bg-emerald-600 text-white" : "mr-auto bg-amber-50 text-slate-800"}`}
                >
                  {getMessageText(msg)}
                </div>
              ))}

              {isSending && <TypingIndicator />}

              <div ref={bottomRef} />
            </div>

            <form
              ref={formRef}
              onSubmit={onFormSubmit}
              className="flex items-center gap-2 border-t border-emerald-100 bg-white p-3"
            >
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onMessageKeyDown}
                placeholder="Hoi ve cafe, lich trinh, thoi tiet Da Lat..."
                rows={2}
                className="flex-1 resize-none rounded-xl border border-emerald-200 px-3 py-2 text-sm outline-none transition focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={isSending || !input.trim()}
                className="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-emerald-300"
              >
                Gui
              </button>
              <button
                type="button"
                onClick={() => setInput("")}
                className="rounded-xl border border-emerald-200 px-3 py-2 text-sm text-slate-600 transition hover:bg-emerald-50"
              >
                Xoa
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingChatbox;
