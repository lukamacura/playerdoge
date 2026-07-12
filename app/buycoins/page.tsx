"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import { CheckCircle2, Loader2 } from "lucide-react";
import { CoinCard } from "@/components/CoinCard";
import { useAuth } from "@/context/AuthContext";

type Currency =
  | "USD"
  | "EUR"
  | "CAD"
  | "AUD"
  | "GBP"
  | "CHF"
  | "DKK"
  | "NOK"
  | "PLN"
  | "SEK";

interface PackEntry {
  amount: number;
  price: string;
  value: string;
  packId?: string;
}

const howToSteps: { title: string; items: ReactNode[] }[] = [
  {
    title: "1. Install Phantom wallet",
    items: [
      <>
        Download Phantom from the{" "}
        <a
          href="https://apps.apple.com/us/app/phantom-trade-markets/id1598432977"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold hover:text-[#FF7D29]"
        >
          App Store
        </a>{" "}
        or{" "}
        <a
          href="https://play.google.com/store/apps/details?id=app.phantom"
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-semibold hover:text-[#FF7D29]"
        >
          Google Play
        </a>
        .
      </>,
      "Open the app and tap “Create New Wallet”, or continue with Google or Apple.",
    ],
  },
  {
    title: "2. Buy USDC in Phantom (Solana Network)",
    items: [
      'In Phantom, tap the "+" button in the lower-right corner and select "Buy".',
      'Under "Get started", choose the recommended USDC token next to SOL.',
      "Enter the amount you want to purchase.",
      "Complete the payment using PayPal, Google Pay, or a debit/credit card.",
    ],
  },
  {
    title: "3. Fees",
    items: [
      "Payments made through Phantom use the Solana network. Transaction fees are paid in SOL and are typically close to zero.",
      "After buying USDC, you should also purchase and keep about $1 worth of SOL in your wallet to cover any transaction fees.",
    ],
  },
  {
    title: "4. Pay on Kinged",
    items: [
      "Return to the Kinged.gg website.",
      "Select the amount of Kinged coins you want to buy.",
      'Click "Buy".',
      "You will be redirected to the checkout page.",
      "Follow the on-screen instructions to complete your payment using your Phantom wallet.",
    ],
  },
];

export default function BuyCoinsPage() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const { user, userData } = useAuth();
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [cryptoError, setCryptoError] = useState<string | null>(null);

  const [codeInput, setCodeInput] = useState("");
  const [codeStatus, setCodeStatus] = useState<"idle" | "loading" | "error">("idle");
  const [codeError, setCodeError] = useState("");
  const appliedCode = userData?.creatorCode ?? null;

  const priceData: Record<Currency, PackEntry[]> = {
    USD: [
      { amount: 500, price: "4.99 USD", value: "4.49 USD", packId: "usd-500" },
      { amount: 1000, price: "9.99 USD", value: "8.99 USD", packId: "usd-1000" },
      { amount: 2000, price: "19.99 USD", value: "17.99 USD", packId: "usd-2000" },
      { amount: 5000, price: "49.99 USD", value: "44.99 USD", packId: "usd-5000" },
      { amount: 10000, price: "99.99 USD", value: "89.99 USD", packId: "usd-10000" },
      { amount: 20000, price: "199.99 USD", value: "179.99 USD", packId: "usd-20000" },
    ],
    EUR: [
      { amount: 500, price: "5.99 EUR", value: "3.99 EUR", packId: "usd-500" },
      { amount: 1000, price: "11.99 EUR", value: "7.99 EUR", packId: "usd-1000" },
      { amount: 2000, price: "23.99 EUR", value: "15.99 EUR", packId: "usd-2000" },
      { amount: 5000, price: "59.99 EUR", value: "40.49 EUR", packId: "usd-5000" },
      { amount: 10000, price: "119.99 EUR", value: "80.99 EUR", packId: "usd-10000" },
      { amount: 20000, price: "239.99 EUR", value: "161.99 EUR", packId: "usd-20000" },
    ],
    CAD: [
      { amount: 500, price: "6.99 CAD", value: "5.99 CAD", packId: "usd-500" },
      { amount: 1000, price: "13.99 CAD", value: "11.99 CAD", packId: "usd-1000" },
      { amount: 2000, price: "27.99 CAD", value: "23.99 CAD", packId: "usd-2000" },
      { amount: 5000, price: "69.99 CAD", value: "60.49 CAD", packId: "usd-5000" },
      { amount: 10000, price: "139.99 CAD", value: "121.49 CAD", packId: "usd-10000" },
      { amount: 20000, price: "279.99 CAD", value: "242.99 CAD", packId: "usd-20000" },
    ],
    AUD: [
      { amount: 500, price: "7.99 AUD", value: "6.74 AUD", packId: "usd-500" },
      { amount: 1000, price: "15.99 AUD", value: "13.49 AUD", packId: "usd-1000" },
      { amount: 2000, price: "31.99 AUD", value: "26.99 AUD", packId: "usd-2000" },
      { amount: 5000, price: "79.99 AUD", value: "67.49 AUD", packId: "usd-5000" },
      { amount: 10000, price: "159.99 AUD", value: "134.99 AUD", packId: "usd-10000" },
      { amount: 20000, price: "319.99 AUD", value: "269.99 AUD", packId: "usd-20000" },
    ],
    GBP: [
      { amount: 500, price: "4.99 GBP", value: "3.44 GBP", packId: "usd-500" },
      { amount: 1000, price: "9.99 GBP", value: "6.89 GBP", packId: "usd-1000" },
      { amount: 2000, price: "19.99 GBP", value: "13.79 GBP", packId: "usd-2000" },
      { amount: 5000, price: "49.99 GBP", value: "34.49 GBP", packId: "usd-5000" },
      { amount: 10000, price: "99.99 GBP", value: "68.99 GBP", packId: "usd-10000" },
      { amount: 20000, price: "199.99 GBP", value: "137.99 GBP", packId: "usd-20000" },
    ],
    CHF: [
      { amount: 500, price: "4.49 CHF", value: "3.79 CHF", packId: "usd-500" },
      { amount: 1000, price: "8.99 CHF", value: "7.69 CHF", packId: "usd-1000" },
      { amount: 2000, price: "17.99 CHF", value: "15.29 CHF", packId: "usd-2000" },
      { amount: 5000, price: "44.99 CHF", value: "37.99 CHF", packId: "usd-5000" },
      { amount: 10000, price: "89.99 CHF", value: "76.49 CHF", packId: "usd-10000" },
      { amount: 20000, price: "179.99 CHF", value: "152.99 CHF", packId: "usd-20000" },
    ],
    DKK: [
      { amount: 500, price: "44.99 DKK", value: "30.14 DKK", packId: "usd-500" },
      { amount: 1000, price: "89.99 DKK", value: "60.29 DKK", packId: "usd-1000" },
      { amount: 2000, price: "179.99 DKK", value: "120.59 DKK", packId: "usd-2000" },
      { amount: 5000, price: "449.99 DKK", value: "301.49 DKK", packId: "usd-5000" },
      { amount: 10000, price: "899.99 DKK", value: "602.99 DKK", packId: "usd-10000" },
      { amount: 20000, price: "1799.99 DKK", value: "1205.99 DKK", packId: "usd-20000" },
    ],
    NOK: [
      { amount: 500, price: "64.99 NOK", value: "44.84 NOK", packId: "usd-500" },
      { amount: 1000, price: "129.99 NOK", value: "89.69 NOK", packId: "usd-1000" },
      { amount: 2000, price: "259.99 NOK", value: "179.39 NOK", packId: "usd-2000" },
      { amount: 5000, price: "649.99 NOK", value: "448.49 NOK", packId: "usd-5000" },
      { amount: 10000, price: "1299.99 NOK", value: "896.99 NOK", packId: "usd-10000" },
      { amount: 20000, price: "2599.99 NOK", value: "1793.99 NOK", packId: "usd-20000" },
    ],
    PLN: [
      { amount: 500, price: "24.99 PLN", value: "17.24 PLN", packId: "usd-500" },
      { amount: 1000, price: "49.99 PLN", value: "34.49 PLN", packId: "usd-1000" },
      { amount: 2000, price: "99.99 PLN", value: "68.99 PLN", packId: "usd-2000" },
      { amount: 5000, price: "249.99 PLN", value: "172.49 PLN", packId: "usd-5000" },
      { amount: 10000, price: "499.99 PLN", value: "344.99 PLN", packId: "usd-10000" },
      { amount: 20000, price: "999.99 PLN", value: "689.99 PLN", packId: "usd-20000" },
    ],
    SEK: [
      { amount: 500, price: "64.99 SEK", value: "43.54 SEK", packId: "usd-500" },
      { amount: 1000, price: "129.99 SEK", value: "87.09 SEK", packId: "usd-1000" },
      { amount: 2000, price: "259.99 SEK", value: "174.19 SEK", packId: "usd-2000" },
      { amount: 5000, price: "649.99 SEK", value: "435.49 SEK", packId: "usd-5000" },
      { amount: 10000, price: "1299.99 SEK", value: "870.99 SEK", packId: "usd-10000" },
      { amount: 20000, price: "2599.99 SEK", value: "1741.99 SEK", packId: "usd-20000" },
    ],
  };

  const flagMap: Record<string, string> = {
    USD: "usa",
    EUR: "eu",
    CAD: "canada",
    AUD: "australia",
    GBP: "uk",
    CHF: "switzerland",
    DKK: "denmark",
    NOK: "norway",
    PLN: "poland",
    SEK: "sweden",
  };

  const discountMap: Record<Currency, string> = {
    USD: "-10%",
    EUR: "-33%",
    CAD: "-13%",
    AUD: "-16%",
    GBP: "-31%",
    CHF: "-15%",
    DKK: "-33%",
    NOK: "-31%",
    PLN: "-31%",
    SEK: "-33%",
  };

  const coins = priceData[currency];

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

  const startPayment = async (packId?: string) => {
    if (!user || !packId || cryptoLoading) return;
    setCryptoError(null);
    setCryptoLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ packId }),
      });
      const data = await res.json();
      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error || "Failed to create payment");
      }
      window.location.href = data.redirectUrl;
    } catch (e) {
      const message = e instanceof Error ? e.message : "Something went wrong";
      setCryptoError(message);
      setCryptoLoading(false);
    }
  };

  return (
    <>
      <main className="min-h-screen bg-[#FEFFD2] font-inter pt-24 pb-16 px-4 md:px-8 xl:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold font-montserrat text-[#1D1D1D] mb-8"
            >
              Buy coins
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="mb-4"
            >
              <Listbox value={currency} onChange={setCurrency}>
                {() => (
                  <div className="relative mt-1">
                    <Listbox.Button className="relative w-full md:w-auto cursor-pointer rounded-lg border border-black bg-transparent py-2 pl-3 pr-10 text-left text-sm">
                      <span className="flex items-center gap-2">
                        <Image
                          src={`/images/${flagMap[currency]}.png`}
                          alt={currency}
                          width={20}
                          height={14}
                        />
                        {currency}
                      </span>
                    </Listbox.Button>
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full md:w-auto overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      {(["USD", "EUR", "CAD", "AUD", "GBP", "CHF", "DKK", "NOK", "PLN", "SEK"] as Currency[]).map((curr) => (
                        <Listbox.Option
                          key={curr}
                          value={curr}
                          className={({ active }) =>
                            clsx(
                              "cursor-pointer select-none relative py-2 pl-3 pr-9",
                              active ? "bg-[#FFEFC4]" : ""
                            )
                          }
                        >
                          <div className="flex items-center gap-2">
                            <Image
                              src={`/images/${flagMap[curr]}.png`}
                              alt={curr}
                              width={20}
                              height={14}
                            />
                            {curr}
                            <span className="ml-auto rounded-full bg-[#FF7D29] px-2 py-0.5 text-xs font-bold text-white">
                              {discountMap[curr]}
                            </span>
                          </div>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                )}
              </Listbox>
            </motion.div>

            {user && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true }}
                className="mb-6"
              >
                {appliedCode ? (
                  <div className="flex items-center gap-2 bg-[#FFEFC4] rounded-lg px-4 py-2.5 w-fit">
                    <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                    <span className="text-sm text-[#1D1D1D]">
                      Referred by{" "}
                      <span className="font-bold">{appliedCode}</span>
                    </span>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-[#1D1D1D] mb-1.5">
                      Have a creator code? Support your favorite creator.
                    </p>
                    <div className="flex gap-2 max-w-sm">
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
                        className="flex-1 bg-white border border-black/20 rounded-lg px-3 py-2 text-sm text-[#1D1D1D] placeholder:text-gray-400 focus:outline-none focus:border-[#FF7D29] transition"
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
                      <p className="text-xs text-red-600 mt-1.5 ml-1">{codeError}</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {cryptoError && (
              <p className="mb-4 text-sm font-semibold text-red-600">{cryptoError}</p>
            )}

            <div className="space-y-4">
              {coins.map((coin, i) => (
                <motion.div
                  key={coin.amount}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.2 + i * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                  viewport={{ once: true }}
                >
                  <CoinCard
                    amount={coin.amount}
                    price={coin.price}
                    value={coin.value}
                    discount={discountMap[currency]}
                    index={i}
                    onBuy={() => startPayment(coin.packId)}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <motion.h2
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-xl md:text-2xl font-extrabold font-montserrat text-[#1D1D1D]"
            >
              How to pay on Kinged with Near-Zero fees
            </motion.h2>

            {howToSteps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.15, duration: 0.5, ease: "easeOut" }}
                viewport={{ once: true }}
                className="bg-[#FFEFC4] rounded-xl p-5"
              >
                <h3 className="text-[#FF7D29] font-bold font-montserrat text-lg mb-2">
                  {step.title}
                </h3>
                <ul className="space-y-1.5 text-sm text-[#1D1D1D]">
                  {step.items.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-[#FF7D29] mt-0.5 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: howToSteps.length * 0.15, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-sm text-[#1D1D1D]"
            >
              If you have any questions or run into any issues, the Kinged support team is always available through live chat and ready to assist you.
            </motion.p>
          </div>
        </div>
      </main>

      {cryptoLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-[#1d1d1d] px-8 py-6 text-white">
            <Loader2 size={36} className="animate-spin text-[#FF7D29]" />
            <p className="text-sm font-semibold">Redirecting to checkout…</p>
          </div>
        </div>
      )}
    </>
  );
}
