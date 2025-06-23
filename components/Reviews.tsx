'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";

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
    }, 4000); // menja se na 4s

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-[#FFFDD0] py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold font-montserrat text-[#1d1d1d] mb-12">
          Trusted by gamers worldwide.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {imageGroups[currentGroupIndex].map((src, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <Image
                src={src}
                alt={`Review ${i + 1}`}
                width={800}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
