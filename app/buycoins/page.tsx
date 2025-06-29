"use client";

import { CoinCard } from "@/components/CoinCard";
import Image from "next/image";

export default function BuyCoinsPage() {
  const coins = [
    { amount: 2000, price: 17.99, value: "$19.99" },
    { amount: 5000, price: 43.99, value: "$49.99" },
    { amount: 10000, price: 87.99, value: "$99.99" },
    { amount: 100000, price: 879.99, value: "$999.99" },
  ];

  return (
    <main className="min-h-screen bg-[#FEFFD2] font-inter pt-24 pb-16 px-4 md:px-8 xl:px-16">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
        {/* Left */}
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl font-extrabold font-montserrat text-[#1D1D1D] mb-8">
            Buy coins
          </h1>

          <div className="space-y-4">
            {coins.map((coin) => (
              <CoinCard
                key={coin.amount}
                amount={coin.amount}
                price={coin.price}
                value={coin.value}
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
            Coins can be purchased in USD or EUR. All major payment methods offer automatic currency conversion, so you can pay easily in your local currency.
          </p>
        </div>
      </div>
    </main>
  );
}
