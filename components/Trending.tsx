"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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
  "last-z-survival-shooter",
];

export default function Trending() {
  const trendingGames = gameData.filter((g) => trendingSlugs.includes(g.slug));

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-extrabold font-montserrat text-center text-[#FF7D29] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] mb-8"
      >
        Trending
      </motion.h2>

      {/* Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {trendingGames.map((game, index) => (
          <motion.div
            key={game.slug}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.2 + index * 0.1,
              duration: 0.5,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
          >
            <Link href={`/games/${game.slug}`}>
              <div className="relative rounded-xl overflow-hidden shadow hover:scale-105 transition-transform duration-300 cursor-pointer">
                <Image
                  src={game.image}
                  alt={game.name}
                  width={300}
                  height={180}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 font-semibold font-inter text-white text-sm text-center py-2">
                  {game.name}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + trendingGames.length * 0.1, duration: 0.6 }}
        viewport={{ once: true }}
        className="flex justify-center mt-10"
      >
        <Link href="/games">
          <button className="border font-bold font-montserrat border-black px-6 py-2 rounded hover:bg-black hover:text-white transition">
            View more
          </button>
        </Link>
      </motion.div>
    </section>
  );
}
