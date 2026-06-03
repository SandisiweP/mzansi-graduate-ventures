import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2, MessageCircle, Sparkles } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { generateIdeas, type BusinessIdea } from "@/lib/ai.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/generate")({
  head: () => ({
    meta: [
      { title: "Idea generator — Spark" },
      { name: "description", content: "Get three tailored business ideas at the intersection of your skills, passions, and the problems you want to solve." },
      { property: "og:title", content: "Idea generator — Spark" },
      { property: "og:description", content: "Three tailored business ideas, grounded in who you are." },
    ],
  }),
  component: GeneratePage,
});

type Step = 0 | 1 | 2 | 3;

const PROMPTS = [
  {
    key: "skills" as const,
    title: "What are you good at?",
    hint: "Hard skills, soft skills, things people ask you for help with.",
    placeholder: "e.g. I'm good at video editing, listening to people, organizing chaos, picking up new tools quickly…",
  },
  {
    key: "passions" as const,
    title: "What do you love?",
    hint: "What could you talk about for hours? What do you do for fun?",
    placeholder: "e.g. cooking African food, helping younger students, urban gardening, sneaker culture…",
  },
  {
    key: "worldNeeds" as const,
    title: "What does the world (around you) need?",
    hint: "What problems frustrate you? What's broken where you live?",
    placeholder: "e.g. small shops can't compete online, my campus has no good late-night food, mental health is stigmatized…",
  },
];

function GeneratePage() {
  const [step, setStep] = useState<Step>(0);
  const [form, setForm] = useState({ skills: "", passions: "", worldNeeds: "", resources: "" });
  const [ideas, setIdeas] = useState<BusinessIdea[] | null>(null);

  const fn = useServerFn(generateIdeas);
  const mutation = useMutation({
    mutationFn: () => fn({ data: form }),
    onSuccess: (res) => {
      setIdeas(res.ideas);
      setStep(3);
    },
    onError: (err: Error) => toast.error(err.message || "Something went wrong"),
  });

  const currentField = step < 3 ? PROMPTS[step] : null;
  const currentValue = currentField ? form[currentField.key] : "";
  const canAdvance = (currentValue ?? "").trim().length > 3;

  const onNext = () => {
    if (step === 2) mutation.mutate();
    else setStep((s) => ((s + 1) as Step));
  };

  return (
    <div className="min-h-screen bg-hero">
      <SiteHeader />
      <main className="mx-auto max-w-3xl px-6 py-16">
        {step < 3 && currentField && (
          <div>
            <Progress step={step} total={3} />
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.35 }}
                className="mt-10"
              >
                <p className="font-display text-sm uppercase tracking-widest text-primary-glow">
                  Step {step + 1} of 3
                </p>
                <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
                  {currentField.title}
                </h1>
                <p className="mt-3 text-muted-foreground">{currentField.hint}</p>
                <textarea
                  autoFocus
                  value={currentValue}
                  onChange={(e) => setForm({ ...form, [currentField.key]: e.target.value })}
                  placeholder={currentField.placeholder}
                  rows={6}
                  className="mt-8 w-full resize-none rounded-3xl border border-border bg-card/40 p-6 text-lg leading-relaxed text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/20"
                />
                <div className="mt-8 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setStep((s) => (s > 0 ? ((s - 1) as Step) : s))}
                    disabled={step === 0 || mutation.isPending}
                    className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm text-muted-foreground transition hover:text-foreground disabled:opacity-30"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={onNext}
                    disabled={!canAdvance || mutation.isPending}
                    className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" /> Sparking ideas…
                      </>
                    ) : step === 2 ? (
                      <>
                        <Sparkles className="h-4 w-4" /> Generate my ideas
                      </>
                    ) : (
                      <>
                        Next <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {step === 3 && ideas && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className="font-display text-sm uppercase tracking-widest text-primary-glow">
              Your ideas
            </p>
            <h1 className="mt-3 font-display text-4xl font-bold md:text-5xl">
              Three sparks, tailored to you.
            </h1>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Pick one that excites you. Then take it to the mentor to sharpen it.
            </p>
            <div className="mt-10 space-y-6">
              {ideas.map((idea, i) => (
                <IdeaCard key={i} idea={idea} />
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setIdeas(null);
                  setStep(0);
                  setForm({ skills: "", passions: "", worldNeeds: "", resources: "" });
                }}
                className="rounded-full border border-border bg-card/40 px-6 py-3 font-medium transition hover:bg-card/70"
              >
                Start over
              </button>
              <Link
                to="/mentor"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
              >
                <MessageCircle className="h-4 w-4" /> Talk to mentor
              </Link>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function Progress({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition ${i <= step ? "bg-gradient-primary" : "bg-border"}`}
        />
      ))}
    </div>
  );
}

function IdeaCard({ idea }: { idea: BusinessIdea }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="overflow-hidden rounded-3xl border border-border/60 bg-card-gradient p-8 shadow-elegant"
    >
      <h2 className="font-display text-3xl font-bold text-gradient">{idea.name}</h2>
      <p className="mt-2 text-lg text-muted-foreground italic">{idea.tagline}</p>
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <Field label="The problem" value={idea.problem} />
        <Field label="The solution" value={idea.solution} />
        <Field label="Who it's for" value={idea.audience} />
        <Field label="How it makes money" value={idea.monetization} />
      </div>
      <div className="mt-6 rounded-2xl border border-border/60 bg-background/40 p-5">
        <p className="font-display text-xs uppercase tracking-widest text-primary-glow">First steps this week</p>
        <ol className="mt-3 space-y-2">
          {idea.firstSteps.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="font-display font-bold text-gradient">{i + 1}.</span>
              <span>{s}</span>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-6 text-sm italic text-muted-foreground">— Why you: {idea.whyYou}</p>
    </motion.div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-display text-xs uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}