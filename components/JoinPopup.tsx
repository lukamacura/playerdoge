"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function JoinPopup() {
  const { user, loading } = useAuth();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      const timer = setTimeout(() => {
        setShow(true);
      }, 6000); // 6 sekundi

      return () => clearTimeout(timer);
    }
  }, [loading, user]);

  if (loading || user) {
    // Ako i dalje proverava auth ili je user logovan, ne prikazuj popup
    return null;
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <div className="relative bg-[#1d1d1d] text-white rounded-2xl p-6 w-[90%] max-w-md text-center shadow-2xl">
            <button
              onClick={() => setShow(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition"
            >
              <X size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-montserrat font-bold mb-6">
              🔥 Grab 100 free coins
              <br />
              when you join us!
            </h2>
            <Link href="/register" onClick={() => setShow(false)}>
              <button className="w-full bg-gradient-to-r from-orange-500 to-orange-400 hover:brightness-110 text-white font-semibold py-3 rounded-lg shadow-md transition">
                Register
              </button>
            </Link>
            <p className="mt-4 text-sm text-gray-300">
              Have an account?{" "}
              <Link href="/login" onClick={() => setShow(false)}>
                <span className="text-orange-400 hover:underline cursor-pointer">
                  Login
                </span>
              </Link>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
