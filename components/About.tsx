"use client";

import Image from "next/image";

export default function About() {
  return (
    <section id="about" className="py-2 px-4 ">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Tekstualni deo */}
        <div className="flex-1">
          <h2 className="text-[#FF7D29] text-2xl md:text-3xl font-bold font-montserrat mb-4">
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
        </div>

        {/* Slika */}
        <div className="flex-1 flex justify-center md:justify-end">
          <Image
            src="/images/about.png"
            alt="PlayerDoge Mascot"
            width={300}
            height={300}
            className="w-[220px] md:w-[300px] h-auto"
          />
        </div>
      </div>
    </section>
  );
}
