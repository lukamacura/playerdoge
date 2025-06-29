"use client";
import { useParams, useRouter, notFound } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { gameData } from "@/lib/gameData";
import { useAuth } from "@/context/AuthContext";

type Country = "us" | "canada" | "europe" | "australia";

export default function GameDetailPage() {
  const { user, userData } = useAuth();
  const router = useRouter();

  const universalPacks = [
    { label: "Any pack", coins: 500 },
    { label: "Any pack", coins: 1000 },
    { label: "Any pack", coins: 2000 },
    { label: "Any pack", coins: 5000 },
    { label: "Any pack", coins: 10000 },
  ];

  const countryPrices: Record<Country, number[]> = {
    us: [4.99, 9.99, 19.99, 49.99, 99.99],
    canada: [6.99, 13.99, 26.99, 69.99, 139.99],
    europe: [5.99, 11.99, 22.99, 59.99, 119.99],
    australia: [7.99, 16.99, 33.99, 79.99, 159.99],
  };

  const currencyPrefixes: Record<Country, string> = {
    us: "USD",
    canada: "CAD",
    europe: "EUR",
    australia: "AUD",
  };

  const [selectedCountry, setSelectedCountry] = useState<Country>("us");

  const slug = (useParams()?.slug ?? "") as string;
  const game = gameData.find((g) => g.slug === slug);
  if (!game) return notFound();

  const currentPrices = countryPrices[selectedCountry];


  const handleBuyClick = (index: number) => {
    const neededCoins = universalPacks[index].coins;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!userData || userData.coins < neededCoins) {
      router.push("/buycoins");
      return;
    }

  };

  return (
    <main className="bg-[#FFFDD0] min-h-screen pt-32 px-4 md:px-8 xl:px-16 font-inter">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10">
        {/* LEFT */}
        <div>
          <h1 className="text-3xl md:text-5xl font-montserrat text-[#1d1d1d] leading-tight mb-6">
            Buy{" "}
            <span
              className="
                font-extrabold
                bg-gradient-to-r
                from-[#FF7D29]
                to-[#582503]
                bg-clip-text
                text-transparent
              "
            >
              {game.name}{" "}
            </span>
            packs safely and affordably with PlayerDoge
          </h1>

          <div className="mb-4">
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value as Country)}
              className="w-full bg-transparent md:w-auto border border-black rounded-lg px-8 py-2 text-sm"
            >
              <option value="us">United States</option>
              <option value="canada">Canada</option>
              <option value="europe">Europe</option>
              <option value="australia">Australia</option>
            </select>
          </div>

          <div className="mb-8">
            <p className="text-xs mb-4 font-montserrat">
              Check the prices of{" "}
              <span className="font-bold">PlayerDoge coins</span>.
            </p>
            <Link
              href="/buycoins"
              className="border font-bold font-montserrat border-black px-6 py-2 rounded-lg hover:bg-black hover:text-white transition"
            >
              Buy coins
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {universalPacks.map((pack, i) => (
              <div
                key={i}
                className="bg-[#FFEFC4] p-3 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-lg transition"
              >
                <div className="w-[100px] h-[70px] relative rounded-md overflow-hidden shrink-0">
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-mds font-normal font-montserrat text-[#1d1d1d]">
                    Any{" "}
                    <strong className="font-extrabold text-[#1D1D1D] tracking-wide">
                      {currentPrices[i].toFixed(2)}{" "}
                      {currencyPrefixes[selectedCountry]}
                    </strong>{" "}
                    pack
                  </p>
                  <button
                    onClick={() => handleBuyClick(i)}
                    className="mt-2 bg-[#FF7D29] hover:bg-[#e96e1b] text-white text-sm font-montserrat font-bold px-6 py-2 rounded-md shadow flex items-center justify-center gap-2"
                  >
                    Buy for {pack.coins}
                    <Image
                      src="/images/coin.png"
                      alt="PlayerDoge Coin"
                      width={25}
                      height={25}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-md text-[#1d1d1d] mt-10 max-w-xl leading-relaxed">
            Looking to enhance your{" "}
            <strong className="font-extrabold text-[#1D1D1D] tracking-wide">
              {game.name}
            </strong>{" "}
            experience without overpaying? PlayerDoge offers a seamless,
            secure, and cost-effective solution for purchasing in-game packs.
            As a registered LLC, we prioritize your account’s safety and provide
            a transparent TopUp process.
          </p>
        </div>

        {/* RIGHT */}
        {/* ... Ostatak tvoje forme ostaje isti ... */}
      </div>
    </main>
  );
}
