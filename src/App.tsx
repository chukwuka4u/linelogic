
import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from "react";
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
  type LucideIcon,
} from "lucide-react";

interface StepProps {
  n: string;
  title: string;
  body: string;
}

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  body: string;
}

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600;700&display=swap');
`;

// ---- Design tokens (Kuda-derived) ------------------------------------
// purple-900 #2B0F4D  purple-700 #40196D  lime-400 #C6FE1E
// cream-50 #FAF8FC    ink-900 #1A1025     gray-500 #7A7286

const PEOPLE_AHEAD = ["MA", "TJ", "KO", "SB", "RN"];

function useTicker(start: number, everyMs: number, step: number): number {
  const [n, setN] = useState(start);
  useEffect(() => {
    const id = window.setInterval(() => setN((v) => v + step), everyMs);
    return () => window.clearInterval(id);
  }, [everyMs, step]);
  return n;
}

function NowServingBoard() {
  const serving = useTicker(41, 4200, 1);
  const next = [serving + 1, serving + 2, serving + 3];

  return (
    <div className="relative w-full max-w-sm rounded-[28px] bg-gradient-to-b from-[#40196D] to-[#2B0F4D] p-7 shadow-[0_30px_60px_-15px_rgba(43,15,77,0.55)]">
      <div className="flex items-center justify-between">
        <span className="font-['Inter'] text-[11px] font-semibold uppercase tracking-[0.18em] text-white/50">
          Riverside Clinic · Queue A
        </span>
        <span className="flex items-center gap-1.5 rounded-full bg-[#C6FE1E]/15 px-2.5 py-1 text-[11px] font-semibold text-[#C6FE1E]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#C6FE1E] animate-pulse" />
          Live
        </span>
      </div>

      <p className="mt-6 font-['Inter'] text-xs font-medium uppercase tracking-[0.18em] text-white/50">
        Now serving
      </p>
      <div
        key={serving}
        className="mt-1 font-['JetBrains_Mono'] text-[84px] font-bold leading-none text-[#C6FE1E] [animation:fadein_0.4s_ease]"
      >
        A—{String(serving).padStart(3, "0")}
      </div>

      <Separator className="my-6 bg-white/10" />

      <p className="font-['Inter'] text-xs font-medium uppercase tracking-[0.18em] text-white/40">
        Up next
      </p>
      <div className="mt-3 flex gap-2">
        {next.map((n, i) => (
          <span
            key={n}
            className={`rounded-lg px-3 py-1.5 font-['JetBrains_Mono'] text-sm font-semibold ${
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

function LiveDemoCard() {
  const [joined, setJoined] = useState(false);
  const [position, setPosition] = useState(6);
  const [ticket, setTicket] = useState<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const join = () => {
    setJoined(true);
    setTicket(Math.floor(200 + Math.random() * 90));
    setPosition(6);
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      setPosition((p) => {
        if (p <= 1) {
          if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
          }
          return 0;
        }
        return p - 1;
      });
    }, 2200);
  };

  const leave = () => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }
    setJoined(false);
    setPosition(6);
    setTicket(null);
  };

  useEffect(
    () => () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    },
    []
  );

  return (
    <Card className="w-full max-w-md rounded-3xl border-[#EBE6F2] shadow-[0_20px_45px_-20px_rgba(43,15,77,0.25)]">
      <CardContent className="p-7">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-['Space_Grotesk'] text-lg font-semibold text-[#1A1025]">
              City Passport Office
            </p>
            <p className="font-['Inter'] text-sm text-[#7A7286]">
              Walk-in queue · Window 3
            </p>
          </div>
          <Badge className="rounded-full bg-[#F2ECFB] px-3 py-1 font-['Inter'] text-xs font-semibold text-[#40196D] hover:bg-[#F2ECFB]">
            {joined ? "You're in" : "Open"}
          </Badge>
        </div>

        <div className="mt-6 flex -space-x-3">
          {PEOPLE_AHEAD.map((p) => (
            <Avatar key={p} className="h-9 w-9 border-2 border-white">
              <AvatarFallback className="bg-[#40196D] font-['Inter'] text-[11px] font-semibold text-white">
                {p}
              </AvatarFallback>
            </Avatar>
          ))}
          <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#EBE6F2] font-['Inter'] text-[11px] font-semibold text-[#40196D]">
            +7
          </div>
        </div>

        {!joined ? (
          <>
            <p className="mt-5 font-['Inter'] text-sm text-[#7A7286]">
              12 people waiting · about 24 min average
            </p>
            <Button
              onClick={join}
              className="mt-5 w-full rounded-full bg-[#40196D] py-6 font-['Inter'] text-sm font-semibold text-white hover:bg-[#2B0F4D]"
            >
              Join this queue
            </Button>
          </>
        ) : (
          <div className="mt-5 rounded-2xl bg-[#FAF8FC] p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-['Inter'] text-xs font-medium uppercase tracking-[0.14em] text-[#7A7286]">
                  Your ticket
                </p>
                <p className="font-['JetBrains_Mono'] text-2xl font-bold text-[#40196D]">
                  B—{ticket}
                </p>
              </div>
              <div className="text-right">
                <p className="font-['Inter'] text-xs font-medium uppercase tracking-[0.14em] text-[#7A7286]">
                  Position
                </p>
                <p className="font-['JetBrains_Mono'] text-2xl font-bold text-[#1A1025]">
                  {position === 0 ? (
                    <span className="text-[#40196D]">You're up!</span>
                  ) : (
                    `#${position}`
                  )}
                </p>
              </div>
            </div>
            <Button
              onClick={leave}
              variant="ghost"
              className="mt-4 w-full rounded-full font-['Inter'] text-sm font-semibold text-[#7A7286] hover:bg-[#EBE6F2] hover:text-[#40196D]"
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

function Step({ n, title, body }: StepProps) {
  return (
    <div className="flex gap-5">
      <span className="font-['JetBrains_Mono'] text-sm font-semibold text-[#C6FE1E]">
        {n}
      </span>
      <div>
        <p className="font-['Space_Grotesk'] text-lg font-semibold text-white">
          {title}
        </p>
        <p className="mt-1.5 max-w-xs font-['Inter'] text-sm leading-relaxed text-white/60">
          {body}
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, body }: FeatureCardProps) {
  return (
    <Card className="rounded-3xl border-[#EBE6F2] transition-shadow hover:shadow-[0_20px_40px_-20px_rgba(43,15,77,0.25)]">
      <CardContent className="p-7">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2ECFB]">
          <Icon className="h-5 w-5 text-[#40196D]" strokeWidth={2} />
        </div>
        <p className="mt-5 font-['Space_Grotesk'] text-base font-semibold text-[#1A1025]">
          {title}
        </p>
        <p className="mt-2 font-['Inter'] text-sm leading-relaxed text-[#7A7286]">
          {body}
        </p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF8FC] font-['Inter'] text-[#1A1025]">
      <style>{FONTS}</style>
      <style>{`
        @keyframes fadein { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; }
        }
      `}</style>

      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-[#EBE6F2] bg-[#FAF8FC]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-1.5">
            <span className="font-['Space_Grotesk'] text-xl font-bold tracking-tight">
              Lyne
            </span>
            <span className="mb-3 h-1.5 w-1.5 rounded-full bg-[#C6FE1E]" />
          </div>
          <nav className="hidden items-center gap-8 font-['Inter'] text-sm font-medium text-[#4A4356] md:flex">
            <a href="#how" className="hover:text-[#1A1025]">How it works</a>
            <a href="#demo" className="hover:text-[#1A1025]">Live demo</a>
            <a href="#features" className="hover:text-[#1A1025]">Features</a>
            <a href="#" className="hover:text-[#1A1025]">Pricing</a>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a href="#" className="font-['Inter'] text-sm font-semibold text-[#40196D]">
              Log in
            </a>
            <Button className="rounded-full bg-[#40196D] px-5 font-['Inter'] text-sm font-semibold text-white hover:bg-[#2B0F4D]">
              Join free
            </Button>
          </div>

          {/* Mobile: hamburger opens a side drawer */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Open menu"
                  className="rounded-full text-[#1A1025] hover:bg-[#F2ECFB]"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[280px] border-l border-[#EBE6F2] bg-[#FAF8FC] p-0 sm:w-[320px]"
              >
                <div className="flex h-full flex-col">
                  <div className="flex items-center gap-1.5 px-6 py-5">
                    <span className="font-['Space_Grotesk'] text-lg font-bold tracking-tight text-[#1A1025]">
                      Lyne
                    </span>
                    <span className="mb-2.5 h-1.5 w-1.5 rounded-full bg-[#C6FE1E]" />
                  </div>
                  <Separator className="bg-[#EBE6F2]" />

                  <nav className="flex flex-1 flex-col gap-1 px-3 py-5 font-['Inter'] text-base font-medium text-[#1A1025]">
                    <SheetClose asChild>
                      <a href="#how" className="rounded-xl px-3 py-3 hover:bg-[#F2ECFB]">
                        How it works
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <a href="#demo" className="rounded-xl px-3 py-3 hover:bg-[#F2ECFB]">
                        Live demo
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <a href="#features" className="rounded-xl px-3 py-3 hover:bg-[#F2ECFB]">
                        Features
                      </a>
                    </SheetClose>
                    <SheetClose asChild>
                      <a href="#" className="rounded-xl px-3 py-3 hover:bg-[#F2ECFB]">
                        Pricing
                      </a>
                    </SheetClose>
                  </nav>

                  <div className="mt-auto flex flex-col gap-3 border-t border-[#EBE6F2] px-6 py-6">
                    <a
                      href="#"
                      className="text-center font-['Inter'] text-sm font-semibold text-[#40196D]"
                    >
                      Log in
                    </a>
                    <SheetClose asChild>
                      <Button className="w-full rounded-full bg-[#40196D] py-5 font-['Inter'] text-sm font-semibold text-white hover:bg-[#2B0F4D]">
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
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <Badge className="rounded-full bg-[#F2ECFB] px-3 py-1 font-['Inter'] text-xs font-semibold text-[#40196D] hover:bg-[#F2ECFB]">
              <Sparkles className="mr-1.5 h-3 w-3" />
              Real-time queueing, no app to install
            </Badge>
            <h1 className="mt-6 font-['Space_Grotesk'] text-[44px] font-bold leading-[1.05] tracking-tight md:text-[56px]">
              Skip the wait.
              <br />
              Not the line.
            </h1>
            <p className="mt-5 max-w-md font-['Inter'] text-lg leading-relaxed text-[#4A4356]">
              Create a queue in seconds, share a link, and let people join,
              track their spot, and get called — all in real time.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="rounded-full bg-[#40196D] px-6 py-6 font-['Inter'] text-sm font-semibold text-white hover:bg-[#2B0F4D]">
                Create your first queue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <a href="#demo">
                <Button
                  variant="outline"
                  className="rounded-full border-[#D9D1E8] bg-transparent px-6 py-6 font-['Inter'] text-sm font-semibold text-[#40196D] hover:bg-[#F2ECFB]"
                >
                  See a live queue
                </Button>
              </a>
            </div>
            <div className="mt-12 flex gap-10">
              {[
                ["12,000+", "queues run"],
                ["280k", "people served"],
                ["0", "apps to download"],
              ].map(([num, label]) => (
                <div key={label}>
                  <p className="font-['Space_Grotesk'] text-2xl font-bold">{num}</p>
                  <p className="font-['Inter'] text-xs text-[#7A7286]">{label}</p>
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
      <section id="how" className="bg-[#1A1025] py-20">
        <div className="mx-auto max-w-6xl px-6">
          <p className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.18em] text-[#C6FE1E]">
            How it works
          </p>
          <h2 className="mt-3 max-w-lg font-['Space_Grotesk'] text-3xl font-bold text-white md:text-4xl">
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
      <section id="demo" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-14 md:grid-cols-2">
          <div>
            <p className="font-['Inter'] text-xs font-semibold uppercase tracking-[0.18em] text-[#40196D]">
              Try it yourself
            </p>
            <h2 className="mt-3 font-['Space_Grotesk'] text-3xl font-bold md:text-4xl">
              This is a real queue.
              <br />
              Go ahead, join it.
            </h2>
            <p className="mt-4 max-w-sm font-['Inter'] text-base leading-relaxed text-[#4A4356]">
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
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="max-w-lg font-['Space_Grotesk'] text-3xl font-bold md:text-4xl">
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
      <section className="bg-[#C6FE1E] py-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <p className="font-['Space_Grotesk'] text-2xl font-semibold leading-snug text-[#1A1025] md:text-3xl">
            "Our walk-in line used to spill onto the street. Now people wait
            wherever they like and just watch their phone."
          </p>
          <p className="mt-5 font-['Inter'] text-sm font-semibold text-[#1A1025]/70">
            Front desk lead, 40-bed community clinic
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#40196D] py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="font-['Space_Grotesk'] text-3xl font-bold text-white md:text-4xl">
            Ready to lose the line?
          </h2>
          <p className="mt-4 font-['Inter'] text-base text-white/60">
            Start free. Upgrade only once you're running queues that matter.
          </p>

          {!submitted ? (
            <form
              onSubmit={(e: FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                if (email) setSubmitted(true);
              }}
              className="mx-auto mt-7 flex max-w-md gap-2"
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="you@work.com"
                className="rounded-full border-white/15 bg-white/10 py-6 font-['Inter'] text-white placeholder:text-white/40 focus-visible:ring-[#C6FE1E]"
              />
              <Button
                type="submit"
                className="shrink-0 rounded-full bg-[#C6FE1E] px-6 py-6 font-['Inter'] text-sm font-semibold text-[#1A1025] hover:bg-[#b3e81a]"
              >
                Create a queue
              </Button>
            </form>
          ) : (
            <div className="mx-auto mt-7 flex max-w-md items-center justify-center gap-2 rounded-full bg-white/10 py-4 font-['Inter'] text-sm font-semibold text-[#C6FE1E]">
              <Check className="h-4 w-4" />
              You're on the list — check {email} for next steps.
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-1.5">
            <span className="font-['Space_Grotesk'] text-lg font-bold">LineLogic</span>
            <span className="mb-2.5 h-1.5 w-1.5 rounded-full bg-[#C6FE1E]" />
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-2 font-['Inter'] text-sm text-[#7A7286]">
            <a href="#" className="hover:text-[#1A1025]">Product</a>
            <a href="#" className="hover:text-[#1A1025]">Pricing</a>
            <a href="#" className="hover:text-[#1A1025]">Help</a>
            <a href="#" className="hover:text-[#1A1025]">Privacy</a>
            <a href="#" className="flex items-center hover:text-[#1A1025]">
              Status <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </nav>
        </div>
        <Separator className="my-8 bg-[#EBE6F2]" />
        <p className="font-['Inter'] text-xs text-[#7A7286]">
          © 2026 LineLogic Technologies. All rights reserved.
        </p>
      </footer>
    </div>
  );
}