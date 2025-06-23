'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

const faqs = [
  {
    question: 'How does the PlayerDoge top-up process work?',
    answer: `Place your order directly through the PlayerDoge site by selecting your game, choosing a pack, and entering your account details securely at checkout. Your info stays private and safe with us, and you won’t need to send it again.

Before each top-up, make sure to upload a screenshot of the item you want. Stay logged out while we process your order — we’ll notify you as soon as it’s done so you can log back in and confirm. Most top-ups are completed within 30 minutes.`,
  },
  {
    question: 'How do I place an order and make a payment?',
    answer: `Buy coins first — that’s your balance for all orders. Each game pack has its coin price, and the amount is deducted when you order.

We support PayPal, Wise, Paysend, Zelle (+3%), crypto (with a discount), and credit/debit cards (+5%), plus local payment options based on your country.`,
  },
  {
    question: 'How safe is PlayerDoge?',
    answer: `Your account’s safety is our top priority. We top up only through official in-game stores, with no third-party tools or risk involved.

Only verified team members handle your login info, stored securely and never shared. With thousands of safe top-ups completed, PlayerDoge is a trusted choice for mobile gamers.`,
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? -1 : index));
  };

  return (
    <section className="bg-[radial-gradient(circle_at_center,_rgba(255,125,41,0.7),_transparent_27%)] py-16 px-4 md:px-8 xl:px-16">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat text-[#1d1d1d] mb-4">
          You’ve got questions — let’s answer them.
        </h2>
        <p className="text-[#4b4b4b] text-base font-inter md:text-lg">
          Clear and honest info about how PlayerDoge works, so you always know what to expect.
        </p>
      </div>

      <div className="space-y-4 max-w-2xl mx-auto">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
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
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeInOut' }}
                    className="overflow-hidden px-5 pb-4 text-[#4b4b4b]"
                  >
                    <p className="text-md font-inter whitespace-pre-line">{faq.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          );
        })}
      </div>
    </section>
  );
}
