"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="py-2 px-4">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Tekstualni deo */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex-1"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat text-[#FF7D29] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] mb-4">
            About Us
          </h2>
          <p className="text-gray-800 text-lg leading-relaxed font-inter max-w-xl">
            <strong>PlayerDoge</strong> is a trusted and professional top-up service for mobile games, helping
            players save money on discounted <strong>in-game purchases</strong> — from Android and iOS
            game bundles to app store promo packs and limited-time offers. Every
            transaction is made securely through the game’s official store, offering
            you a smarter way to buy game packs cheaper while supporting your
            favorite titles.
          </p>
        </motion.div>

        {/* Slika */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 40 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex-1 flex justify-center md:justify-end"
        >
          <Image
            src="/images/about.png"
            alt="PlayerDoge Mascot"
            width={300}
            height={300}
            className="w-[220px] md:w-[300px] h-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
