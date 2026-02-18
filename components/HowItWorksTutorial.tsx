"use client";

import { useState, useEffect, useCallback, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Gamepad2, User, Smartphone, Wallet, Coins } from "lucide-react";

// Step data with icons and content (descriptions with highlighted words)
const steps: {
  number: number;
  title: string;
  description: ReactNode;
  icon: string;
}[] = [
  {
    number: 1,
    title: "Buy coins",
    description: (
      <>
        <strong className="text-[#FF7A3D]">Create or log in</strong> to Kinged and{" "}
        <strong>purchase coins</strong> with your preferred payment method.
      </>
    ),
    icon: "wallet",
  },
  {
    number: 2,
    title: "Choose package(s)",
    description: (
      <>
        <strong className="text-[#FF7A3D]">Select your game</strong> and package(s), then enter
        your <strong>game account login details</strong> securely.
      </>
    ),
    icon: "gamepad",
  },
  {
    number: 3,
    title: "Order confirmation",
    description: (
      <>
        <strong className="text-[#FF7A3D]">Confirm order</strong> and send a package(s){" "}
        <strong>screenshot(s) via live chat</strong>; we process it without delay.
      </>
    ),
    icon: "account",
  },
];

// Icon component with animated background circle
function StepIcon({ type }: { type: string }) {
  return (
    <div className="relative">
      {/* Gradient background circle */}
      <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br from-[#FF7A3D] to-[#FF9A5A] flex items-center justify-center shadow-lg">
        {type === "gamepad" && (
          <Gamepad2 className="w-12 h-12 md:w-14 md:h-14 text-white" strokeWidth={2} />
        )}
        {type === "account" && (
          <div className="relative flex items-center justify-center">
            <User className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2} />
            <Smartphone
              className="w-6 h-6 md:w-7 md:h-7 text-white absolute -bottom-1 -right-2"
              strokeWidth={2}
            />
          </div>
        )}
        {type === "wallet" && (
          <div className="relative flex items-center justify-center">
            <Wallet className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2} />
            <div className="absolute -top-1 -right-2 bg-[#FFD700] rounded-full p-1 shadow-md">
              <Coins className="w-4 h-4 md:w-5 md:h-5 text-[#FF7A3D]" strokeWidth={2.5} />
            </div>
          </div>
        )}
      </div>
      {/* Subtle glow effect */}
      <div className="absolute inset-0 w-24 h-24 md:w-28 md:h-28 rounded-full bg-[#FF7A3D] opacity-20 blur-xl -z-10" />
    </div>
  );
}

// Step indicator dots - simplified, no motion for efficiency
function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex gap-2 justify-center mt-6">
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={`h-2 rounded-full transition-all duration-300 ${
            index === currentStep ? "bg-[#FF7A3D] w-6" : "bg-[#D4C4A8] w-2"
          }`}
        />
      ))}
    </div>
  );
}

// iPhone 16 Pro Frame component
function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto">
      {/* iPhone 16 Pro outer frame - Titanium style */}
      <div className="relative bg-gradient-to-b from-[#2A2A2C] to-[#1C1C1E] rounded-[55px] md:rounded-[60px] p-[3px] shadow-2xl">
        {/* Titanium edge highlight */}
        <div className="absolute inset-0 rounded-[55px] md:rounded-[60px] bg-gradient-to-br from-[#4A4A4C] via-transparent to-[#1A1A1C] opacity-50" />

        {/* Inner frame */}
        <div className="relative bg-[#000000] rounded-[52px] md:rounded-[57px] p-[2px]">
          {/* Screen container */}
          <div className="relative w-[280px] h-[580px] md:w-[320px] md:h-[660px] bg-[#FFF8E7] rounded-[50px] md:rounded-[55px] overflow-hidden">
            {/* Dynamic Island */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-20">
              <div className="w-[100px] md:w-[120px] h-[32px] md:h-[36px] bg-[#000000] rounded-full flex items-center justify-center gap-3">
                {/* Front camera */}
                <div className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-full bg-[#1a1a1a] border border-[#2a2a2a] flex items-center justify-center">
                  <div className="w-[6px] h-[6px] md:w-[7px] md:h-[7px] rounded-full bg-[#0d1f3c]" />
                </div>
                {/* Face ID sensors */}
                <div className="w-[6px] h-[6px] md:w-[7px] md:h-[7px] rounded-full bg-[#1a1a1a]" />
              </div>
            </div>

            {/* Screen content */}
            <div className="h-full w-full">{children}</div>

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-20">
              <div className="w-[120px] md:w-[140px] h-[5px] bg-black rounded-full opacity-80" />
            </div>
          </div>
        </div>
      </div>

      {/* Side buttons - iPhone 16 Pro style */}
      {/* Power button (right side) */}
      <div className="absolute right-[-2px] top-[140px] md:top-[160px] w-[3px] h-[80px] md:h-[90px] bg-gradient-to-b from-[#3A3A3C] via-[#2A2A2C] to-[#3A3A3C] rounded-r-sm" />

      {/* Action button (left side - top) */}
      <div className="absolute left-[-2px] top-[100px] md:top-[110px] w-[3px] h-[28px] md:h-[32px] bg-gradient-to-b from-[#3A3A3C] via-[#2A2A2C] to-[#3A3A3C] rounded-l-sm" />

      {/* Volume Up (left side) */}
      <div className="absolute left-[-2px] top-[145px] md:top-[160px] w-[3px] h-[50px] md:h-[55px] bg-gradient-to-b from-[#3A3A3C] via-[#2A2A2C] to-[#3A3A3C] rounded-l-sm" />

      {/* Volume Down (left side) */}
      <div className="absolute left-[-2px] top-[205px] md:top-[225px] w-[3px] h-[50px] md:h-[55px] bg-gradient-to-b from-[#3A3A3C] via-[#2A2A2C] to-[#3A3A3C] rounded-l-sm" />
    </div>
  );
}

// Optimized animation variants - using transform only (GPU accelerated)
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};

// Main Tutorial Content Component - starts animation only when in view
function TutorialContent({ isInView }: { isInView: boolean }) {
  const [[currentStep, direction], setCurrentStep] = useState([0, 0]);

  const nextStep = useCallback(() => {
    setCurrentStep(([prev]) => [(prev + 1) % steps.length, 1]);
  }, []);

  useEffect(() => {
    // Only run interval when component is in view
    if (!isInView) return;

    const interval = setInterval(nextStep, 3000);
    return () => clearInterval(interval);
  }, [isInView, nextStep]);

  const step = steps[currentStep];

  return (
    <div className="h-full flex flex-col pt-16 pb-10 px-5">
      {/* Animated content area */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "tween", duration: 0.4, ease: "easeInOut" },
              opacity: { duration: 0.3 },
            }}
            className="flex flex-col items-center text-center px-2"
          >
            {/* Icon */}
            <StepIcon type={step.icon} />

            {/* Step number and title */}
            <div className="mt-6">
              <span className="text-[#FF7A3D] text-2xl md:text-3xl font-extrabold font-montserrat">
                Step {step.number}
              </span>
              <h4 className="text-[#FF7A3D] text-lg md:text-xl font-bold font-montserrat mt-1">
                {step.title}
              </h4>
            </div>

            {/* Description with highlighted words */}
            <p className="text-[#1D1D1D] text-sm md:text-base font-inter mt-4 leading-relaxed max-w-[240px]">
              {step.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Step indicators */}
      <StepIndicator currentStep={currentStep} />
    </div>
  );
}

// Main exported component
export default function HowItWorksTutorial() {
  // Use intersection observer to detect when component is in view
  const { ref, inView } = useInView({
    threshold: 0.3, // Trigger when 30% visible
    triggerOnce: false, // Keep tracking visibility
  });

  return (
    <section className="bg-[#FFEFC4] py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-extrabold font-montserrat text-center text-[#FF7D29] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] mb-12"
        >
          How it works?
        </motion.h2>

        {/* Phone mockup with tutorial */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <PhoneFrame>
            <TutorialContent isInView={inView} />
          </PhoneFrame>
        </motion.div>
      </div>
    </section>
  );
}

// Also export PhoneFrame separately if needed elsewhere
export { PhoneFrame };
