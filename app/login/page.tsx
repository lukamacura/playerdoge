"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      if (!user.emailVerified) {
        setError("Please verify your email address before logging in.");
        return;
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof FirebaseError) {
        const code = err.code;
        if (code === "auth/user-not-found")
          setError("No account found with this email.");
        else if (code === "auth/wrong-password")
          setError("Incorrect password.");
        else if (code === "auth/invalid-email")
          setError("Invalid email address.");
        else setError("Something went wrong. Please try again.");
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FEFFD2] flex items-center justify-center px-4 pt-[10vh]">
      <div className="max-w-5xl w-full flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Login Form */}
        <motion.form
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          onSubmit={handleLogin}
          className="w-full max-w-md bg-[#FF7D29]/10 rounded-3xl shadow-xl p-8 text-[#1D1D1D]"
        >
          <h1 className="text-2xl font-bold mb-4 text-center font-montserrat">
            Login
          </h1>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="✉️ E-mail"
              className="w-full bg-[#FEFFD2] placeholder:text-black/50 border border-[#FF7D29]/30 p-3 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="🔒 Password"
              className="w-full bg-[#FEFFD2] placeholder:text-black/50 border border-[#FF7D29]/30 p-3 rounded-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p className="text-red-600 text-sm mt-1">{error}</p>
            )}

            <button
              type="submit"
              className="w-full h-14 bg-[#FF7D29] hover:bg-[#e96e1b] text-white font-bold font-montserrat py-2 rounded-md"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>

          <p className="text-sm text-center mt-4 text-[#1D1D1D]/70">
            Forgot your password?{" "}
            <Link href="/reset" className="text-[#FF7D29] font-semibold">
              Reset
            </Link>
          </p>
          <p className="text-sm text-center mt-2 text-[#1D1D1D]">
            Don’t have an account?{" "}
            <Link href="/register" className="text-[#FF7D29] font-semibold">
              Register
            </Link>
          </p>
        </motion.form>

        {/* Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md flex justify-center"
        >
          <Image
            src="/images/login.png"
            alt="Doge login"
            width={400}
            height={400}
            priority
          />
        </motion.div>
      </div>
    </div>
  );
}
