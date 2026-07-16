import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import type { LucideIcon } from "lucide-react";
import {
  Clock,
  QrCode,
  Bell,
  Users,
  ArrowRight,
  Check,
  LogOut,
  Sparkles,
  ChevronRight,
  Menu,
} from "lucide-react";
import { Link } from "react-router";


// Design tokens: see tailwind.config.ts (lyne.*) and lyne-tokens.ts

const PEOPLE_AHEAD: string[] = ["MA", "TJ", "KO", "SB", "RN"];

function useTicker(start: number, everyMs: number, step: number): number {
  const [n, setN] = useState<number>(start);
  useEffect(() => {
    const id = setInterval(() => setN((v) => v + step), everyMs);
    return () => clearInterval(id);
  }, [everyMs, step]);
  return n;
}

function NowServingBoard(): React.JSX.Element {
  const serving = useTicker(41, 4200, 1);
  const next: number[] = [serving + 1, serving + 2, serving + 3];

  return (
    <div className="relative w-full max-w-sm rounded-[28px] bg-gradient-to-b from-lyne-purple-700 to-lyne-purple-900 p-5 shadow-[0_30px_60px_-15px_rgba(43,15,77,0.55)] sm:p-7">
      <div className="flex items-center justify-between">
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
          Riverside Clinic · Queue A
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-lyne-lime-400/15 px-2.5 py-1 text-[11px] font-semibold text-lyne-lime-400">
          <span className="h-1.5 w-1.5 rounded-full bg-lyne-lime-400 animate-pulse" />
          Live
        </span>
      </div>

      <p className="mt-6 font-body text-xs font-medium uppercase tracking-[0.18em] text-white/50">
        Now serving
      </p>
      <div
        key={serving}
        className="mt-1 font-mono text-[56px] font-bold leading-none text-lyne-lime-400 [animation:fadein_0.4s_ease] sm:text-[84px]"
      >
        A—{String(serving).padStart(3, "0")}
      </div>

      <Separator className="my-6 bg-white/10" />

      <p className="font-body text-xs font-medium uppercase tracking-[0.18em] text-white/40">
        Up next
      </p>
      <div className="mt-3 flex gap-2">
        {next.map((n, i) => (
          <span
            key={n}
            className={`rounded-lg px-3 py-1.5 font-mono text-sm font-semibold ${
              i === 0
                ? "bg-white/15 text-white"
                : "bg-white/5 text-white/50"
            }`}
          >
            A{n}
          </span>
        ))}
      </div>
    </div>
  );
}

function LiveDemoCard(): React.JSX.Element {
  const [joined, setJoined] = useState<boolean>(false);
  const [position, setPosition] = useState<number>(6);
  const [ticket, setTicket] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const join = (): void => {
    setJoined(true);
    setTicket(Math.floor(200 + Math.random() * 90));
    setPosition(6);
    timerRef.current = setInterval(() => {
      setPosition((p) => {
        if (p <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return p - 1;
      });
    }, 2200);
  };

  const leave = (): void => {
    if (timerRef.current) clearInterval(timerRef.current);
    setJoined(false);
    setPosition(6);
    setTicket(null);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <Card className="w-full max-w-md rounded-3xl border-lyne-divider shadow-[0_20px_45px_-20px_rgba(43,15,77,0.25)]">
      <CardContent className="p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-lg font-semibold text-lyne-ink">
              City Passport Office
            </p>
            <p className="font-body text-sm text-lyne-muted">
              Walk-in queue · Window 3
            </p>
          </div>
          <Badge className="rounded-full bg-lyne-surface-muted px-3 py-1 font-body text-xs font-semibold text-lyne-purple-700 hover:bg-lyne-surface-muted">
            {joined ? "You're in" : "Open"}
          </Badge>
        </div>

        <div className="mt-6 flex -space-x-3">
          {PEOPLE_AHEAD.map((p) => (
            <Avatar key={p} className="h-9 w-9 border-2 border-white">
              <AvatarFallback className="bg-lyne-purple-700 font-body text-[11px] font-semibold text-white">
                {p}
              </AvatarFallback>
            </Avatar>
          ))}
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-lyne-divider font-body text-[11px] font-semibold text-lyne-purple-700">
            +7
          </div>
        </div>

        {!joined ? (
          <>
            <p className="mt-5 font-body text-sm text-lyne-muted">
              12 people waiting · about 24 min average
            </p>
            <Button
              onClick={join}
              className="mt-5 w-full rounded-full bg-lyne-purple-700 py-6 font-body text-sm font-semibold text-white hover:bg-lyne-purple-900"
            >
              Join this queue
            </Button>
          </>
        ) : (
          <div className="mt-5 rounded-2xl bg-lyne-surface p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-body text-xs font-medium uppercase tracking-[0.14em] text-lyne-muted">
                  Your ticket
                </p>
                <p className="font-mono text-2xl font-bold text-lyne-purple-700">
                  B—{ticket}
                </p>
              </div>
              <div className="text-right">
                <p className="font-body text-xs font-medium uppercase tracking-[0.14em] text-lyne-muted">
                  Position
                </p>
                <p className="font-mono text-2xl font-bold text-lyne-ink">
                  {position === 0 ? (
                    <span className="text-lyne-purple-700">You're up!</span>
                  ) : (
                    `#${position}`
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={leave}
              variant="ghost"
              className="mt-4 w-full rounded-full font-body text-sm font-semibold text-lyne-muted hover:bg-lyne-divider hover:text-lyne-purple-700"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Leave queue
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface StepProps {
  n: string;
  title: string;
  body: string;
}

function Step({ n, title, body }: StepProps): React.JSX.Element {
  return (
    <div className="flex gap-5">
      <span className="font-mono text-sm font-semibold text-lyne-lime-400">
        {n}
      </span>
      <div>
        <p className="font-display text-lg font-semibold text-white">
          {title}
        </p>
        <p className="mt-1.5 max-w-xs font-body text-sm leading-relaxed text-white/60">
          {body}
        </p>
      </div>
    </div>
  );
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
}

function FeatureCard({ icon: Icon, title, body }: FeatureCardProps): React.JSX.Element {
  return (
    <Card className="rounded-3xl border-lyne-divider transition-shadow hover:shadow-[0_20px_40px_-20px_rgba(43,15,77,0.25)]">
      <CardContent className="p-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-lyne-surface-muted">
          <Icon className="h-5 w-5 text-lyne-purple-700" strokeWidth={2} />
        </div>
        <p className="mt-5 font-display text-base font-semibold text-lyne-ink">
          {title}
        </p>
        <p className="mt-2 font-body text-sm leading-relaxed text-lyne-muted">
          {body}
        </p>
      </CardContent>
    </Card>
  );
}

export default function LyneLanding(): React.JSX.Element {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-lyne-surface font-body text-lyne-ink">

      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-lyne-divider bg-lyne-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-xl font-bold tracking-tight">
              LineLogic
            </span>
            <span className="mb-3 h-1.5 w-1.5 rounded-full bg-lyne-lime-400" />
          </div>
          <nav className="hidden items-center gap-8 font-body text-sm font-medium text-lyne-body md:flex">
            <a href="#how" className="hover:text-lyne-ink">How it works</a>
            <a href="#demo" className="hover:text-lyne-ink">Live demo</a>
            <a href="#features" className="hover:text-lyne-ink">Features</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link to="/login" className="font-body text-sm font-semibold text-lyne-purple-700">
              Log in
            </Link>
            <Button 
            onClick={() => window.location.href = '/register'}
            className="rounded-full bg-lyne-purple-700 px-5 font-body text-sm font-semibold text-white hover:bg-lyne-purple-900">
              Join free
            </Button>
          </div>

          {/* Mobile: hamburger opens a side drawer */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="rounded-full text-lyne-ink hover:bg-lyne-surface-muted"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] border-l border-lyne-divider bg-lyne-surface p-0 sm:w-[320px] absolute top-0 right-0 h-full"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center gap-1.5 px-6 py-5">
                    <span className="font-display text-lg font-bold tracking-tight text-lyne-ink">
                      LineLogic
                    </span>
                    <span className="mb-2.5 h-1.5 w-1.5 rounded-full bg-lyne-lime-400" />
                  </div>
                  <Separator className="bg-lyne-divider" />

                  <nav className="flex flex-1 gap-6 flex-col gap-1 px-3 py-5 font-body text-base font-medium text-lyne-ink">
                    <SheetClose>
                      <a href="#how" className="rounded-xl px-3 py-3 hover:bg-lyne-surface-muted">
                        How it works
                      </a>
                    </SheetClose>
                    <SheetClose>
                      <a href="#demo" className="rounded-xl px-3 py-3 hover:bg-lyne-surface-muted">
                        Live demo
                      </a>
                    </SheetClose>
                    <SheetClose>
                      <a href="#features" className="rounded-xl px-3 py-3 hover:bg-lyne-surface-muted">
                        Features
                      </a>
                    </SheetClose>
                  </nav>

                  <div className="mt-auto flex flex-col gap-3 border-t border-lyne-divider px-6 py-6">
                    <a
                      href="#"
                      className="text-center font-body text-sm font-semibold text-lyne-purple-700"
                    >
                      Log in
                    </a>
                    <SheetClose>
                      <Button className="w-full rounded-full bg-lyne-purple-700 py-5 font-body text-sm font-semibold text-white hover:bg-lyne-purple-900">
                        Join free
                      </Button>
                    </SheetClose>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 md:pt-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <Badge className="rounded-full bg-lyne-surface-muted px-3 py-1 font-body text-xs font-semibold text-lyne-purple-700 hover:bg-lyne-surface-muted">
              <Sparkles className="mr-1.5 h-3 w-3" />
              Real-time queueing, no app to install
            </Badge>
            <h1 className="mt-6 font-display text-[44px] font-bold leading-[1.05] tracking-tight md:text-[56px]">
              Skip the wait.
              <br />
              Not the line.
            </h1>
            <p className="mt-5 max-w-md font-body text-lg leading-relaxed text-lyne-body">
              Create a queue in seconds, share a link, and let people join,
              track their spot, and get called — all in real time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-full bg-lyne-purple-700 px-6 py-6 font-body text-sm font-semibold text-white hover:bg-lyne-purple-900">
                Create your first queue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a href="#demo">
                <Button
                  variant="outline"
                  className="rounded-full border-lyne-border bg-transparent px-6 py-6 font-body text-sm font-semibold text-lyne-purple-700 hover:bg-lyne-surface-muted"
                >
                  See a live queue
                </Button>
              </a>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-6">
              {[
                ["12,000+", "queues run"],
                ["280k", "people served"],
                ["0", "apps to download"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="font-display text-2xl font-bold">{num}</p>
                  <p className="font-body text-xs text-lyne-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <NowServingBoard />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-lyne-ink py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-lyne-lime-400">
            How it works
          </p>
          <h2 className="mt-3 max-w-lg font-display text-3xl font-bold text-white md:text-4xl">
            Four steps, from empty line to first ticket called.
          </h2>
          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <Step n="01" title="Create" body="Name your queue, set a capacity, and switch it on." />
            <Step n="02" title="Share" body="Send the link or a QR code. No app or sign-up needed to join." />
            <Step n="03" title="Join & track" body="People join and watch their position update live." />
            <Step n="04" title="Get called" body="Notify the next person with one tap — they're called instantly." />
          </div>
        </div>
      </section>

      {/* Live demo */}
      <section id="demo" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-lyne-purple-700">
              Try it yourself
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
              This is a real queue.
              <br />
              Go ahead, join it.
            </h2>
            <p className="mt-4 max-w-sm font-body text-base leading-relaxed text-LineLogic-body">
              Tap in, watch your position count down as it would for anyone
              waiting on a LineLogic queue, then leave whenever you like.
            </p>
          </div>
          <div className="flex justify-center md:justify-end">
            <LiveDemoCard />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="max-w-lg font-display text-3xl font-bold md:text-4xl">
          Everything a line needs. Nothing it doesn't.
        </h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={Clock}
            title="Live position tracking"
            body="Everyone sees exactly how many people are ahead, updated the second something changes."
          />
          <FeatureCard
            icon={QrCode}
            title="Works on any phone"
            body="Scan a code or tap a link. No downloads, no accounts to make."
          />
          <FeatureCard
            icon={Bell}
            title="Instant notifications"
            body="Ping people the moment it's their turn, so no one has to stare at a screen."
          />
          <FeatureCard
            icon={Users}
            title="Queue insights"
            body="See wait times and drop-off by hour so you can staff and plan better."
          />
        </div>
      </section>

      {/* Quote band */}
      <section className="bg-lyne-lime-400 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <p className="font-display text-2xl font-semibold leading-snug text-lyne-ink md:text-3xl">
            "Our walk-in line used to spill onto the street. Now people wait
            wherever they like and just watch their phone."
          </p>
          <p className="mt-5 font-body text-sm font-semibold text-lyne-ink/70">
            Front desk lead, 40-bed community clinic
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-lyne-purple-700 py-20">
        <div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
          <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
            Ready to lose the line?
          </h2>
          <p className="mt-4 font-body text-base text-white/60">
            Start free. Upgrade only once you're running queues that matter.
          </p>

          {!submitted ? (
            <form
              onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (email) setSubmitted(true);
              }}
              className="mx-auto mt-7 flex max-w-md gap-2"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="you@work.com"
                className="rounded-full border-white/15 bg-white/10 py-6 font-body text-white placeholder:text-white/40 focus-visible:ring-lyne-lime-400"
              />
              <Button
                type="submit"
                className="shrink-0 rounded-full bg-lyne-lime-400 px-6 py-6 font-body text-sm font-semibold text-lyne-ink hover:bg-lyne-lime-500"
              >
                Create a queue
              </Button>
            </form>
          ) : (
            <div className="mx-auto mt-7 flex max-w-md items-center justify-center gap-2 rounded-full bg-white/10 py-4 font-body text-sm font-semibold text-lyne-lime-400">
              <Check className="h-4 w-4" />
              You're on the list — check {email} for next steps.
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-1.5">
            <span className="font-display text-lg font-bold">LineLogic</span>
            <span className="mb-2.5 h-1.5 w-1.5 rounded-full bg-lyne-lime-400" />
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 font-body text-sm text-lyne-muted">
            <a href="#" className="hover:text-lyne-ink">Product</a>
            <a href="#" className="hover:text-lyne-ink">Help</a>
            <a href="#" className="hover:text-lyne-ink">Privacy</a>
            <a href="#" className="flex items-center hover:text-lyne-ink">
              Status <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </nav>
        </div>
        <Separator className="my-8 bg-lyne-divider" />
        <p className="font-body text-xs text-lyne-muted">
          © 2026 Lyne Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  );
}