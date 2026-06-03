import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary shadow-glow">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight">Spark</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/generate"
            className="rounded-full px-4 py-2 text-muted-foreground transition hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Idea generator
          </Link>
          <Link
            to="/mentor"
            className="rounded-full px-4 py-2 text-muted-foreground transition hover:text-foreground"
            activeProps={{ className: "text-foreground" }}
          >
            Mentor
          </Link>
          <Link
            to="/generate"
            className="ml-2 rounded-full bg-gradient-primary px-5 py-2 font-medium text-primary-foreground shadow-glow transition hover:opacity-90"
          >
            Start free
          </Link>
        </nav>
      </div>
    </header>
  );
}