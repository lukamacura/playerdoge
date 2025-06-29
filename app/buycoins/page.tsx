"use client";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import { useState } from "react";
import { CoinCard } from "@/components/CoinCard";
import Image from "next/image";

export default function BuyCoinsPage() {
  const [currency, setCurrency] = useState<"USD" | "EUR">("USD");

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

  };

  const coins = priceData[currency];

  return (
    <main className="min-h-screen bg-[#FEFFD2] font-inter pt-24 pb-16 px-4 md:px-8 xl:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        {/* Left */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold font-montserrat text-[#1D1D1D] mb-8">
            Buy coins
          </h1>

          <div className="mb-4">
           <Listbox value={currency} onChange={setCurrency}>
  {({  }) => (
    <div className="relative mt-1">
      <Listbox.Button className="relative w-full md:w-auto cursor-pointer rounded-lg border border-black bg-transparent py-2 pl-3 pr-10 text-left text-sm">
        <span className="flex items-center gap-2">
          <Image
            src={`/images/${currency === "USD" ? "usa" : "eu"}.png`}
            alt={currency}
            width={20}
            height={14}
          />
          {currency}
        </span>
      </Listbox.Button>

      <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full md:w-auto overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        {["USD", "EUR"].map((curr) => (
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
                src={`/images/${curr === "USD" ? "usa" : "eu"}.png`}
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

          </div>

          <div className="space-y-4">
            {coins.map((coin, i) => (
              <CoinCard
                key={coin.amount}
                amount={coin.amount}
                price={coin.price}
                value={coin.value}
                index={i}
              />
            ))}
          </div>

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
        </div>

        {/* Right */}
        <div className="flex flex-col items-center md:items-start gap-8">
          <Image
            src="/images/buycoins.png"
            alt="Treasure chest with coins"
            width={500}
            height={500}
            className="w-full h-auto max-w-xs md:max-w-md"
            priority
          />
          <p className="text-lg md:text-2xl font-bold text-[#1D1D1D] text-center md:text-left max-w-lg">
            Coins can be purchased in USD or EUR. All major payment methods
            offer automatic currency conversion, so you can pay easily in your
            local currency.
          </p>
        </div>
      </div>
    </main>
  );
}
