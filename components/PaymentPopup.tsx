"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, CheckCircle2, Loader2, ArrowRight, Zap, Bitcoin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface PaymentPopupProps {
  show: boolean;
  onClose: () => void;
  onSelect: (method: string) => void;
  onCryptoSelect?: () => void;
  cryptoDisabled?: boolean;
  cryptoDisabledReason?: string;
  cryptoLoading?: boolean;
}

const paymentMethods = [
  "paypal",
  "wise",
  "paysend",
  "remitly",
  "zelle",
  "visa",
  "mastercard",
  "moneygram",
];

export default function PaymentPopup({
  show,
  onClose,
  onSelect,
  onCryptoSelect,
  cryptoDisabled = false,
  cryptoDisabledReason,
  cryptoLoading = false,
}: PaymentPopupProps) {
  const { user, userData } = useAuth();
  const [step, setStep] = useState<"creator-code" | "payment">("creator-code");
  const [codeInput, setCodeInput] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "loading" | "error">("idle");
  const [codeError, setCodeError] = useState("");

  const appliedCode = userData?.creatorCode ?? null;

  useEffect(() => {
    if (show) {
      setStep(user ? "creator-code" : "payment");
      setCodeInput("");
      setCodeStatus("idle");
      setCodeError("");
    }
  }, [show, user]);

  const handleApplyCode = async () => {
    const trimmed = codeInput.trim().toUpperCase();
    if (!trimmed || !user) return;

    setCodeStatus("loading");
    setCodeError("");

    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/referral/apply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ code: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setCodeError(data.error ?? "Failed to apply code");
        setCodeStatus("error");
      } else {
        setCodeInput("");
        setCodeStatus("idle");
      }
    } catch {
      setCodeError("Something went wrong");
      setCodeStatus("error");
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="relative bg-[#1d1d1d] text-white rounded-2xl p-6 w-[90%] max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            >
              <X size={24} />
            </button>

            <AnimatePresence mode="wait">
              {step === "creator-code" ? (
                <motion.div
                  key="creator-code"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <h2 className="text-xl md:text-2xl font-montserrat font-bold text-center mb-1">
                    Do you have a creator code?
                  </h2>
                  <p className="text-center text-sm text-gray-400 mb-6">
                    Support your favorite creator before checking out
                  </p>

                  {appliedCode ? (
                    <div className="flex items-center gap-2 bg-[#2d2d2d] rounded-lg px-4 py-3 w-fit mx-auto mb-6">
                      <CheckCircle2 size={15} className="text-green-400 shrink-0" />
                      <span className="text-sm text-gray-300">
                        Referred by{" "}
                        <span className="font-bold text-white">{appliedCode}</span>
                      </span>
                    </div>
                  ) : (
                    <div className="mb-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Enter creator code"
                          value={codeInput}
                          onChange={(e) => {
                            setCodeInput(e.target.value);
                            setCodeStatus("idle");
                            setCodeError("");
                          }}
                          onKeyDown={(e) => e.key === "Enter" && handleApplyCode()}
                          className="flex-1 bg-[#2d2d2d] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#FF7D29] transition"
                        />
                        <button
                          onClick={handleApplyCode}
                          disabled={!codeInput.trim() || codeStatus === "loading"}
                          className="flex items-center gap-1.5 bg-[#FF7D29] hover:bg-[#e96e1b] disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold px-4 py-2 rounded-lg transition"
                        >
                          {codeStatus === "loading" ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            "Apply"
                          )}
                        </button>
                      </div>
                      {codeStatus === "error" && (
                        <p className="text-xs text-red-400 mt-1.5 ml-1">{codeError}</p>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-6">
                    <button
                      onClick={() => setStep("payment")}
                      className="text-sm text-gray-400 hover:text-white transition"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => setStep("payment")}
                      className="flex items-center gap-2 bg-[#FF7D29] hover:bg-[#e96e1b] text-white text-sm font-bold px-5 py-2.5 rounded-lg transition"
                    >
                      Continue <ArrowRight size={15} />
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <h2 className="text-xl md:text-2xl font-montserrat font-bold text-center mb-1">
                    Choose your preferred payment method
                  </h2>
                  <p className="text-center text-sm text-gray-300 mb-5">
                    Secure and fast transactions
                  </p>

                  {appliedCode && (
                    <div className="flex items-center gap-2 bg-[#2d2d2d] rounded-lg px-4 py-2.5 w-fit mx-auto mb-5">
                      <CheckCircle2 size={15} className="text-green-400 shrink-0" />
                      <span className="text-sm text-gray-300">
                        Referred by{" "}
                        <span className="font-bold text-white">{appliedCode}</span>
                      </span>
                    </div>
                  )}

                  {onCryptoSelect && (
                    <motion.button
                      type="button"
                      onClick={() => !cryptoDisabled && !cryptoLoading && onCryptoSelect()}
                      disabled={cryptoDisabled || cryptoLoading}
                      whileHover={!cryptoDisabled && !cryptoLoading ? { scale: 1.01 } : {}}
                      whileTap={!cryptoDisabled && !cryptoLoading ? { scale: 0.99 } : {}}
                      className={`group relative w-full mb-5 overflow-hidden rounded-xl border border-[#FF7D29]/40 bg-gradient-to-br from-[#2a1d0d] via-[#1d1d1d] to-[#2a1d0d] px-5 py-4 text-left transition ${
                        cryptoDisabled
                          ? "opacity-50 cursor-not-allowed"
                          : cryptoLoading
                          ? "cursor-wait"
                          : "hover:border-[#FF7D29]"
                      }`}
                    >
                      <div
                        className="pointer-events-none absolute -inset-x-10 -top-10 h-24 rotate-12 bg-gradient-to-r from-transparent via-[#FF7D29]/10 to-transparent blur-2xl transition-transform duration-700 group-hover:translate-x-6"
                        aria-hidden
                      />
                      <div className="relative flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#FF7D29]/15 ring-1 ring-[#FF7D29]/30">
                          <Bitcoin size={22} className="text-[#FF7D29]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-montserrat font-bold text-base">
                              Pay with Crypto
                            </span>
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#FF7D29] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                              <Zap size={10} className="fill-white" />
                              Instant
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-gray-400">
                            {cryptoDisabled && cryptoDisabledReason
                              ? cryptoDisabledReason
                              : "BTC, ETH, USDT & more — coins credited automatically"}
                          </p>
                        </div>
                        <div className="shrink-0">
                          {cryptoLoading ? (
                            <Loader2 size={20} className="animate-spin text-[#FF7D29]" />
                          ) : (
                            <ArrowRight
                              size={20}
                              className="text-[#FF7D29] transition-transform group-hover:translate-x-1"
                            />
                          )}
                        </div>
                      </div>
                    </motion.button>
                  )}

                  {onCryptoSelect && (
                    <div className="mb-4 flex items-center gap-3">
                      <div className="h-px flex-1 bg-white/10" />
                      <span className="text-[11px] uppercase tracking-widest text-gray-500">
                        or pay another way
                      </span>
                      <div className="h-px flex-1 bg-white/10" />
                    </div>
                  )}

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method}
                        className="bg-[#2d2d2d] rounded-lg p-4 flex flex-col items-center gap-3"
                      >
                        <Image
                          src={`/images/payments/${method}.png`}
                          alt={method}
                          width={80}
                          height={40}
                          className="h-10 w-auto object-contain"
                        />
                        <button
                          onClick={() => onSelect(method)}
                          className="bg-[#FF7D29] hover:bg-[#e96e1b] text-white text-xs font-bold py-2 px-4 rounded"
                        >
                          Select
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
