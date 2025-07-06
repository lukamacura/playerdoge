"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

const slogans = [
  "🎮 Did you know? You can save up to 35% with PlayerDoge!",
  "🕹️ Thousands of gamers already top-up cheaper using PlayerDoge!",
  "⏱️ Most orders are delivered in less than 30 minutes!",
];

export default function Preloader() {
  const [loading, setLoading] = useState(true);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const sloganInterval = setInterval(() => {
      // Fade out
      setFade(false);
      setTimeout(() => {
        // Change text
        setSloganIndex((prev) => (prev + 1) % slogans.length);
        // Fade in
        setFade(true);
      }, 400); // Duration of fade-out
    }, 1000); // Interval between changes

    const fakeLoading = setTimeout(() => {
      setLoading(false);
    }, 3000); // Total preloader duration (adjust if needed)

    return () => {
      clearInterval(sloganInterval);
      clearTimeout(fakeLoading);
    };
  }, []);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 bg-[#FEFFD2] text-[#1d1d1d] z-50 flex flex-col justify-center items-center transition-opacity duration-500">
      <div className="mb-6">
        <Image
          src="/images/preloader.png"
          alt="PlayerDoge logo"
          width={100}
          height={100}
          className="object-contain animate-spin-slow"
        />
      </div>
      <p
        className={`text-xs md:text-lg font-semibold font-montserrat px-6 text-center transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {slogans[sloganIndex]}
      </p>
    </div>
  );
}
