"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const faqs = [
  {
    question: "How does the PlayerDoge top-up process work?",
    answer: `Place your order on the PlayerDoge website by selecting your game, choosing a pack, and entering your account details at checkout. After placing your order, send a clear screenshot of the desired item from your in-game store via live chat. Stay logged out while we process your top-up, we’ll let you know once it’s complete so you can log back in and confirm. Most orders are delivered within 30 minutes.`,
  },
  {
    question: "How do I place an order and make a payment?",
    answer: `Buy coins first, that’s your balance for all orders. Each game pack has its coin price, and the amount is deducted when you order.
We support PayPal, Wise, Paysend, Zelle (+3%), crypto (with a discount), and credit/debit cards (+5%), plus local payment options based on your country.`,
  },
  {
    question: "How safe is PlayerDoge?",
    answer: `Your account’s safety is our top priority. We top up only through official in-game stores, with no third-party tools or risk involved.
Only verified team members handle your login info, stored securely and never shared. With thousands of safe top-ups completed, PlayerDoge is a trusted choice for mobile gamers.`,
  },
  {
    question: "Can I use PlayerDoge from my country?",
    answer: `Yes. PlayerDoge is available worldwide, no matter where you’re from, you can place an order. We support international payments and process top-ups for players across all regions. Just make sure your account details are correct and follow the steps at checkout.`,
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
          Clear and honest info about how PlayerDoge works, so you always know what to expect.
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
