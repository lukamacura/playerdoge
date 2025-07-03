"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const steps = [
  {
    title: "1. Choose your pack",
    description: (
      <>
        <span className="font-bold">Pick your mobile game pack</span> and upload a screenshot from the game to avoid any mistake.
      </>
    ),
    icon: "/images/howitworks1.png",
  },
  {
    title: "2. Account Details",
    description: (
      <>
        <span className="font-bold">Send your login details</span> safely while we get your order ready with full data protection.
      </>
    ),
    icon: "/images/howitworks2.png",
  },
  {
    title: "3. Coin payment",
    description: (
      <>
        <span className="font-bold">Pay using PlayerDoge coins</span> and enjoy fast delivery with full safety for your account.
      </>
    ),
    icon: "/images/howitworks3.png",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-[#FFEFC4] py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold font-montserrat text-center text-[#FF7D29] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] mb-8"
        >
          How it works?
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2 + index * 0.2,
                duration: 0.6,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="bg-[#FEFFD2] rounded-xl shadow-lg px-6 py-8 flex flex-col items-center md:items-start text-center md:text-left"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: 0.3 + index * 0.2,
                  duration: 0.5,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
              >
                <Image
                  src={step.icon}
                  alt={step.title}
                  width={100}
                  height={100}
                  className="mb-4"
                />
              </motion.div>
              <h3 className="text-[#FF7D29] text-lg font-bold font-montserrat">
                {step.title}
              </h3>
              <p className="font-inter text-sm mt-2">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
