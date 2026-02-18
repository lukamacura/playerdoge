"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { gameData } from "@/lib/gameData";

const gameFaqs = [
  {
    question: "Why does Kinged ask for my personal information?",
    answer: `We need your personal information to purchase bundles on your behalf. We understand that this may raise concerns, so we take this matter seriously.\n\nTo remain authorized, we access your account to buy bundles for you while respecting the rules established by Google and the Apple Store.`,
  },
  {
    question: "How can I ensure the security of my account information?",
    answer: `At Kinged, we prioritize the security of your account information. Here's how we maintain the safety of your data:\n\n• Kinged purchases bundles for you from official stores.\n• By complying with the rules, every transaction meets the requirements of Google, Apple, and developers.\n\nRest assured that your Kinged purchases are as secure as if you made them yourself.`,
  },
  {
    question: "What measures do you take to safeguard my transactions?",
    answer: `An extra layer of protection is the implementation of the 2FA code.\n\nYou are in complete control over your account because you receive the code on your phone when logging in. This guarantees no one else can access your account without your permission.`,
  },
  {
    question: "What level of security is provided for the payment methods?",
    answer: `We implement high-security protocols for all payment methods.\n\nFor instance, we utilize the safest gateway for credit card payment methods, just like many other companies do. A gateway serves as a link to your point of sale system or virtual terminal to the next step in the payment authorization process.`,
  },
  {
    question: "Why do I have to pay before the order process begins?",
    answer: `Sending payments in advance can be tough, especially if you're unfamiliar with the other side. We require payment upfront to protect our business from potential scams and ensure efficient service. The mobile gaming world has many scammers, and this practice helps us allocate resources effectively.`,
  },
  {
    question: "Does Kinged violate the game's Terms of Service?",
    answer: `Using Kinged doesn't violate games' Terms of Service (ToS). Our purchasing process mirrors individual transactions, making them fully compliant with every game's ToS.\n\nMoreover, our security measures further guarantee that using Kinged fits within the practical enforcement of ToS, maintaining a safe and enjoyable gaming experience without the risk of any ToS violations.`,
  },
  {
    question: "Why do you promote a 35% discount when I see only 10%?",
    answer: `We understand you might feel you're not saving as much as you'd hoped, and we're here to help.\n\nThe price you see depends on several factors like the in-game price, taxes on digital goods, currency exchange, and other elements. For example, a €119.99 bundle is equivalent to $99.99, so European players save 30% or more, while US players save 10% plus tax. For US and Canadian players, we cover digital taxes, so if a bundle costs $99.99 with an additional 10% tax in your state, you end up paying only $89.99 with Kinged.\n\nWe promote a 10-35% discount because savings vary based on these factors. Additionally, we offer flash deals where you can save even more.`,
  },
];

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
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? -1 : index));
  };

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
        <div className="w-[100px] h-[100px] relative rounded-lg overflow-hidden">
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

        {/* FAQ Section */}
        <div className="mt-20 border-t border-[#1d1d1d]/20 pt-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold font-montserrat text-[#1d1d1d] mb-2">
              Multi-Level Account Protection
            </h2>
            <p className="text-[#4b4b4b] text-base font-inter">
              Everything you need to know about keeping your account safe with Kinged.
            </p>
          </motion.div>

          <div className="space-y-3 max-w-3xl">
            {gameFaqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className={`border-l-4 ${isOpen ? "border-[#FF7D29]" : "border-[#1d1d1d]/20"} bg-white/60 rounded-r-xl transition-all`}
                >
                  <button
                    className="w-full flex justify-between items-center px-5 py-4 text-left font-bold font-montserrat text-[#1d1d1d] hover:text-[#FF7D29] transition"
                    onClick={() => toggleFaq(i)}
                  >
                    <span>{faq.question}</span>
                    <span className={`text-xl font-light ml-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden px-5 pb-4 text-[#4b4b4b]"
                      >
                        <p className="text-sm font-inter whitespace-pre-line leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </main>
  );
}
