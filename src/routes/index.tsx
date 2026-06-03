import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Compass, Lightbulb, MessageCircle, Target, Rocket, HeartHandshake, Wifi, ShieldCheck, GraduationCap, Sparkles, Briefcase } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import heroImg from "@/assets/hero-constellation.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Spark — entrepreneurship for South African youth" },
      { name: "description", content: "An AI mentor and business idea generator built for South African graduates and youth. Turn skills and passions into a real, scrappy business — even with limited tech and capital." },
      { property: "og:title", content: "Spark — entrepreneurship for South African youth" },
      { property: "og:description", content: "AI mentor + idea generator for SA graduates facing 19.5% youth unemployment. Build skills, work experience, and a real business — starting from a smartphone." },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-hero">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-6">
        <Hero />
        <Mission />
        <Bento />
        <Process />
        <FinalCta />
        <Footer />
      </main>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-20 pb-28 md:pt-32 md:pb-40">
      <div className="grid items-center gap-12 md:grid-cols-[1.05fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/40 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-glow shadow-glow" />
            Built for South African graduates &amp; youth
          </span>
          <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
            19.5% of SA graduates are unemployed. <span className="text-gradient">Don't wait for a job — build one.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
            Spark is a pocket startup mentor for graduates and youth from townships,
            rural, and underprivileged areas. Map your skills, your passions, and the
            problems you see around you — get scrappy, low-capital business ideas you
            can start this week from a smartphone, and a mentor who helps you take the
            first real step.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/generate"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-4 text-base font-semibold text-primary-foreground shadow-glow transition hover:shadow-elegant"
            >
              Find my business idea
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              to="/mentor"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/40 px-6 py-4 text-base font-medium backdrop-blur transition hover:bg-card/70"
            >
              <MessageCircle className="h-4 w-4" /> Talk to a mentor
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-primary opacity-30 blur-3xl" />
          <img
            src={heroImg}
            alt="Glowing constellation of ideas"
            width={1536}
            height={1024}
            className="rounded-3xl border border-border/60 shadow-elegant"
          />
        </motion.div>
      </div>
    </section>
  );
}

function Bento() {
  return (
    <section className="py-16">
      <div className="mb-12 max-w-2xl">
        <h2 className="font-display text-4xl font-bold md:text-5xl">
          Everything a first-time founder needs.
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          No business degree required. Just curiosity and a willingness to start small.
        </p>
      </div>
      <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 gap-4 md:grid-cols-3 md:grid-rows-2">
        <Card className="md:col-span-2 md:row-span-2" icon={<Lightbulb className="h-5 w-5" />} title="AI idea generator">
          <p className="text-muted-foreground">
            Answer three questions about your skills, passions, and the world you want
            to change. Get three sharp, low-capital business ideas you could actually start
            this week — with concrete first steps for each.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-2 text-xs">
            {["Skills", "Passions", "World needs"].map((t) => (
              <div key={t} className="rounded-xl border border-border/60 bg-card/40 px-3 py-4 text-center font-medium text-muted-foreground">
                {t}
              </div>
            ))}
          </div>
        </Card>
        <Card icon={<Compass className="h-5 w-5" />} title="Find your ikigai">
          The sweet spot where what you're good at meets what people will pay for.
        </Card>
        <Card icon={<MessageCircle className="h-5 w-5" />} title="Always-on mentor">
          A coach in your pocket. Ask anything — from "how do I validate?" to "what
          should I charge?"
        </Card>
        <Card icon={<Target className="h-5 w-5" />} title="Concrete next steps">
          Every idea ships with three small, doable actions for this week.
        </Card>
        <Card icon={<HeartHandshake className="h-5 w-5" />} title="Built for limited resources">
          Bootstrap-friendly playbooks. No "raise a seed round" advice for someone
          who just wants to start.
        </Card>
        <Card icon={<Rocket className="h-5 w-5" />} title="From idea to first customer">
          Spark walks you from a fuzzy spark to a real validated thing — one step at
          a time.
        </Card>
      </div>
    </section>
  );
}

function Card({
  children,
  icon,
  title,
  className = "",
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
  title: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
      className={`group relative overflow-hidden rounded-3xl border border-border/60 bg-card-gradient p-6 transition hover:border-primary/40 ${className}`}
    >
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary text-primary-foreground shadow-glow">
        {icon}
      </div>
      <h3 className="mb-2 font-display text-xl font-semibold">{title}</h3>
      <div className="text-sm text-muted-foreground">{children}</div>
    </motion.div>
  );
}

function Process() {
  const steps = [
    { n: "01", t: "Map yourself", d: "Skills, passions, and the problems that keep you up at night." },
    { n: "02", t: "Generate ideas", d: "Three tailored business concepts grounded in who you actually are." },
    { n: "03", t: "Pick one. Talk it through.", d: "Refine your favorite with the AI mentor — challenge it, sharpen it." },
    { n: "04", t: "Take step one this week", d: "Walk away with three small actions you can finish in seven days." },
  ];
  return (
    <section className="py-20">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <h2 className="max-w-xl font-display text-4xl font-bold md:text-5xl">
          From <em className="not-italic text-gradient">spark</em> to startup, in four steps.
        </h2>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {steps.map((s) => (
          <div key={s.n} className="rounded-3xl border border-border/60 bg-card-gradient p-6">
            <div className="font-display text-3xl font-bold text-gradient">{s.n}</div>
            <h3 className="mt-4 font-display text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="py-20">
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card-gradient px-8 py-16 text-center shadow-elegant md:px-16">
        <div className="absolute inset-0 -z-10 bg-gradient-primary opacity-20 blur-3xl" />
        <h2 className="font-display text-4xl font-bold md:text-5xl">
          Your first business is waiting.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Five minutes. Three questions. Three ideas tailored to you — and a mentor
          to help you start.
        </p>
        <Link
          to="/generate"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-gradient-primary px-7 py-4 font-semibold text-primary-foreground shadow-glow transition hover:opacity-90"
        >
          Generate my ideas <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
      Built for dreamers with empty pockets and full hearts.
    </footer>
  );
}
