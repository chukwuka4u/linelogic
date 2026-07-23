import React, { useState, useEffect } from "react";
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
  Sparkles,
} from "lucide-react";
import { Link } from "react-router";
import { useSignIn } from "@clerk/react"


// Design tokens: see tailwind.config.ts (lyne.*) and lyne-tokens.ts

type AuthStatus = "idle" | "loading" | "error" | "success";

function useTicker(start: number, everyMs: number, step: number): number {
  const [n, setN] = useState<number>(start);
  useEffect(() => {
    const id = setInterval(() => setN((v) => v + step), everyMs);
    return () => clearInterval(id);
  }, [everyMs, step]);
  return n;
}

function BrandPanel(): React.JSX.Element {
  const serving = useTicker(41, 4200, 1);

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
          Your queues, picking up
          <br />
          right where you left them.
        </p>
        <p className="mt-4 max-w-sm font-body text-sm leading-relaxed text-white/60">
          Sign in to manage live queues, see who's waiting, and call the
          next person — from any device.
        </p>

        <div className="mt-10 w-full max-w-xs rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
          <div className="flex items-center justify-between">
            <span className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Queue A · Front desk
            </span>
            <span className="flex items-center gap-1.5 rounded-full bg-lyne-lime-400/15 px-2 py-0.5 text-[10px] font-semibold text-lyne-lime-400">
              <span className="h-1.5 w-1.5 rounded-full bg-lyne-lime-400 animate-pulse" />
              Live
            </span>
          </div>
          <p className="mt-4 font-body text-[11px] font-medium uppercase tracking-[0.18em] text-white/40">
            Now serving
          </p>
          <p
            key={serving}
            className="font-mono text-4xl font-bold text-lyne-lime-400 [animation:fadein_0.4s_ease]"
          >
            A—{String(serving).padStart(3, "0")}
          </p>
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


export default function Login(): React.JSX.Element {
  const {fetchStatus, signIn, errors} = useSignIn(); // TODO: implement Clerk sign-in
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [remember, setRemember] = useState<boolean>(true);
  const [status, setStatus] = useState<AuthStatus>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  
  async function signInWithGoogle(): Promise<void> {
    try {
    // Trigger the OAuth redirect flow natively with Core 3
    const { error } = await signIn.sso({
      strategy: "oauth_google",
      redirectCallbackUrl: "/sso-callback",       // Route handling the callback context
      redirectUrl: "/home", // Where to send users after successful login
    });
    if (error) {
      setErrorMsg(error.message)
      console.error("Google sign-in initiation failed:", error.message);
    }
    } catch (err: unknown) {
      console.error("Google sign in initialization failed:", err);
    }
  }
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setErrorMsg("");

    if (!email || !password) {
      setStatus("error");
      setErrorMsg("Enter your email and password to continue.");
      return;
    }

    if (fetchStatus === "fetching")
      setStatus("loading");
    if (errors)
      setStatus("error");

      // Demo only — replace with real auth call.
      const { error } = await signIn.create({
        identifier: email,
        password: password,
      });
      if (error) {
        setStatus("error");
        return;
      }
      setStatus("success");
      if (signIn.status === "complete") {
        // 3. Set the active session and redirect the user
        await signIn.finalize()
        window.location.href = "/home";
      } else {
        console.log("Additional steps required:", signIn.status);
      }
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
              Welcome back
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight sm:text-3xl">
              Sign in to LineLogic
            </h1>
            <p className="mt-2 font-body text-sm text-lyne-muted">
              New here?{" "}
              <Link to="/register" className="font-semibold text-lyne-purple-700 hover:underline">
                Create a free account
              </Link>
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="font-body text-sm font-medium text-lyne-ink"
                >
                  Email
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
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="font-body text-sm font-medium text-lyne-ink"
                  >
                    Password
                  </Label>
                  <a
                    href="#"
                    className="font-body text-xs font-semibold text-lyne-purple-700 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="••••••••"
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
                  <Sparkles className="h-4 w-4" />
                  Signed in — taking you to your dashboard.
                </p>
              )}

              <div className="flex items-center gap-2">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v: boolean | "indeterminate") =>
                    setRemember(v === true)
                  }
                  className="border-lyne-border data-[state=checked]:border-lyne-purple-700 data-[state=checked]:bg-lyne-purple-700"
                />
                <Label
                  htmlFor="remember"
                  className="font-body text-sm font-normal text-lyne-body"
                >
                  Keep me signed in for 30 days
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
                    Signing in…
                  </>
                ) : (
                  <>
                    Sign in
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
              onClick={signInWithGoogle}
            >
              <GoogleIcon className="mr-2" />
              Continue with Google
            </Button>

            <p className="mt-8 font-body text-xs leading-relaxed text-lyne-muted">
              By signing in, you agree to LineLogic's{" "}
              <a href="#" className="font-semibold text-lyne-purple-700 hover:underline">
                Terms
              </a>{" "}
              and{" "}
              <a href="#" className="font-semibold text-lyne-purple-700 hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}