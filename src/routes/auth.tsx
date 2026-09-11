import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, LogOut, ShieldCheck } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useGame } from "@/context/GameContext";
import { supabase } from "@/lib/supabaseClient";


export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Cobra" },
      {
        name: "description",
        content: "Create a free Cobra account to keep your XP, badges and streak on every device.",
      },
      { property: "og:title", content: "Sign in — Cobra" },
      {
        property: "og:description",
        content: "Save your typing progress to the cloud and continue on any device.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, displayName, signOut, loading } = useAuth();
  const { syncing, level, game } = useGame();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setMessage(null);
  }, [mode]);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { display_name: name || email.split("@")[0] },
          },
        });
        if (signUpError) throw signUpError;
        if (!data.session) {
          setMessage("Check your email and click the link to confirm your account.");
          return;
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) throw signInError;
      }
      void navigate({ to: "/dashboard" });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Something went wrong. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function google() {
    setError(null);
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (oauthError) {
      setError("Google sign-in didn't work. Try again or use your email.");
    }
    // On success the browser navigates away to Google and returns signed in.
  }

  if (loading) {
    return (
      <AppShell>
        <div className="text-muted-foreground flex items-center gap-2 py-20">
          <Loader2 className="size-4 animate-spin" aria-hidden /> Loading…
        </div>
      </AppShell>
    );
  }

  if (user) {
    return (
      <AppShell>
        <div className="mx-auto max-w-lg space-y-6">
          <h1 className="text-balance-tight text-3xl font-semibold sm:text-4xl">
            Hi {displayName} 👋
          </h1>
          <div className="glow-card space-y-4 p-6">
            <p className="text-muted-foreground text-sm">
              Your progress is saved to your account, so it follows you to any phone, tablet or
              computer.
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="bg-elevated rounded-full px-3 py-1.5">Level {level.level}</span>
              <span className="bg-elevated rounded-full px-3 py-1.5">{game.xp} XP</span>
              <span className="bg-elevated rounded-full px-3 py-1.5">{game.coins} coins</span>
              <span className="bg-elevated rounded-full px-3 py-1.5">
                {syncing ? "Saving…" : "Saved to cloud"}
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/dashboard">Keep practising</Link>
              </Button>
              <Button variant="outline" onClick={() => void signOut()}>
                <LogOut className="size-4" aria-hidden /> Sign out
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-balance-tight text-3xl font-semibold sm:text-4xl">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Keep your XP, badges and streak safe on every device.
          </p>
        </div>

        <div className="glow-card space-y-5 p-6">
          <button
            type="button"
            onClick={() => void google()}
            className="border-border hover:bg-elevated flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
          >
            Continue with Google
          </button>

          <div className="text-muted-foreground flex items-center gap-3 text-xs">
            <span className="bg-border h-px flex-1" /> or use email{" "}
            <span className="bg-border h-px flex-1" />
          </div>

          <form className="space-y-3" onSubmit={submit}>
            {mode === "signup" && (
              <input
                className="border-border bg-surface w-full rounded-xl border px-3 py-2.5 text-sm"
                placeholder="Your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="nickname"
              />
            )}
            <input
              className="border-border bg-surface w-full rounded-xl border px-3 py-2.5 text-sm"
              placeholder="Email"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
            <input
              className="border-border bg-surface w-full rounded-xl border px-3 py-2.5 text-sm"
              placeholder="Password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
            {message && <p className="text-accent text-sm">{message}</p>}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy && <Loader2 className="size-4 animate-spin" aria-hidden />}
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <p className="text-muted-foreground text-center text-sm">
            {mode === "signin" ? "New here? " : "Already have an account? "}
            <button
              type="button"
              className="text-primary font-medium"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            >
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="text-muted-foreground flex items-center justify-center gap-2 text-xs">
          <ShieldCheck className="size-3.5" aria-hidden /> Your progress on this device is kept and
          merged when you sign in.
        </p>
      </div>
    </AppShell>
  );
}
