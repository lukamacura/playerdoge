"use client";

import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function WhyPlayerDoge() {
  const stats = [
    { value: 30, suffix: "min", label: "Fast delivery" },
    { value: 50, suffix: "+", label: "Supported games" },
    { value: 200, suffix: "+", label: "Satisfied users" },
    { value: 100, suffix: "%", label: "Payment security" },
  ];

  return (
    <section className="bg-[#FEFFD2] text-[#1D1D1D] py-20 px-6">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Left text content */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-center lg:text-left"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat text-[#FF7D29] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)]">
            Why PlayerDoge?
          </h2>
          <p className="mt-4 text-lg leading-relaxed font-inter">
            PlayerDoge is a{" "}
            <strong className="font-semibold">fully legit</strong> top-up
            service focused on safety and savings — no bans, no shortcuts. <br />
            With years of experience and thousands of happy users, we’re the
            trusted way to get cheaper{" "}
            <strong className="font-semibold">game packs</strong>, backed by
            real people and real results.
          </p>
        </motion.div>

        {/* Right stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => (
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
              className="bg-[#FFEFC4] rounded-lg text-center py-6 px-4 shadow-sm"
            >
              <div className="text-2xl md:text-3xl font-bold text-[#FF7D29] font-montserrat">
                <CountUp
                  start={0}
                  end={stat.value}
                  duration={1.5}
                  suffix={stat.suffix}
                  enableScrollSpy
                  scrollSpyOnce
                />
              </div>
              <div className="mt-1 text-sm font-medium text-[#1D1D1D] font-inter">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
