"use client";

import Image from "next/image";

const trendingGames = [
  { name: "King of Avalon", image: "/images/trending/frostandflame.webp" },
  { name: "Guns of Glory", image: "/images/trending/gunsofglory.webp" },
  { name: "Sea of Conquest", image: "/images/trending/seaofconquest.webp" },
  { name: "Last War", image: "/images/trending/lastwar.webp", badge: "x3" },
  { name: "State of Survival", image: "/images/trending/stateofsurvival.webp" },
  { name: "Misty Continent", image: "/images/trending/cursedisland.webp" },
  { name: "Whiteout Survival", image: "/images/trending/whiteout.webp" },
  { name: "Kingshot", image: "/images/trending/kingshot.webp" },
  { name: "Diablo Immortal", image: "/images/trending/diablo.webp" },
  { name: "Last Z", image: "/images/trending/lastz.webp", badge: "-2 x3" },
];

export default function Trending() {
  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat text-center text-[#FF7D29] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] mb-8">
        Trending
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
        {trendingGames.map((game, idx) => (
          <div
            key={idx}
            className="relative rounded-xl overflow-hidden shadow hover:scale-105 transition-transform duration-300 cursor-pointer"
          >
            <Image
              src={game.image}
              alt={game.name}
              width={300}
              height={180}
              className="w-full h-auto object-cover"
            />
            {game.badge && (
              <div className="absolute top-2 right-2 bg-yellow-400 text-xs text-black font-bold px-2 py-0.5 rounded shadow">
                {game.badge}
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 font-semibold font-inter text-white text-sm text-center py-2">
              {game.name}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-10">
        <button className="border font-bold font-montserrat border-black px-6 py-2 rounded hover:bg-black hover:text-white transition">
          View more
        </button>
      </div>
    </section>
  );
}
