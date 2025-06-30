"use client";

import Image from "next/image";
import Link from "next/link";
import AnimateSection from "@/components/AnimateSection";
import { gameData } from "@/lib/gameData";

const trendingSlugs = [
  "frost-and-flame-king-of-avalon",
  "guns-of-glory-lost-island",
  "sea-of-conquest-pirate-war",
  "last-war-survival-game",
  "state-of-survival-zombie-war",
  "misty-continent-cursed-island",
  "whiteout-survival",
  "kingshot",
  "diablo-immortal",
  "last-z-survival-shooter"
];

export default function Trending() {
  const trendingGames = gameData.filter(g => trendingSlugs.includes(g.slug));

  return (
    <AnimateSection>
<section className="py-12 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat text-center text-[#FF7D29] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] mb-8">
        Trending
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {trendingGames.map((game) => (
          <Link href={`/games/${game.slug}`} key={game.slug}>
            <div
              className="relative rounded-xl overflow-hidden shadow hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <Image
                src={game.image}
                alt={game.name}
                width={300}
                height={180}
                className="w-full h-auto object-cover"
              />
              {/* Ako želiš badge, dodaš ovde logiku */}
              <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 font-semibold font-inter text-white text-sm text-center py-2">
                {game.name}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <Link href="/games">
          <button className="border font-bold font-montserrat border-black px-6 py-2 rounded hover:bg-black hover:text-white transition">
            View more
          </button>
        </Link>
      </div>
    </section>
    </AnimateSection>
    
  );
}
