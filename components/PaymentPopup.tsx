"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  "master",
  "moneygram",
];

export default function PaymentPopup({ show, onClose, onSelect }: PaymentPopupProps) {
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
            <p className="text-center text-sm text-gray-300 mb-6">
              Secure and fast transactions
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {paymentMethods.map((method) => (
                <div key={method} className="bg-[#2d2d2d] rounded-lg p-4 flex flex-col items-center gap-3">
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
