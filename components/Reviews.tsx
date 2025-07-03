"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const imageGroups = [
  ["/images/reviews/review1.png", "/images/reviews/review2.png", "/images/reviews/review3.png"],
  ["/images/reviews/review4.png", "/images/reviews/review5.png", "/images/reviews/review6.png"],
  ["/images/reviews/review7.png", "/images/reviews/review8.png", "/images/reviews/review9.png"],
  // Dodaj dalje ako imaš više slika...
];

const Reviews = () => {
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentGroupIndex((prevIndex) => (prevIndex + 1) % imageGroups.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#FFFDD0] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center text-3xl md:text-4xl font-extrabold font-montserrat text-[#1d1d1d] mb-12"
        >
          Trusted by gamers worldwide.
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence initial={false}>
            {imageGroups[currentGroupIndex].map((src, i) => (
              <motion.div
                key={src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="rounded-2xl overflow-hidden"
              >
                <Image
                  src={src}
                  alt={`Review ${i + 1}`}
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover hover:scale-105 transition-transform duration-300"
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Reviews;
