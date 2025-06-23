'use client';

import Image from 'next/image';
import React from 'react';

export default function Contact() {
  return (
    <section className="max-w-6xl mx-auto bg-[#FFFDD0] text-[#1e1e1e] px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10">
      <div className="max-w-xl w-full">
        <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat text-[#FF7D29] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">Contact us</h2>
        <p className="text-base md:text-lg text-gray-800 mb-8 mt-4 font-inter">
          The PlayerDoge team is here for you 24/7. Just drop us a message anytime!
        </p>

        <div className="flex items-center gap-3 mb-4">
          <Image src="/icons/email.png" alt="email icon" width={24} height={24} />
          <span className="font-semibold font-inter">support@playerdoge.com</span>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Image src="/icons/instagram.png" alt="instagram icon" width={24} height={24} />
          <span className="font-semibold font-inter">@playerdogeofficial</span>
        </div>

        <div className="flex items-center gap-3">
          <Image src="/icons/discord.png" alt="discord icon" width={24} height={24} />
          <span className="font-semibold font-inter">PlayerDoge</span>
        </div>
      </div>

      <div className="w-full max-w-[300px] md:max-w-[360px]">
        <Image
          src="/images/contact.png"
          alt="doge confused"
          width={360}
          height={360}
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
