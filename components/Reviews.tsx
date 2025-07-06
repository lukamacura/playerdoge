"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const images = [
  "/images/reviews/review1.png",
  "/images/reviews/review2.png",
  "/images/reviews/review3.png",
  "/images/reviews/review4.png",
  "/images/reviews/review5.png",
  "/images/reviews/review6.png",
  "/images/reviews/review7.png",
  "/images/reviews/review8.png",
  "/images/reviews/review9.png",
];

const Reviews = () => {
  const [currentIndices, setCurrentIndices] = useState([0, 1, 2]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndices(([i1, i2, i3]) => [
        (i1 + 3) % images.length,
        (i2 + 3) % images.length,
        (i3 + 3) % images.length,
      ]);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#FFFDD0] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center text-3xl md:text-4xl font-extrabold font-montserrat text-[#1d1d1d] mb-12"
        >
          Trusted by gamers worldwide.
        </motion.h2>

        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {currentIndices.map((index) => (
            <div
              key={index}
              className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={images[index]}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="w-full h-full"
                >
                  <Image
                    src={images[index]}
                    alt="Review"
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
