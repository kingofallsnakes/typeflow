import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  BarChart3,
  Coins,
  Flame,
  GraduationCap,
  Keyboard,
  LineChart,
  Settings as SettingsIcon,
  ShoppingBag,
  Sparkles,
  Star,
  Target,
  Timer,
  Trophy,
  UserRound,
} from "lucide-react";
import { useGame } from "@/context/GameContext";
import { useAuth } from "@/context/AuthContext";

const NAV = [
  { to: "/dashboard", label: "Home", icon: Keyboard },
  { to: "/learn", label: "Learn", icon: GraduationCap },
  { to: "/ai", label: "AI", icon: Sparkles },
  { to: "/practice", label: "Practice", icon: Target },
  { to: "/test", label: "Test", icon: Timer },
  { to: "/progress", label: "Progress", icon: LineChart },
  { to: "/statistics", label: "Stats", icon: BarChart3 },
  { to: "/achievements", label: "Badges", icon: Trophy },
  { to: "/shop", label: "Shop", icon: ShoppingBag },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
] as const;

export function Wordmark() {
  return (
    <Link
      to="/"
      className="font-mono text-base font-semibold tracking-[-0.04em] whitespace-nowrap sm:text-lg"
    >
      TYPE<span className="gradient-text">FLOW</span>
    </Link>
  );
}

export function PlayerHud() {
  const { level, game, streak } = useGame();
  const { user } = useAuth();
  return (
    <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
      <div className="border-primary/40 bg-primary/10 flex items-center gap-1.5 rounded-full border px-2 py-1 sm:gap-2 sm:px-3 sm:py-1.5">
        <Star className="text-primary size-3.5 shrink-0 sm:size-4" aria-hidden />
        <span className="text-[11px] font-semibold sm:text-xs">Lv {level.level}</span>
        <span className="bg-elevated hidden h-1.5 w-20 overflow-hidden rounded-full md:block">
          <span
            className="from-primary to-accent block h-full bg-gradient-to-r transition-[width] duration-500"
            style={{ width: `${level.percent}%` }}
          />
        </span>
      </div>
      <div className="border-warning/40 bg-warning/10 flex items-center gap-1 rounded-full border px-2 py-1 sm:gap-1.5 sm:px-2.5 sm:py-1.5">
        <Flame
          className={`text-warning size-3.5 shrink-0 sm:size-4 ${streak > 0 ? "flame" : ""}`}
          aria-hidden
        />
        <span className="text-[11px] font-semibold sm:text-xs">{streak}</span>
      </div>
      <div className="border-border bg-elevated hidden items-center gap-1.5 rounded-full border px-2.5 py-1.5 sm:flex">
        <Coins className="text-warning size-4 shrink-0" aria-hidden />
        <span className="text-xs font-semibold">{game.coins}</span>
      </div>
      <Link
        to="/auth"
        aria-label={user ? "Your account" : "Sign in"}
        className="border-border bg-elevated hover:bg-surface grid size-8 shrink-0 place-items-center rounded-full border transition-colors"
      >
        <UserRound className={`size-4 ${user ? "text-primary" : "text-muted-foreground"}`} aria-hidden />
      </Link>
    </div>
  );
}

const linkBase =
  "text-muted-foreground hover:bg-elevated hover:text-foreground flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all hover:-translate-y-0.5";
const activeProps = {
  className: "bg-primary text-primary-foreground shadow-md shadow-primary/25",
} as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[420px] opacity-60"
        style={{
          background:
            "radial-gradient(60% 60% at 15% 0%, color-mix(in oklab, var(--color-primary) 28%, transparent), transparent 70%), radial-gradient(50% 50% at 85% 5%, color-mix(in oklab, var(--color-accent) 22%, transparent), transparent 70%)",
        }}
      />
      <header className="border-border bg-background/75 sticky top-0 z-20 border-b backdrop-blur-xl">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-2.5 sm:px-5 sm:py-3">
          <Wordmark />
          <PlayerHud />
        </div>
        <nav
          aria-label="Main"
          className="mx-auto hidden max-w-6xl items-center gap-1.5 overflow-x-auto px-5 pb-2.5 md:flex"
        >
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link key={to} to={to} activeProps={activeProps} className={linkBase}>
              <Icon className="size-4" aria-hidden />
              {label}
            </Link>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 pb-16 sm:px-5 sm:py-10 md:pb-8">{children}</main>

      {/* Watermark */}
      <footer className="pointer-events-none pb-24 pt-4 text-center select-none md:pb-8">
        <span className="font-mono text-[11px] font-medium tracking-[0.3em] uppercase text-muted-foreground/35">
          cobra
        </span>
      </footer>

      {/* Mobile / tablet tab bar */}
      <nav
        aria-label="Main"
        className="border-border bg-background/90 fixed inset-x-0 bottom-0 z-30 border-t backdrop-blur-xl md:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch gap-1 overflow-x-auto px-2 py-1.5">
          {NAV.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeProps={{ className: "text-primary bg-primary/10" }}
              className="text-muted-foreground flex min-w-[4.25rem] flex-col items-center gap-0.5 rounded-xl px-2 py-1.5 text-[10px] font-medium transition-colors"
            >
              <Icon className="size-5" aria-hidden />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
