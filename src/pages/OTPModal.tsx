import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Loader2, Check } from "lucide-react";
import { useSignUp } from "@clerk/react";


type OtpStatus = "idle" | "loading" | "error" | "success";

const CODE_LENGTH = 6;
const RESEND_SECONDS = 30;


interface OtpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
  onVerified?: () => void;
}

export default function OtpModal({
  open,
  onOpenChange,
  email,
  onVerified,
}: OtpModalProps): React.JSX.Element {
  const [digits, setDigits] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [status, setStatus] = useState<OtpStatus>("idle");
  const [resendSeconds, setResendSeconds] = useState<number>(RESEND_SECONDS);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const { signUp } = useSignUp();

  const code = digits.join("");

  const handleVerify = async (e?: React.FormEvent) : Promise<void> => {
    e?.preventDefault();
    setErrorMsg("");
    if (code.length < CODE_LENGTH) return;

    try {
      // Validate the OTP code explicitly
      const { error } = await signUp.verifications.verifyEmailCode({
        code: digits.join(""),
      });

      if (error) {
        setErrorMsg(error.message || "Invalid or expired verification code.");
        setStatus("loading");
        return;
      }

      // If the code is correct, change status and drop browser cookies
      if (signUp.status === "complete") {
        await signUp.finalize();
        onVerified?.();
        // Fully authenticated. Send them to your landing layout route
        window.location.href = "/home";
      }
    } catch (err: unknown) {
      setErrorMsg("Failed to verify code. Please try again." + (err as Error).message);
    } finally {
      setStatus("idle");
    }
    
  };

  // Reset state each time the modal opens.
  useEffect(() => {
    if (open) {
      setDigits(Array(CODE_LENGTH).fill(""));
      setStatus("idle");
      setResendSeconds(RESEND_SECONDS);
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }, [open]);

  // Resend countdown.
  useEffect(() => {
    if (!open || resendSeconds <= 0) return;
    const id = setInterval(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [open, resendSeconds]);

  // Auto-submit once all four digits are filled.
  useEffect(() => {
    if (code.length === CODE_LENGTH && status === "idle") {
        void handleVerify();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const setDigitAt = (index: number, value: string): void => {
    setDigits((current) => {
      const next = [...current];
      next[index] = value;
      return next;
    });
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = e.target.value.replace(/\D/g, "");
    if (!value) {
      setDigitAt(index, "");
      return;
    }
    // Only keep the last character typed, in case of quick re-entry.
    const char = value.slice(-1);
    setDigitAt(index, char);
    if (index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    if (status === "error") setStatus("idle");
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ): void => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>): void => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    const next = Array(CODE_LENGTH).fill("");
    for (let i = 0; i < CODE_LENGTH; i++) {
      next[i] = pasted[i] ?? "";
    }
    setDigits(next);
    const lastFilled = Math.min(pasted.length, CODE_LENGTH) - 1;
    inputRefs.current[Math.max(lastFilled, 0)]?.focus();
  };
  
  const handleResend = (): void => {
    if (resendSeconds > 0) return;
    setResendSeconds(RESEND_SECONDS);
    setDigits(Array(CODE_LENGTH).fill(""));
    setStatus("idle");
    inputRefs.current[0]?.focus();
    // Demo only — trigger your real "resend code" API call here.
    handleVerify();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-3xl border-lyne-divider p-8 sm:max-w-sm">
        <DialogHeader className="items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lyne-surface-muted">
            <Mail className="h-5 w-5 text-lyne-purple-700" />
          </div>
          <DialogTitle className="mt-4 font-display text-xl font-bold tracking-tight text-lyne-ink">
            Verify your email
          </DialogTitle>
          <DialogDescription className="font-body text-sm text-lyne-muted">
            Enter the 4-digit code we sent to
            <br />
            <span className="font-medium text-lyne-ink">{email}</span>
            {status === "error" && (
                <p
                  role="alert"
                  className="rounded-xl bg-red-50 px-3.5 py-2.5 font-body text-sm text-red-600"
                >
                  {errorMsg}
                </p>
              )}
          </DialogDescription>
        </DialogHeader>

        <div
          className="mt-6 flex justify-center gap-3"
          onPaste={handlePaste}
        >
          {digits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              value={digit}
              onChange={(e) => handleChange(index, e)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              inputMode="numeric"
              maxLength={1}
              aria-label={`Digit ${index + 1} of ${CODE_LENGTH}`}
              disabled={status === "loading" || status === "success"}
              className={`h-14 w-12 rounded-xl border bg-white text-center font-mono text-2xl font-bold text-lyne-ink outline-none transition-colors focus:ring-2 focus:ring-lyne-purple-700 disabled:opacity-60 ${
                status === "error"
                  ? "border-red-400"
                  : status === "success"
                  ? "border-lyne-lime-400"
                  : "border-lyne-border"
              }`}
            />
          ))}
        </div>

        <div className="mt-4 min-h-[20px] text-center">
          {status === "error" && (
            <p role="alert" className="font-body text-sm text-red-600">
              That code didn't match. Try again.
            </p>
          )}
          {status === "success" && (
            <p className="flex items-center justify-center gap-1.5 font-body text-sm font-medium text-lyne-purple-700">
              <Check className="h-4 w-4" />
              Verified — you're all set.
            </p>
          )}
        </div>

        <Button
          onClick={(e) => void handleVerify(e)}
          disabled={code.length < CODE_LENGTH || status === "loading" || status === "success"}
          className="mt-2 w-full rounded-full bg-lyne-purple-700 py-6 font-body text-sm font-semibold text-white hover:bg-lyne-purple-900 disabled:opacity-50"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying…
            </>
          ) : (
            "Verify code"
          )}
        </Button>

        <p className="mt-5 text-center font-body text-sm text-lyne-muted">
          Didn't get a code?{" "}
          {resendSeconds > 0 ? (
            <span className="font-mono text-lyne-muted">
              Resend in 0:{String(resendSeconds).padStart(2, "0")}
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-lyne-purple-700 hover:underline"
            >
              Resend code
            </button>
          )}
        </p>
      </DialogContent>
    </Dialog>
  );
}