"use client";

import { useState } from "react";
import Image from "next/image";
import { X, CheckCircle2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface PaymentPopupProps {
  show: boolean;
  onClose: () => void;
  onSelect: (method: string) => void;
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

export default function PaymentPopup({ show, onClose, onSelect }: PaymentPopupProps) {
  const { user, userData } = useAuth();
  const [codeInput, setCodeInput] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "loading" | "error">("idle");
  const [codeError, setCodeError] = useState("");

  const appliedCode = userData?.creatorCode ?? null;

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
        // userData updates automatically via onSnapshot in AuthContext
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
          <div className="relative bg-[#1d1d1d] text-white rounded-2xl p-6 w-[90%] max-w-lg shadow-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-montserrat font-bold text-center mb-1">
              Choose your preferred payment method
            </h2>
            <p className="text-center text-sm text-gray-300 mb-5">
              Secure and fast transactions
            </p>

            {/* Creator code section */}
            {user && (
              <div className="mb-5">
                {appliedCode ? (
                  <div className="flex items-center gap-2 bg-[#2d2d2d] rounded-lg px-4 py-2.5 w-fit mx-auto">
                    <CheckCircle2 size={15} className="text-green-400 shrink-0" />
                    <span className="text-sm text-gray-300">
                      Referred by{" "}
                      <span className="font-bold text-white">{appliedCode}</span>
                    </span>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Creator code (optional)"
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
                )}
                {codeStatus === "error" && (
                  <p className="text-xs text-red-400 mt-1.5 ml-1">{codeError}</p>
                )}
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
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
