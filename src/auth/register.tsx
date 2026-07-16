import React, { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Check,
  QrCode,
  Link2,
  UserPlus,
  SlidersHorizontal,
} from "lucide-react";
import { Link } from "react-router";


// Design tokens: see tailwind.config.ts (lyne.*) and lyne-tokens.ts

type AuthStatus = "idle" | "loading" | "error" | "success";
type PasswordStrength = "empty" | "weak" | "medium" | "strong";

function getPasswordStrength(pw: string): PasswordStrength {
  if (!pw) return "empty";
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  if (score <= 1) return "weak";
  if (score <= 2) return "medium";
  return "strong";
}

/**
 * A four-stage looping preview of what happens right after signup:
 * naming a queue, setting capacity, generating a shareable link, and
 * the first person joining. Purely illustrative — no real state.
 */
function QueueBuilderPreview(): React.JSX.Element {
  const stages = useMemo(
    () => ["name", "capacity", "share", "join"] as const,
    []
  );
  const [stageIndex, setStageIndex] = useState<number>(0);
  const [typed, setTyped] = useState<string>("");
  const fullName = "Riverside Clinic";

  useEffect(() => {
    const advance = setInterval(() => {
      setStageIndex((i) => (i + 1) % stages.length);
    }, 2800);
    return () => clearInterval(advance);
  }, [stages.length]);

  // Typewriter effect, only relevant while on the "name" stage.
  useEffect(() => {
    if (stages[stageIndex] !== "name") {
      setTyped(fullName);
      return;
    }
    setTyped("");
    let i = 0;
    const type = setInterval(() => {
      i++;
      setTyped(fullName.slice(0, i));
      if (i >= fullName.length) clearInterval(type);
    }, 90);
    return () => clearInterval(type);
  }, [stageIndex, stages]);

  const stage = stages[stageIndex];

  return (
    <div className="w-full max-w-xs rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
      <div className="flex items-center justify-between">
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
          Building your queue
        </span>
        <span className="font-mono text-[10px] text-white/30">
          {stageIndex + 1}/4
        </span>
      </div>

      <div className="mt-4 min-h-[92px]">
        {stage === "name" && (
          <div>
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
              Queue name
            </p>
            <p className="mt-2 flex items-center rounded-lg bg-black/20 px-3 py-2.5 font-display text-base font-semibold text-white">
              {typed}
              <span className="ml-0.5 h-4 w-[2px] animate-pulse bg-lyne-lime-400" />
            </p>
          </div>
        )}

        {stage === "capacity" && (
          <div>
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
              Set capacity
            </p>
            <div className="mt-2 flex items-center gap-3 rounded-lg bg-black/20 px-3 py-2.5">
              <SlidersHorizontal className="h-4 w-4 text-lyne-lime-400" />
              <div className="h-1.5 flex-1 rounded-full bg-white/10">
                <div className="h-1.5 w-2/3 rounded-full bg-lyne-lime-400" />
              </div>
              <span className="font-mono text-sm font-semibold text-white">
                40
              </span>
            </div>
          </div>
        )}

        {stage === "share" && (
          <div>
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
              Share it anywhere
            </p>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-black/20 px-3 py-2.5">
              <span className="flex items-center gap-2 font-mono text-xs text-white/80">
                <Link2 className="h-3.5 w-3.5 text-lyne-lime-400" />
                lineLogic.app/riverside
              </span>
              <QrCode className="h-4 w-4 text-white/50" />
            </div>
          </div>
        )}

        {stage === "join" && (
          <div>
            <p className="font-body text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
              First person joins
            </p>
            <div className="mt-2 flex items-center justify-between rounded-lg bg-black/20 px-3 py-2.5">
              <span className="flex items-center gap-2 font-body text-sm font-medium text-white">
                <UserPlus className="h-4 w-4 text-lyne-lime-400" />
                Priya M.
              </span>
              <span className="font-mono text-sm font-semibold text-lyne-lime-400">
                A—001
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="mt-5 flex gap-1.5">
        {stages.map((s, i) => (
          <span
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i === stageIndex ? "bg-lyne-lime-400" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function BrandPanel(): React.JSX.Element {
  return (
    <div className="relative hidden h-full flex-col justify-between overflow-hidden bg-gradient-to-b from-lyne-purple-700 to-lyne-purple-900 p-12 lg:flex">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-lyne-lime-400/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/5 blur-3xl"
        aria-hidden="true"
      />

      <div className="flex items-center gap-1.5">
        <span className="font-display text-xl font-bold tracking-tight text-white">
          LineLogic
        </span>
        <span className="mb-3 h-1.5 w-1.5 rounded-full bg-lyne-lime-400" />
      </div>

      <div className="relative">
        <p className="font-display text-3xl font-bold leading-tight text-white xl:text-4xl">
          Your first queue,
          <br />
          coming together.
        </p>
        <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-white/60">
          This is what happens in the few seconds after you hit create.
          No setup calls, no waiting on IT.
        </p>

        <div className="mt-10">
          <QueueBuilderPreview />
        </div>
      </div>

      <p className="relative font-body text-xs text-white/30">
        © 2026 LineLogic Technologies
      </p>
    </div>
  );
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>): React.JSX.Element {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" {...props}>
      <path
        fill="#4285F4"
        d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.47a5.53 5.53 0 0 1-2.4 3.63v3h3.88c2.27-2.09 3.54-5.17 3.54-8.66Z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.07 7.94-2.9l-3.88-3c-1.08.72-2.46 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.94H1.28v3.1A12 12 0 0 0 12 24Z"
      />
      <path
        fill="#FBBC05"
        d="M5.29 14.31A7.2 7.2 0 0 1 4.91 12c0-.8.14-1.58.38-2.31v-3.1H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.41l4.01-3.1Z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.76 0 3.34.6 4.58 1.78l3.44-3.44C17.94 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.59l4.01 3.1C6.23 6.86 8.88 4.75 12 4.75Z"
      />
    </svg>
  );
}

const STRENGTH_META: Record<
  PasswordStrength,
  { label: string; bars: number; color: string }
> = {
  empty: { label: "", bars: 0, color: "bg-transparent" },
  weak: { label: "Weak", bars: 1, color: "bg-red-400" },
  medium: { label: "Medium", bars: 2, color: "bg-amber-400" },
  strong: { label: "Strong", bars: 3, color: "bg-lyne-purple-700" },
};

export default function Register(): React.JSX.Element {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [agreed, setAgreed] = useState<boolean>(false);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const strength = getPasswordStrength(password);
  const strengthMeta = STRENGTH_META[strength];

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setErrorMsg("");

    if (!name || !email || !password) {
      setStatus("error");
      setErrorMsg("Fill in your name, email, and a password to continue.");
      return;
    }
    if (!agreed) {
      setStatus("error");
      setErrorMsg("Please accept the Terms and Privacy Policy first.");
      return;
    }

    setStatus("loading");
    setTimeout(() => {
      // Demo only — replace with real signup call.
      setStatus("success");
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-lyne-surface font-body text-lyne-ink">

      <div className="grid min-h-screen lg:grid-cols-2">
        <BrandPanel />

        {/* Form side */}
        <div className="flex items-center justify-center px-5 py-8 sm:px-10 sm:py-12">
          <div className="w-full max-w-sm">
            {/* Mobile-only logo, since the brand panel is hidden below lg */}
            <div className="mb-8 flex items-center gap-1.5 sm:mb-10 lg:hidden">
              <span className="font-display text-xl font-bold tracking-tight">
                LineLogic
              </span>
              <span className="mb-3 h-1.5 w-1.5 rounded-full bg-lyne-purple-700" />
            </div>

            <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-lyne-purple-700">
              Get started
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Create your account
            </h1>
            <p className="mt-2 font-body text-sm text-lyne-muted">
              Already on LineLogic?{" "}
              <Link to="/login" className="font-semibold text-lyne-purple-700 hover:underline">
                Sign in
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="name"
                  className="font-body text-sm font-medium text-lyne-ink"
                >
                  Full name
                </Label>
                <Input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ada Obi"
                  value={name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  className="rounded-xl border-lyne-border py-5 font-body focus-visible:ring-lyne-purple-700"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-body text-sm font-medium text-lyne-ink"
                >
                  Work email
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@work.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  className="rounded-xl border-lyne-border py-5 font-body focus-visible:ring-lyne-purple-700"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="font-body text-sm font-medium text-lyne-ink"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(e.target.value)
                    }
                    className="rounded-xl border-lyne-border py-5 pr-11 font-body focus-visible:ring-lyne-purple-700"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lyne-muted hover:text-lyne-purple-700"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {password.length > 0 && (
                  <div className="flex items-center gap-2 pt-1">
                    <div className="flex flex-1 gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className={`h-1 flex-1 rounded-full ${
                            i < strengthMeta.bars
                              ? strengthMeta.color
                              : "bg-lyne-divider"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-body text-xs font-medium text-lyne-muted">
                      {strengthMeta.label}
                    </span>
                  </div>
                )}
              </div>

              {status === "error" && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 px-3.5 py-2.5 font-body text-sm text-red-600"
                >
                  {errorMsg}
                </p>
              )}

              {status === "success" && (
                <p className="flex items-center gap-2 rounded-xl bg-lyne-surface-muted px-3.5 py-2.5 font-body text-sm font-medium text-lyne-purple-700">
                  <Check className="h-4 w-4" />
                  Account created — let's set up your first queue.
                </p>
              )}

              <div className="flex items-start gap-2">
                <Checkbox
                  id="agree"
                  checked={agreed}
                  onCheckedChange={(v: boolean | "indeterminate") =>
                    setAgreed(v === true)
                  }
                  className="mt-0.5 border-lyne-border data-[state=checked]:border-lyne-purple-700 data-[state=checked]:bg-lyne-purple-700"
                />
                <Label
                  htmlFor="agree"
                  className="font-body text-sm font-normal leading-snug text-lyne-body"
                >
                  I agree to LineLogic's{" "}
                  <a href="#" className="font-semibold text-lyne-purple-700 hover:underline">
                    Terms
                  </a>{" "}
                  and{" "}
                  <a href="#" className="font-semibold text-lyne-purple-700 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </Label>
              </div>

              <Button
                type="submit"
                disabled={status === "loading"}
                className="w-full rounded-full bg-lyne-purple-700 py-6 font-body text-sm font-semibold text-white hover:bg-lyne-purple-900 disabled:opacity-70"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account…
                  </>
                ) : (
                  <>
                    Create account
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="my-7 flex items-center gap-3">
              <Separator className="flex-1 bg-lyne-divider" />
              <span className="font-body text-xs font-medium uppercase tracking-[0.1em] text-lyne-muted">
                Or
              </span>
              <Separator className="flex-1 bg-lyne-divider" />
            </div>

            <Button
              variant="outline"
              type="button"
              className="w-full rounded-full border-lyne-border bg-transparent py-6 font-body text-sm font-semibold text-lyne-ink hover:bg-lyne-surface-muted"
            >
              <GoogleIcon className="mr-2" />
              Continue with Google
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}