// components/Reviews.tsx
import React from "react";

const reviews = [
  {
    name: "Leonardo R.",
    text: "I'm from Italy and I’ve been using PlayerDoge for my Whiteout Survival packs for months now. Every top-up is smooth and fast. I always pay with Wise and never had a single issue.",
  },
  {
    name: "Amelia K.",
    text: "Tried PlayerDoge for Diablo Immortal after a friend recommended it. Got my bundle 25% cheaper and it was in my account within 20 minutes. Super friendly team.",
  },
  {
    name: "Mateusz D.",
    text: "As someone who plays Top War daily I’ve saved so much money using PlayerDoge. The process is easy and they’re always quick to respond on Discord.",
  },
  {
    name: "Ethan P.",
    text: "I was skeptical at first but I paid with crypto and got my King of Avalon top-up plus a discount. PlayerDoge is now my go-to for all in-game purchases.",
  },
];

const Reviews = () => {
  return (
    <section className="bg-[#FFFDD0] py-16 px-4">
  <div className="max-w-6xl mx-auto">
    <h2 className="text-center text-2xl md:text-3xl font-extrabold font-montserrat text-[#1d1d1d] mb-12">
      Trusted by gamers worldwide.
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {reviews.map((review, index) => (
        <div
          key={index}
          className="bg-[#FFEFC4] rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[180px]"
        >
          <p className="text-sm font-semibold font-montserrat text-[#1d1d1d] mb-4">
            {review.text}
          </p>
          <div className="mt-auto flex justify-between items-end">
            <span className="text-md font-semibold font-inter text-gray-800">
              {review.name}
            </span>
            <span className="text-[100px] leading-none text-gray-800 font-bold">
              &rdquo;
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default Reviews;
