"use client";

import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

export default function Contact() {
  const contacts = [
    {
      icon: "/icons/email.png",
      label: "support@playerdoge.com",
    },
    {
      icon: "/icons/instagram.png",
      label: "@playerdogeofficial",
    },
    {
      icon: "/icons/discord.png",
      label: "PlayerDoge",
    },
  ];

  return (
    <section
      id="contact"
      className="max-w-6xl mx-auto bg-[#FFFDD0] text-[#1e1e1e] px-6 py-12 md:py-20 flex flex-col md:flex-row items-center justify-between gap-10"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-xl w-full"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat text-[#FF7D29] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">
          Contact us
        </h2>
        <p className="text-base md:text-lg text-gray-800 mb-8 mt-4 font-inter">
          The PlayerDoge team is here for you 24/7. Just drop us a message
          anytime!
        </p>
      </motion.div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {contacts.map((contact, i) => (
          <motion.div
            key={contact.label}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{
              delay: 0.2 + i * 0.2,
              duration: 0.5,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="flex items-center gap-3 bg-[#FFEFC4] rounded-lg px-4 py-3 shadow"
          >
            <Image
              src={contact.icon}
              alt={`${contact.label} icon`}
              width={24}
              height={24}
            />
            <span className="font-semibold font-inter">{contact.label}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
