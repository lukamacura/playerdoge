"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Tag,
  Users,
  Wallet,
  CheckCircle2,
  XCircle,
  Loader2,
  TrendingUp,
  KeyRound,
} from "lucide-react";

interface CreatorData {
  code: string;
  displayName: string;
  active: boolean;
  commissionPct: number;
  totalReferredUsers: number;
  totalReferredRevenueUSD: number;
}

export default function CreatorPage() {
  const { user, loading } = useAuth();
  const [codeInput, setCodeInput] = useState("");
  const [creator, setCreator] = useState<CreatorData | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async () => {
    if (!user) return;
    const code = codeInput.trim().toUpperCase();
    if (!code) {
      setError("Enter your creator code.");
      return;
    }
    setVerifying(true);
    setError("");
    try {
      const snap = await getDoc(doc(db, "creatorCodes", code));
      if (!snap.exists()) {
        setError("Code not found.");
        setVerifying(false);
        return;
      }
      const data = snap.data();
      setCreator({
        code: snap.id,
        displayName: data.displayName ?? "",
        active: data.active ?? false,
        commissionPct: data.commissionPct ?? 0,
        totalReferredUsers: data.totalReferredUsers ?? 0,
        totalReferredRevenueUSD: data.totalReferredRevenueUSD ?? 0,
      });
    } catch {
      setError("Something went wrong. Try again.");
    }
    setVerifying(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFFD2]">
        <Loader2 className="animate-spin text-[#1d1d1d]" size={32} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#FEFFD2] flex flex-col items-center justify-center text-center px-4 gap-4">
        <KeyRound size={56} className="text-[#FF7D29]" />
        <h2 className="text-2xl font-bold text-[#1D1D1D] font-montserrat">Creator Portal</h2>
        <p className="text-[#1d1d1d]/60 max-w-xs text-sm">
          You need to be logged in to access your creator dashboard.
        </p>
        <Link
          href="/login"
          className="mt-2 bg-[#FF7D29] hover:bg-[#FF924D] text-white font-bold font-montserrat py-2 px-8 rounded-md transition-all duration-200"
        >
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FEFFD2] px-4 py-32 flex flex-col items-center">
      <AnimatePresence mode="wait">
        {!creator ? (
          <motion.div
            key="enter-code"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-sm"
          >
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-[#FFEFC4] border border-[#1d1d1d]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                <Tag size={28} className="text-[#1d1d1d]" />
              </div>
              <h1 className="text-2xl font-bold text-[#1d1d1d] font-montserrat">Creator Portal</h1>
              <p className="text-[#1d1d1d]/50 text-sm mt-1">Enter your code to see your stats</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md border border-[#1d1d1d]/10">
              <label className="text-xs font-semibold text-[#1d1d1d]/60 mb-1.5 block">
                Your creator code
              </label>
              <Input
                placeholder="e.g. KINGED"
                value={codeInput}
                onChange={(e) => {
                  setCodeInput(e.target.value.toUpperCase());
                  setError("");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleVerify()}
                className="font-mono font-bold tracking-widest text-center border-[#1d1d1d]/30 focus:border-[#1d1d1d] uppercase"
              />
              {error && (
                <p className="text-xs text-red-500 mt-2 text-center">{error}</p>
              )}
              <button
                onClick={handleVerify}
                disabled={verifying}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-[#1d1d1d] text-[#FFEFC4] font-bold py-2.5 rounded-xl hover:bg-[#333] disabled:opacity-50 transition-colors"
              >
                {verifying ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <CheckCircle2 size={15} />
                )}
                {verifying ? "Verifying..." : "Access Dashboard"}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35 }}
            className="w-full max-w-lg"
          >
            {/* Header row */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-[#1d1d1d] text-base bg-[#FFEFC4] px-3 py-1 rounded-lg border border-[#1d1d1d]/10">
                    {creator.code}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      creator.active
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-500"
                    }`}
                  >
                    {creator.active ? "Active" : "Inactive"}
                  </span>
                </div>
                {creator.displayName && (
                  <p className="text-[#1d1d1d]/50 text-sm mt-1.5">{creator.displayName}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setCreator(null);
                  setCodeInput("");
                }}
                className="text-xs text-[#1d1d1d]/40 hover:text-[#1d1d1d] transition-colors underline shrink-0 mt-1"
              >
                Switch code
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-3">
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.08 }}
                className="bg-white rounded-2xl p-5 border border-[#1d1d1d]/10 shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-[#1d1d1d]/45 text-xs font-semibold mb-3 uppercase tracking-wide">
                  <Wallet size={12} />
                  Earnings
                </div>
                <p className="text-3xl font-extrabold text-[#1d1d1d] font-montserrat leading-none">
                  ${creator.totalReferredRevenueUSD.toFixed(2)}
                </p>
                <p className="text-xs text-[#1d1d1d]/35 mt-1.5">total earned</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.14 }}
                className="bg-white rounded-2xl p-5 border border-[#1d1d1d]/10 shadow-sm"
              >
                <div className="flex items-center gap-1.5 text-[#1d1d1d]/45 text-xs font-semibold mb-3 uppercase tracking-wide">
                  <Users size={12} />
                  Referrals
                </div>
                <p className="text-3xl font-extrabold text-[#1d1d1d] font-montserrat leading-none">
                  {creator.totalReferredUsers}
                </p>
                <p className="text-xs text-[#1d1d1d]/35 mt-1.5">users referred</p>
              </motion.div>
            </div>

            {creator.commissionPct > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-[#1d1d1d] to-[#383838] rounded-2xl p-5 text-[#FFEFC4] flex items-center gap-4"
              >
                <TrendingUp size={26} className="shrink-0 opacity-70" />
                <div>
                  <p className="text-xs font-semibold opacity-50 mb-0.5 uppercase tracking-wide">
                    Commission rate
                  </p>
                  <p className="text-2xl font-extrabold font-montserrat leading-none">
                    {(creator.commissionPct * 100).toFixed(0)}% per sale
                  </p>
                </div>
              </motion.div>
            )}

            {!creator.active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.26 }}
                className="mt-3 flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600"
              >
                <XCircle size={15} className="shrink-0" />
                Your code is currently inactive. Contact us to reactivate it.
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
