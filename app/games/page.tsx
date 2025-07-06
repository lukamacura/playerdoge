"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { gameData } from "@/lib/gameData";

const categories = [
  "All",
  "Strategy & War",
  "Naval & Adventure",
  "Survival & Zombie",
  "Fantasy / RPG",
  "Shooter / Military",
];

const sortOptions = ["A-Z", "Z-A"];

export default function GamesPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOrder, setSortOrder] = useState("A-Z");

  const filtered = gameData
    .filter(
      (game) =>
        game.name.toLowerCase().includes(search.toLowerCase()) &&
        (selectedCategory === "All" || game.category === selectedCategory)
    )
    .sort((a, b) => {
      if (sortOrder === "A-Z") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  return (
    <main className="bg-[#FEFFD2] mt-16 min-h-screen py-10 px-4 md:px-8 xl:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold font-montserrat text-[#1D1D1D] mb-2">
            Games you love. Deals you deserve.
          </h1>
          <p className="text-[#4b4b4b] text-base font-inter md:text-lg">
            Get the best top-up offers and save more every time.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row gap-4 justify-center items-center mb-10"
        >
          <input
            type="text"
            placeholder="Search Games"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[250px] bg-transparent placeholder-[#4d4d4d] font-montserrat rounded-lg border border-black px-4 py-2 text-sm"
          />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full md:w-[150px] bg-transparent font-montserrat border text-[#4d4d4d] border-black px-4 py-2 rounded-lg text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full md:w-[150px] bg-transparent font-montserrat border text-[#4d4d4d] border-black px-4 py-2 rounded-lg text-sm"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </motion.div>

        {/* Game Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
         {filtered.map((game, i) => (
  <motion.div
    key={game.slug}
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      duration: 0.4,
      ease: "easeOut",
      delay: i * 0.05,
    }}
  >
    <Link href={`/games/${game.slug}`}>
      <div className="bg-transparent border border-[#1d1d1d] p-3 rounded-xl flex gap-4 items-center shadow-lg hover:shadow-2xl transition cursor-pointer">
        <div className="w-[120px] h-[80px] relative rounded-lg overflow-hidden">
          <Image
            src={game.image}
            alt={game.name}
            fill
            className="object-cover rounded"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-md md:text-xl font-montserrat text-[#1d1d1d]">
            {game.name}
          </h3>
          <p className="text-sm mt-1 bg-[#FFEFC4] w-fit px-2 py-1 rounded font-inter font-medium">
            {game.category}
          </p>
        </div>
      </div>
    </Link>
  </motion.div>
))}

        </div>
      </div>
    </main>
  );
}
