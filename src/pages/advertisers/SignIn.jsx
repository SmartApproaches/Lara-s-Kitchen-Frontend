import { useEffect, useRef, useState } from "react";
import { Alert, Input } from "antd";
import { HugeiconsIcon } from "@hugeicons/react";
import { Mail01Icon, Megaphone01Icon } from "@hugeicons/core-free-icons";

import { clientSession, useSendCodeMutation, useSignInMutation } from "../../redux/api/adClientApi";

const RESEND_SECONDS = 60;
const CODE_LENGTH = 6;
const isEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const PrimaryButton = ({ children, loading, disabled, ...props }) => (
  <button
    type="submit"
    disabled={disabled || loading}
    className="h-12 w-full rounded-lg bg-[#1F5226] px-5 font-semibold text-white transition hover:bg-[#0d5729] disabled:cursor-not-allowed disabled:opacity-60"
    {...props}
  >
    {loading ? "Please wait…" : children}
  </button>
);

// Six single-digit boxes; typing moves on, Backspace moves back, pasting fills them all.
const CodeBoxes = ({ value, onChange, disabled }) => {
  const refs = useRef([]);
  const digits = Array.from({ length: CODE_LENGTH }, (_, i) => value[i] ?? "");

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  const fillAll = (text) => {
    const clean = text.replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!clean) return;
    onChange(clean);
    refs.current[Math.min(clean.length, CODE_LENGTH - 1)]?.focus();
  };

  const handleInput = (index, text) => {
    const clean = text.replace(/\D/g, "");
    if (!clean) return;
    // A whole code (browser autofill of a one-time code) fills every box.
    if (clean.length >= CODE_LENGTH) {
      fillAll(clean);
      return;
    }
    // Otherwise the newest digit typed replaces this box.
    const digit = clean.slice(-1);
    const next = (value.slice(0, index) + digit + value.slice(index + 1)).slice(0, CODE_LENGTH);
    onChange(next);
    refs.current[Math.min(index + 1, CODE_LENGTH - 1)]?.focus();
  };

  return (
    <div
      className="flex justify-between gap-2"
      onPaste={(e) => {
        e.preventDefault();
        fillAll(e.clipboardData.getData("text"));
      }}
    >
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          value={digit}
          disabled={disabled}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          aria-label={`Digit ${i + 1}`}
          maxLength={CODE_LENGTH}
          onChange={(e) => handleInput(i, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Backspace") {
              e.preventDefault();
              if (digit) onChange(value.slice(0, i) + value.slice(i + 1));
              else if (i > 0) {
                onChange(value.slice(0, i - 1) + value.slice(i));
                refs.current[i - 1]?.focus();
              }
            } else if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
            else if (e.key === "ArrowRight" && i < CODE_LENGTH - 1) refs.current[i + 1]?.focus();
          }}
          className="h-14 w-full min-w-0 rounded-lg border border-gray-300 bg-white text-center text-2xl font-bold text-[#1F5226] outline-none focus:border-[#157F3B] focus:ring-2 focus:ring-[#D6FADB]"
        />
      ))}
    </div>
  );
};

const SignIn = ({ onSignedIn }) => {
  const [step, setStep] = useState("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  const [sendCode, { isLoading: isSending }] = useSendCodeMutation();
  const [signIn, { isLoading: isSigningIn }] = useSignInMutation();

  // Count down the "Send a new code" wait.
  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const t = setTimeout(() => setCooldown((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const requestCode = async () => {
    setError(null);
    try {
      const res = await sendCode(email.trim()).unwrap();
      // The answer never says whether the email has ads: show it as it is.
      setNotice(
        res?.message ||
          "If that email has adverts with Lara's Kitchen, a sign-in code is on its way.",
      );
      setStep("code");
      setCode("");
      setCooldown(RESEND_SECONDS);
    } catch (err) {
      setError(err?.data?.message || "We couldn't send a code. Please try again.");
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!isEmail(email.trim())) {
      setError("Enter a valid email address.");
      return;
    }
    requestCode();
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (code.length !== CODE_LENGTH) {
      setError("The code is 6 digits.");
      return;
    }
    setError(null);
    try {
      const session = await signIn({ email: email.trim(), code }).unwrap();
      clientSession.set(session);
      onSignedIn(session);
    } catch (err) {
      setError(err?.data?.message || "We couldn't sign you in. Please try again.");
    }
  };

  const useAnotherEmail = () => {
    setStep("email");
    setCode("");
    setNotice(null);
    setError(null);
  };

  const isCodeStep = step === "code";

  return (
    <div className="mx-auto w-full max-w-md pt-4 sm:pt-10">
      <div className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_40px_-12px_rgba(31,82,38,0.25)]">
        <div className="h-1.5 bg-gradient-to-r from-[#1F5226] via-[#00BC1A] to-[#F5AB0A]" />

        <div className="px-6 pt-8 pb-6 sm:px-10 sm:pt-10">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D6FADB] text-[#1F5226]">
            <HugeiconsIcon icon={isCodeStep ? Mail01Icon : Megaphone01Icon} size={28} />
          </div>

          <h1 className="text-center text-2xl font-bold text-[#2A3A25]">
            {isCodeStep ? "Check your email" : "Your ads with Lara's Kitchen"}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-center text-sm leading-relaxed text-gray-500">
            {isCodeStep ? (
              <>
                Enter the 6-digit code sent to{" "}
                <span className="font-semibold break-all text-[#2A3A25]">{email}</span>
              </>
            ) : (
              "Sign in with the email your ads were booked with to see how they're doing."
            )}
          </p>

          {!isCodeStep ? (
            <form onSubmit={handleEmailSubmit} className="mt-8 flex flex-col gap-4" noValidate>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">Email address</span>
                <Input
                  size="large"
                  type="email"
                  autoComplete="email"
                  autoFocus
                  placeholder="you@business.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(null);
                  }}
                  status={error ? "error" : undefined}
                  className="!h-12 !rounded-lg"
                />
              </label>
              {error && <Alert type="error" showIcon message={error} className="!rounded-lg" />}
              <PrimaryButton loading={isSending}>Send me a code</PrimaryButton>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="mt-8 flex flex-col gap-4" noValidate>
              {notice && (
                <p className="rounded-lg bg-[#EFFFF1] px-4 py-3 text-center text-xs leading-relaxed text-[#1F5226]">
                  {notice}
                </p>
              )}
              <CodeBoxes
                value={code}
                onChange={(next) => {
                  setCode(next);
                  setError(null);
                }}
                disabled={isSigningIn}
              />
              {error && <Alert type="error" showIcon message={error} className="!rounded-lg" />}
              <PrimaryButton loading={isSigningIn} disabled={code.length !== CODE_LENGTH}>
                Sign in
              </PrimaryButton>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-sm">
                <button
                  type="button"
                  onClick={requestCode}
                  disabled={cooldown > 0 || isSending}
                  className="font-semibold text-[#157F3B] hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                >
                  {cooldown > 0 ? `Send a new code (${cooldown}s)` : "Send a new code"}
                </button>
                <button
                  type="button"
                  onClick={useAnotherEmail}
                  className="font-semibold text-gray-600 hover:underline"
                >
                  Use another email
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="border-t border-gray-100 bg-gray-50 px-6 py-4 text-center text-xs text-gray-500 sm:px-10">
          {isCodeStep
            ? "The code works for 10 minutes. Can't find it? Check your spam folder."
            : "No password needed: we email you a code each time you sign in."}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
