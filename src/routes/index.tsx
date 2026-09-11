import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  BrainCircuit,
  Hand,
  LineChart,
  Sparkles,
  Layers,
  ArrowRight,
  Trophy,
  Wand2,
} from "lucide-react";
import { VirtualKeyboard } from "@/components/typing/VirtualKeyboard";
import { Wordmark } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TYPEFLOW — Adaptive touch typing coach" },
      {
        name: "description",
        content:
          "TYPEFLOW analyses every keystroke, finds your weakest keys and transitions, and builds practice around them. Build muscle memory, one keystroke at a time.",
      },
      { property: "og:title", content: "TYPEFLOW — Adaptive touch typing coach" },
      {
        property: "og:description",
        content:
          "An adaptive typing coach that identifies exactly where you're struggling and builds practice around it.",
      },
    ],
  }),
  component: Landing,
});

const FEATURES = [
  {
    icon: BrainCircuit,
    title: "Adaptive learning",
    body: "A deterministic engine scores every key and key-pair, then picks what you practice next.",
  },
  {
    icon: Activity,
    title: "Real-time analytics",
    body: "WPM, accuracy, consistency, hesitation and backspace rate, measured while you type.",
  },
  {
    icon: Hand,
    title: "Finger guidance",
    body: "Colour-coded finger mapping and a live virtual keyboard keep your hands in position.",
  },
  {
    icon: Sparkles,
    title: "Personalised practice",
    body: "Drills are generated around your weak keys and slow transitions, never random filler.",
  },
  {
    icon: LineChart,
    title: "Progress tracking",
    body: "Speed, accuracy and practice time charted over days, weeks and months.",
  },
  {
    icon: Layers,
    title: "Multiple modes",
    body: "Guided lessons, weakness drills, speed runs, accuracy work, free practice and timed tests.",
  },
  {
    icon: Wand2,
    title: "AI lessons on any topic",
    body: "Animals, space, jokes, coding, sports — fresh practice text written for whatever you love.",
  },
  {
    icon: Trophy,
    title: "XP, levels and badges",
    body: "Earn XP and coins from real typing, keep a daily streak alive and collect 18 badges.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[560px]"
        style={{
          background:
            "radial-gradient(55% 55% at 12% 0%, color-mix(in oklab, var(--color-primary) 30%, transparent), transparent 70%), radial-gradient(45% 45% at 88% 8%, color-mix(in oklab, var(--color-accent) 26%, transparent), transparent 70%)",
        }}
      />
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-4 sm:px-5 sm:py-5">
        <Wordmark />
        <Link to="/dashboard" className="text-muted-foreground hover:text-foreground text-sm">
          Open the app
        </Link>
      </header>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-5 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:items-center">
        <div>
          <p className="border-primary/40 bg-primary/10 text-primary inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.18em] uppercase">
            <Sparkles className="size-3.5" aria-hidden /> Levels · badges · AI lessons
          </p>
          <h1 className="text-balance-tight mt-5 font-mono text-[2.1rem] leading-[1.08] font-semibold sm:text-5xl lg:text-6xl">
            TYPE BETTER.
            <br />
            TYPE FASTER.
            <br />
            <span className="gradient-text">TYPE WITHOUT THINKING.</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-xl text-base sm:text-lg">
            An adaptive typing coach that identifies exactly where you're struggling and builds
            practice around it.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg">
              <Link to="/learn">
                Start learning <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/ai">
                <Wand2 className="size-4" /> Try an AI lesson
              </Link>
            </Button>
          </div>
        </div>

        <div className="glow-card float-slow space-y-3 p-4">
          <VirtualKeyboard nextChar="f" />
          <p className="text-muted-foreground text-xs">
            Every key is mapped to a finger. The highlighted key is the one you reach for next.
          </p>
        </div>
      </section>

      <section className="border-border mx-auto max-w-6xl border-t px-4 py-12 sm:px-5 sm:py-16">
        <h2 className="text-balance-tight text-2xl font-semibold">
          Practice that knows what you got wrong
        </h2>
        <div className="mt-10 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="glow-card glow-card-hover p-5">
              <Icon className="text-primary size-5" aria-hidden />
              <h3 className="mt-3 font-medium">{title}</h3>
              <p className="text-muted-foreground mt-1.5 text-sm leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-border mx-auto max-w-6xl border-t px-4 py-14 text-center sm:px-5 sm:py-20">
        <h2 className="text-balance-tight text-3xl font-semibold">
          Fifteen focused minutes a day is enough.
        </h2>
        <p className="text-muted-foreground mx-auto mt-4 max-w-lg">
          Start with the home row, or let the engine assess you and pick the right starting point.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/learn">Start learning</Link>
          </Button>
          <Button asChild size="lg" variant="ghost">
            <Link to="/practice">Practice a weakness</Link>
          </Button>
        </div>
      </section>

      <footer className="border-border text-muted-foreground border-t py-8 text-center text-xs flex flex-col items-center gap-3">
        <p>TYPEFLOW — your typing data stays on this device until you sign in.</p>
        <span className="font-mono text-[11px] font-medium tracking-[0.3em] uppercase text-muted-foreground/35 select-none pointer-events-none">
          cobra
        </span>
      </footer>
    </div>
  );
}
