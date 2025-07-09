"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import ProtectedRoute from "@/components/ProtectedRoute";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { motion } from "framer-motion";

type Purchase = {
  game: string;
  amount: number;
  image: string;
  time: string;
};

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [coins, setCoins] = useState<number | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setCoins(docSnap.data().coins || 0);
      }

      const q = query(
        collection(db, "users", user.uid, "purchases"),
        orderBy("timestamp", "desc")
      );
      const snap = await getDocs(q);
const list: Purchase[] = snap.docs.map((doc) => {
  const item = doc.data();
  let displayTime = "Unknown time";
  if (item.timestamp) {
    if (typeof item.timestamp.toDate === "function") {
      displayTime = formatDistanceToNow(item.timestamp.toDate(), { addSuffix: true });
    } else if (item.timestamp.seconds) {
      displayTime = formatDistanceToNow(new Date(item.timestamp.seconds * 1000), { addSuffix: true });
    }
  }

  return {
    game: item.game ?? "Unknown game",
    amount: item.amount ?? 0,
    image: item.image ?? "/images/placeholder.png",
    time: displayTime,
  };
});


      setPurchases(list);
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FEFFD2] flex items-center justify-center">
        <p className="text-[#1D1D1D] font-semibold text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="min-h-screen bg-[#FEFFD2] flex flex-col items-center justify-center text-center px-4"
      >
        <Image
          src="/images/dash-nologin.png"
          alt="Not logged in"
          width={320}
          height={320}
          priority
        />
        <h2 className="text-2xl font-bold text-[#1D1D1D] mt-6 font-montserrat drop-shadow-md">
          🔒 You need to log in to continue...
        </h2>
        <p className="text-[#333] mt-2 max-w-md text-base font-medium">
          You need an account to view your coins and purchases. Please log in or register to continue.
        </p>

        <Link href="/login" passHref>
          <div className="mt-6 inline-block bg-[#FF7D29] hover:bg-[#FF924D] text-white font-bold font-montserrat py-2 px-6 rounded-md transition-all duration-200 cursor-pointer">
            Login
          </div>
        </Link>
        <p className="text-sm text-center mt-2 text-[#1D1D1D]">
          Don’t have an account?{" "}
          <Link href="/register" className="text-[#FF7D29] font-semibold">
            Register
          </Link>
        </p>
      </motion.div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FEFFD2] px-4 py-40">
        {/* Coin balance */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto bg-gradient-to-b from-[#FF7D29] to-[#FFAD29] rounded-2xl p-8 text-white shadow-xl mb-12"
        >
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src="/images/coin.png"
                alt="Coin icon"
                width={80}
                height={80}
                priority
              />
              <div>
                <h2 className="text-lg font-semibold ">
                  Total coins
                </h2>
                <div className="text-5xl font-extrabold font-montserrat">
                  {coins !== null ? coins.toLocaleString() : "..."}
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex flex-col gap-3 items-center">
              <Link
                href="/buycoins"
                className="bg-white text-[#FF7D29] font-montserrat font-bold px-10 py-2 rounded-md shadow-md hover:bg-[#fff1e6] transition duration-200"
              >
                Buy coins
              </Link>
              <button
                onClick={() => signOut(auth)}
                className="text-white hover:text-[#FFE8D1] font-montserrat font-medium underline underline-offset-4 transition duration-200"
              >
                Sign out
              </button>
            </div>
          </div>
        </motion.div>

        {/* Recent Purchases + Image */}
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="bg-[#FFEFC4] rounded-2xl p-6 shadow-md w-full"
          >
            <h3 className="text-lg font-extrabold font-montserrat text-[#1D1D1D] mb-4">
              Recent Purchases
            </h3>

            {purchases.length === 0 ? (
              <p className="text-[#888] italic text-sm">
                Looks empty... Time to get some packs! 🎮
              </p>
            ) : (
              <ul className="space-y-4">
                {purchases.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.2 + index * 0.05,
                      duration: 0.4,
                      ease: "easeOut",
                    }}
                    viewport={{ once: true }}
                    className="flex items-center justify-between gap-4 border-b border-[#E0D9C7] pb-2"
                  >
                    <div className="flex items-center gap-4">
                      <div className="relative w-8 h-10 md:w-20 md:h-20 rounded-md shadow-lg overflow-hidden bg-white">
                        <Image
                          src={item.image}
                          alt={item.game}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <p className="font-bold text-xs md:text-lg font-montserrat text-[#1D1D1D]">
                          {item.game}
                        </p>
                        <p className="text-sm text-[#888]">{item.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="flex text-xs md:text-lg items-center gap-1 text-[#1D1D1D] font-bold font-montserrat">
                        {item.amount.toLocaleString()} 
                        <Image
                          src="/images/coin.png"
                          alt="PlayerDoge Coin"
                          width={25}
                          height={25}
                        />
                      </p>

                    </div>
                  </motion.li>
                ))}
              </ul>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            viewport={{ once: true }}
            className="w-full flex justify-center"
          >
            <Image
              src="/images/dash.png"
              alt="Doge calculating coins"
              width={320}
              height={320}
              priority
            />
          </motion.div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
