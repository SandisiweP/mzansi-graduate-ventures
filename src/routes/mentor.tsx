import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Send, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { SiteHeader } from "@/components/SiteHeader";
import { chatMentor } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "AI mentor — Spark" },
      { name: "description", content: "Talk to an AI startup mentor. Refine your idea, validate it, and figure out what to do next." },
      { property: "og:title", content: "AI mentor — Spark" },
      { property: "og:description", content: "Your pocket startup coach." },
    ],
  }),
  component: MentorPage,
});

type Msg = { role: "user" | "assistant"; content: string };

const STARTERS = [
  "Help me validate my idea this week",
  "How do I find my first 10 customers?",
  "What should I charge for my product?",
  "I'm scared to start. Where do I begin?",
];

const INTRO: Msg = {
  role: "assistant",
  content:
    "Hey, I'm Spark — your startup mentor.\n\nTell me what you're working on (or thinking about), and I'll help you sharpen it. No idea is too rough. What's on your mind?",
};

function MentorPage() {
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const fn = useServerFn(chatMentor);
  const mutation = useMutation({
    mutationFn: (history: Msg[]) => fn({ data: { messages: history } }),
    onSuccess: (res) => {
      setMessages((prev) => [...prev, { role: "assistant", content: res.reply }]);
    },
    onError: (err: Error) => toast.error(err.message || "Mentor is unavailable right now"),
  });

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, mutation.isPending]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || mutation.isPending) return;
    const next = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(next);
    setInput("");
    mutation.mutate(next.filter((m) => m !== INTRO));
  };

  return (
    <div className="flex min-h-screen flex-col bg-hero">
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 md:px-6 md:py-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-primary shadow-glow">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-display text-xl font-bold">Spark mentor</h1>
            <p className="text-xs text-muted-foreground">Always-on startup coach</p>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-border/60 bg-card-gradient p-4 md:p-6"
          style={{ minHeight: "50vh", maxHeight: "65vh" }}
        >
          {messages.map((m, i) => (
            <Bubble key={i} msg={m} />
          ))}
          {mutation.isPending && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
            </div>
          )}
        </div>

        {messages.length === 1 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-border bg-card/40 px-4 py-2 text-sm text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="mt-4 flex items-end gap-2 rounded-2xl border border-border bg-card/40 p-2 focus-within:border-primary"
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(input);
              }
            }}
            placeholder="Ask your mentor anything…"
            rows={1}
            className="max-h-40 flex-1 resize-none bg-transparent px-3 py-2 text-base focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || mutation.isPending}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow transition hover:opacity-90 disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </main>
    </div>
  );
}

function Bubble({ msg }: { msg: Msg }) {
  const isUser = msg.role === "user";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
    >
      <div
        className={`max-w-[85%] rounded-2xl px-5 py-3 text-sm leading-relaxed ${
          isUser
            ? "bg-gradient-primary text-primary-foreground shadow-glow"
            : "border border-border/60 bg-background/40 text-foreground"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap">{msg.content}</p>
        ) : (
          <div className="prose prose-invert prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-strong:text-primary-glow">
            <ReactMarkdown>{msg.content}</ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  );
}