"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const images = [
  "/images/home_main1.png",
  "/images/home_main2.png",
  "/images/home_main3.png",
];

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative isolate bg-[#FEFFD2] text-[#1D1D1D] overflow-hidden md:min-h-[80vh] min-h-[100vh] flex items-end">
      {/* Rotating Background Images */}
      <div className="absolute inset-0 z-0 w-full h-full">
        {images.map((img, index) => (
          <Image
            key={index}
            src={img}
            alt={`Background ${index}`}
            fill
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              index === activeIndex ? "opacity-100" : "opacity-0"
            }`}
            priority={index === 0}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#FEFFD2]" />
      </div>

      {/* Content aligned to bottom */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pb-20">
        <div className="max-w-4xl text-center lg:text-left">
          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-extrabold font-montserrat leading-tight tracking-tight text-[#1d1d1d] drop-shadow-lg max-w-3xl mx-auto lg:mx-0"
          >
            Welcome to <span className="text-[#FF7D29]">PlayerDoge</span>
          </motion.h1>

          {/* Paragraph */}
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mt-6 text-lg md:text-2xl text-[#1D1D1D]/90 font-medium font-inter drop-shadow-md max-w-2xl mx-auto lg:mx-0"
          >
            Every upgrade counts — buy game packs cheaper with PlayerDoge, your
            trusted top-up service for secure purchases, no ban risk, and real
            savings.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4"
          >
            <Link
              href="/games"
              className="px-8 py-4 bg-[#FF7D29] hover:bg-[#e96e1b] text-white font-bold font-montserrat rounded-xl shadow-lg text-lg transition-all"
            >
              Browse games
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 bg-black text-white hover:bg-neutral-800 font-bold font-montserrat rounded-xl shadow-lg text-lg transition-all"
            >
              Login
            </Link>
          </motion.div>
        </div>

        {/* Carousel indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 flex justify-center lg:justify-start"
        >
          <div className="flex gap-2">
            {images.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index
                    ? "bg-[#FF7D29]"
                    : "bg-[#FF7D29]/30"
                }`}
              ></div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
