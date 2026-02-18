"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const faqs = [
  {
    question: "Why does Kinged ask for my personal information?",
    answer: `We need your personal information to purchase bundles on your behalf. We understand that this may raise concerns, so we take this matter seriously.\n\nTo remain authorized, we access your account to buy bundles for you while respecting the rules established by Google and the Apple Store.`,
  },
  {
    question: "How can I ensure the security of my account information?",
    answer: `At Kinged, we prioritize the security of your account information. Here's how we maintain the safety of your data:\n\n• Kinged purchases bundles for you from official stores.\n• By complying with the rules, every transaction meets the requirements of Google, Apple, and developers.\n\nRest assured that your Kinged purchases are as secure as if you made them yourself.`,
  },
  {
    question: "What measures do you take to safeguard my transactions?",
    answer: `An extra layer of protection is the implementation of the 2FA code.\n\nYou are in complete control over your account because you receive the code on your phone when logging in. This guarantees no one else can access your account without your permission.`,
  },
  {
    question: "What level of security is provided for the payment methods?",
    answer: `We implement high-security protocols for all payment methods.\n\nFor instance, we utilize the safest gateway for credit card payment methods, just like many other companies do. A gateway serves as a link to your point of sale system or virtual terminal to the next step in the payment authorization process.`,
  },
  {
    question: "Why do I have to pay before the order process begins?",
    answer: `Sending payments in advance can be tough, especially if you're unfamiliar with the other side. We require payment upfront to protect our business from potential scams and ensure efficient service. The mobile gaming world has many scammers, and this practice helps us allocate resources effectively.`,
  },
  {
    question: "Does Kinged violate the game's Terms of Service?",
    answer: `Using Kinged doesn't violate games' Terms of Service (ToS). Our purchasing process mirrors individual transactions, making them fully compliant with every game's ToS.\n\nMoreover, our security measures further guarantee that using Kinged fits within the practical enforcement of ToS, maintaining a safe and enjoyable gaming experience without the risk of any ToS violations.`,
  },
  {
    question: "Why do you promote a 35% discount when I see only 10%?",
    answer: `We understand you might feel you're not saving as much as you'd hoped, and we're here to help.\n\nThe price you see depends on several factors like the in-game price, taxes on digital goods, currency exchange, and other elements. For example, a €119.99 bundle is equivalent to $99.99, so European players save 30% or more, while US players save 10% plus tax. For US and Canadian players, we cover digital taxes, so if a bundle costs $99.99 with an additional 10% tax in your state, you end up paying only $89.99 with Kinged.\n\nWe promote a 10-35% discount because savings vary based on these factors. Additionally, we offer flash deals where you can save even more.`,
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  };

  return (
    <section className="bg-[radial-gradient(circle_at_center,_rgba(255,125,41,0.7),_transparent_27%)] py-16 px-4 md:px-8 xl:px-16">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat text-[#1d1d1d] mb-4">
          You’ve got questions? Let’s answer them.
        </h2>
        <p className="text-[#4b4b4b] text-base font-inter md:text-lg">
          Clear and honest info about how Kinged works, so you always know what to expect.
        </p>
      </motion.div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1, duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true }}
              className="rounded-xl border border-[#e8d8a5] bg-[#FFEFC4] transition-all"
            >
              <button
                className="w-full flex justify-between items-center px-5 py-4 text-left font-bold font-montserrat text-[#1d1d1d] hover:bg-[#fff6d0] transition rounded-xl"
                onClick={() => toggle(i)}
              >
                <span>{faq.question}</span>
                <motion.div
                  animate={{ rotate: isOpen ? -90 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative w-[18px] h-[18px] flex-shrink-0"
                >
                  <Image
                    src="/icons/arrow.png"
                    alt="Arrow"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden px-5 pb-4 text-[#4b4b4b]"
                  >
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-md font-inter whitespace-pre-line"
                    >
                      {faq.answer}
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
