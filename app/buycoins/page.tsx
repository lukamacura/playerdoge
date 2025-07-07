"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import { CoinCard } from "@/components/CoinCard";
import PaymentPopup from "@/components/PaymentPopup";
import { useTidio } from "@/lib/useTidio";

export default function BuyCoinsPage() {
  const [currency, setCurrency] =
    useState<"USD" | "EUR" | "CAD" | "AUD">("USD");
  const { openChatWithMessage } = useTidio();
  const [showPaymentPopup, setShowPaymentPopup] = useState(false);
  const [pendingMessage, setPendingMessage] = useState("");

  const priceData = {
    USD: [
      { amount: 2000, price: "19.99 USD", value: "17.99 USD" },
      { amount: 5000, price: "49.99 USD", value: "43.99 USD" },
      { amount: 10000, price: "99.99 USD", value: "87.99 USD" },
      { amount: 100000, price: "999.99 USD", value: "879.99 USD" },
    ],
    EUR: [
      { amount: 2000, price: "22.99 EUR", value: "17.99 EUR" },
      { amount: 5000, price: "59.99 EUR", value: "43.99 EUR" },
      { amount: 10000, price: "119.99 EUR", value: "87.99 EUR" },
      { amount: 100000, price: "1199.99 EUR", value: "879.99 EUR" },
    ],
    CAD: [
      { amount: 2000, price: "26.99 CAD", value: "24.99 CAD" },
      { amount: 5000, price: "69.99 CAD", value: "60.99 CAD" },
      { amount: 10000, price: "139.99 CAD", value: "120.99 CAD" },
      { amount: 100000, price: "1399.99 CAD", value: "1209.99 CAD" },
    ],
    AUD: [
      { amount: 2000, price: "33.99 AUD", value: "27.99 AUD" },
      { amount: 5000, price: "79.99 AUD", value: "67.99 AUD" },
      { amount: 10000, price: "159.99 AUD", value: "135.99 AUD" },
      { amount: 100000, price: "1599.99 AUD", value: "1354.99 AUD" },
    ],
  };

  const flagMap: Record<string, string> = {
    USD: "usa",
    EUR: "eu",
    CAD: "canada",
    AUD: "australia",
  };

  const coins = priceData[currency];

  return (
    <>
      <main className="min-h-screen bg-[#FEFFD2] font-inter pt-24 pb-16 px-4 md:px-8 xl:px-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
          {/* Left */}
          <div className="flex flex-col justify-center">
            {/* Heading */}
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              viewport={{ once: true }}
              className="text-3xl md:text-5xl font-extrabold font-montserrat text-[#1D1D1D] mb-8"
            >
              Buy coins
            </motion.h1>

            {/* Currency Select */}
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
                      {["USD", "EUR", "CAD", "AUD"].map((curr) => (
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
                          </div>
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </div>
                )}
              </Listbox>
            </motion.div>

            {/* Coin Cards */}
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
                    index={i}
                    onBuy={() => {
                      const message =
                        `Coin purchase request:\n\n` +
                        `Amount: ${coin.amount.toLocaleString()} coins\n` +
                        `Price: ${coin.value}`;
                      setPendingMessage(message);
                      setShowPaymentPopup(true);
                    }}
                  />
                </motion.div>
              ))}
            </div>

            {/* Payment Methods */}
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
                  "master",
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

          {/* Right */}
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
              Coins can be purchased in USD, EUR, CAD or AUD. All major payment
              methods offer automatic currency conversion, so you can pay easily
              in your local currency.
            </p>
          </motion.div>
        </div>
      </main>

      <PaymentPopup
        show={showPaymentPopup}
        onClose={() => setShowPaymentPopup(false)}
        onSelect={(method) => {
          openChatWithMessage(pendingMessage + `\nPayment Method: ${method}`);
          setShowPaymentPopup(false);
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }}
      />
    </>
  );
}
