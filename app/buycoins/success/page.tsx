"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2, Sparkles, ArrowRight, Hourglass, XCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type Status = string;

const DEAD_STATUSES = ["canceled", "rejected", "expired"];

function SuccessContent() {
  const params = useSearchParams();
  const token = params.get("token");
  const { user } = useAuth();
  const [status, setStatus] = useState<Status>("unknown");
  const [coinAmount, setCoinAmount] = useState<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user || !token) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const idToken = await user.getIdToken();
        const res = await fetch(`/api/payment/status?token=${encodeURIComponent(token)}`, {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (!res.ok) {
          if (!cancelled) setStatus("unknown");
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setCoinAmount(data.coinAmount ?? null);
        setStatus(data.status as Status);
        if (data.status !== "credited" && !DEAD_STATUSES.includes(data.status)) {
          timeoutRef.current = setTimeout(poll, 3000);
        }
      } catch {
        if (!cancelled) timeoutRef.current = setTimeout(poll, 5000);
      }
    };

    poll();
    const hardTimeout = setTimeout(() => {
      cancelled = true;
      setStatus((s) => (s === "credited" ? s : "timeout"));
    }, 5 * 60 * 1000);

    return () => {
      cancelled = true;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearTimeout(hardTimeout);
    };
  }, [user, token]);

  const credited = status === "credited";
  const dead = DEAD_STATUSES.includes(status);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FEFFD2] font-inter pt-28 pb-20 px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #1D1D1D 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[#FF7D29]/20 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-[#1D1D1D]/10 bg-white/70 p-8 md:p-12 shadow-[0_30px_80px_-30px_rgba(29,29,29,0.3)] backdrop-blur"
        >
          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0.5, rotate: -15 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 14 }}
              className="relative"
            >
              <AnimatePresence mode="wait">
                {credited ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 18 }}
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-[#FF7D29] shadow-[0_10px_40px_-8px_rgba(255,125,41,0.6)]"
                  >
                    <CheckCircle2 size={52} className="text-white" strokeWidth={2.5} />
                  </motion.div>
                ) : dead ? (
                  <motion.div
                    key="dead"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1D1D1D]"
                  >
                    <XCircle size={44} className="text-[#FEFFD2]" />
                  </motion.div>
                ) : status === "timeout" ? (
                  <motion.div
                    key="hourglass"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-24 w-24 items-center justify-center rounded-full bg-[#1D1D1D]"
                  >
                    <Hourglass size={44} className="text-[#FEFFD2]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="loading"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="relative flex h-24 w-24 items-center justify-center rounded-full bg-[#FFEFC4] ring-4 ring-[#FF7D29]/20"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
                    >
                      <Loader2 size={44} className="text-[#FF7D29]" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              {credited && (
                <>
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1.2, 0],
                        x: Math.cos((i / 6) * Math.PI * 2) * 70,
                        y: Math.sin((i / 6) * Math.PI * 2) * 70,
                      }}
                      transition={{ delay: 0.4 + i * 0.08, duration: 1.2, ease: "easeOut" }}
                      className="absolute left-1/2 top-1/2 -ml-2 -mt-2"
                    >
                      <Sparkles size={16} className="text-[#FF7D29]" />
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-8 text-center font-montserrat text-3xl md:text-5xl font-extrabold tracking-tight text-[#1D1D1D]"
          >
            {credited
              ? "Payment confirmed"
              : dead
                ? "Payment not completed"
                : status === "timeout"
                  ? "Still confirming..."
                  : "Waiting for blockchain"}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
            className="mt-4 text-center text-base md:text-lg text-[#1D1D1D]/70"
          >
            {credited && coinAmount
              ? "Your coins have just landed in your account."
              : dead
                ? "This payment was canceled or expired before completing, so no coins were credited. You can start a new purchase anytime."
                : status === "timeout"
                  ? "Your payment is taking longer than usual. It will still be credited automatically — check your dashboard shortly."
                  : "We're watching the network. This usually takes just a minute or two."}
          </motion.p>

          {credited && coinAmount && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5, type: "spring" }}
              className="mt-8 flex items-center justify-center"
            >
              <div className="flex items-center gap-3 rounded-2xl border-2 border-[#1D1D1D] bg-[#FFEFC4] px-6 py-4 shadow-[4px_4px_0_0_#1D1D1D]">
                <Image
                  src="/images/by1.png"
                  alt="coins"
                  width={44}
                  height={44}
                  className="drop-shadow"
                />
                <div>
                  <div className="font-montserrat text-3xl font-extrabold text-[#1D1D1D]">
                    +{coinAmount.toLocaleString()}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-[#1D1D1D]/60">
                    coins credited
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link
              href="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-[#FF7D29] hover:bg-[#e96e1b] px-6 py-3 font-montserrat text-sm font-bold text-white shadow-lg transition"
            >
              Go to dashboard
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/buycoins"
              className="inline-flex items-center gap-2 rounded-xl border border-[#1D1D1D]/20 bg-white px-6 py-3 font-montserrat text-sm font-bold text-[#1D1D1D] hover:bg-[#FFEFC4] transition"
            >
              Buy more coins
            </Link>
          </motion.div>

          {!credited && !dead && (
            <p className="mt-6 text-center text-xs text-[#1D1D1D]/50">
              You can safely leave this page — coins will appear on your dashboard as soon
              as the transaction confirms.
            </p>
          )}
        </motion.div>
      </div>
    </main>
  );
}

export default function BuyCoinsSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#FEFFD2] flex items-center justify-center">
          <Loader2 size={32} className="animate-spin text-[#FF7D29]" />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
