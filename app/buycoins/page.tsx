"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import { CoinCard } from "@/components/CoinCard";
import PaymentPopup from "@/components/PaymentPopup";
import { useTidio } from "@/lib/useTidio";
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

export default function BuyCoinsPage() {
  const [currency, setCurrency] = useState<Currency>("USD");
  const { openChatWithMessage } = useTidio();
  const { user } = useAuth();
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");
  const [pendingPackId, setPendingPackId] = useState<string | null>(null);
  const [cryptoLoading, setCryptoLoading] = useState(false);
  const [cryptoError, setCryptoError] = useState<string | null>(null);

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

  function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  const coins = priceData[currency];
  const cryptoDisabled = false;

  const handleCryptoSelect = async () => {
    if (!user || !pendingPackId) return;
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
        body: JSON.stringify({ packId: pendingPackId }),
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
                    onBuy={() => {
                      const message =
                        `Coin purchase request:\n\n` +
                        `Amount: ${coin.amount.toLocaleString()} coins\n` +
                        `Price: ${coin.value}`;
                      setPendingMessage(message);
                      setPendingPackId(coin.packId ?? null);
                      setCryptoError(null);
                      setShowPaymentPopup(true);
                    }}
                  />
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
            >
              <h2 className="mt-10 mb-4 text-xl font-extrabold font-montserrat text-[#1D1D1D]">
                Secure payment
              </h2>
              <div className="bg-[#FFEFC4] rounded-lg p-4 grid grid-cols-4 gap-4 place-items-center">
                {[
                  "paypal",
                  "wise",
                  "paysend",
                  "remitly",
                  "zelle",
                  "visa",
                  "mastercard",
                  "moneygram",
                ].map((method) => (
                  <Image
                    key={method}
                    src={`/images/payments/${method}.png`}
                    alt={method}
                    width={100}
                    height={40}
                    className="h-10 md:h-14 w-auto object-contain"
                  />
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="flex flex-col items-center md:items-start gap-8"
          >
            <Image
              src="/images/buycoins.png"
              alt="Treasure chest with coins"
              width={500}
              height={500}
              className="w-full h-auto max-w-xs md:max-w-md"
              priority
            />
            <p className="text-lg md:text-2xl font-bold text-[#1D1D1D] text-center md:text-left max-w-lg">
              Our service is available worldwide. To maintain a standardized payment process, we currently accept payments in USD and EUR. However, most major payment methods support automatic currency conversion, allowing you to pay conveniently in your local currency.
            </p>
          </motion.div>
        </div>
      </main>

      <PaymentPopup
        show={showPaymentPopup}
        onClose={() => {
          setShowPaymentPopup(false);
          setCryptoLoading(false);
          setCryptoError(null);
        }}
        onSelect={(method) => {
          openChatWithMessage(pendingMessage + `\nPayment Method: ${capitalize(method)}\n`);
          setShowPaymentPopup(false);
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }}
        onCryptoSelect={pendingPackId ? handleCryptoSelect : undefined}
        cryptoDisabled={cryptoDisabled}
        cryptoDisabledReason={cryptoError ?? undefined}
        cryptoLoading={cryptoLoading}
      />
    </>
  );
}
