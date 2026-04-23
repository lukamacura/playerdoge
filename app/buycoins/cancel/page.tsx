"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export default function BuyCoinsCancelPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#FEFFD2] font-inter pt-28 pb-20 px-4">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #1D1D1D 1px, transparent 0)",
          backgroundSize: "22px 22px",
        }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative mx-auto max-w-xl rounded-3xl border border-[#1D1D1D]/10 bg-white/80 p-8 md:p-12 text-center shadow-[0_30px_80px_-30px_rgba(29,29,29,0.3)] backdrop-blur"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFEFC4] ring-4 ring-[#1D1D1D]/5">
          <ShieldCheck size={32} className="text-[#1D1D1D]" />
        </div>

        <h1 className="font-montserrat text-3xl md:text-4xl font-extrabold text-[#1D1D1D]">
          Payment canceled
        </h1>

        <p className="mt-4 text-base md:text-lg text-[#1D1D1D]/70">
          No worries — nothing was charged. Your wallet and your balance are untouched.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/buycoins"
            className="group inline-flex items-center gap-2 rounded-xl bg-[#FF7D29] hover:bg-[#e96e1b] px-6 py-3 font-montserrat text-sm font-bold text-white shadow-lg transition"
          >
            <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
            Back to coin packs
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-[#1D1D1D]/20 bg-white px-6 py-3 font-montserrat text-sm font-bold text-[#1D1D1D] hover:bg-[#FFEFC4] transition"
          >
            Go to dashboard
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
