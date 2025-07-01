'use client'

import Image from 'next/image'

export default function Team() {
  return (
    <section className="bg-[#FEFFD2] py-20 px-6 text-[#1D1D1D]">
      <div className="max-w-7xl mx-auto text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold font-montserrat text-[#FF7D29] drop-shadow-[0_2px_2px_rgba(0,0,0,0.15)] mb-4">Meet the Team</h2>
        <p className="text-lg font-inter text-gray-700">
          More than a platform — it’s a mission.
        </p>
      </div>

      <div className="grid gap-12 md:grid-cols-2 max-w-5xl mx-auto">
        {/* Ivan */}
        <div className="bg-[#FFEFC4] p-6 rounded-xl shadow-md flex flex-col items-center text-center">
          <Image
            src="/images/ivan.jpg"
            alt="Ivan Mladenović"
            width={160}
            height={160}
            className="rounded-full mb-4 object-cover w-40 h-40"
          />
          <h3 className="text-2xl font-bold font-montserrat">Ivan Mladenović</h3>
          <p className="text-sm font-semibold text-[#FF7D29] mb-4">Founder</p>
          <p className="text-gray-800 font-inter text-sm leading-relaxed">
            Born in 2003, Ivan is a certified computer hardware specialist with three years of hands-on experience in the IT sector. After building a strong reputation in the digital asset trading space, particularly within CS2, he decided to apply that drive and experience to building something of his own. That’s how PlayerDoge was born, a project shaped by his vision, focus, and deep understanding of the gaming world.
          </p>
           <a
            href="https://www.instagram.com/packloader"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF7D29] font-semibold text-sm mt-2 hover:underline"
          >
            @packloader
          </a>
        </div>

        {/* Luka */}
        <div className="bg-[#FFEFC4] p-6 rounded-xl shadow-md flex flex-col items-center text-center">
          <Image
            src="/images/luka.jpg"
            alt="Luka Macura"
            width={160}
            height={160}
            className="rounded-full mb-4 object-cover w-40 h-40"
          />
          <h3 className="text-2xl font-bold font-montserrat">Luka Macura</h3>
          <p className="text-sm font-semibold text-[#FF7D29] mb-4">Developer</p>
          <p className="text-gray-800 font-inter text-sm leading-relaxed">
            Luka, born in 2006, is currently studying at the Faculty of Technical Sciences in Novi Sad, Serbia. As a certified web developer with extensive full-stack experience, he brings a blend of technical precision and creative problem-solving to the team. Highly dedicated to his work, Luka approaches every project with structure, clarity, and full focus on results. He values discipline, persistence, and continuous learning — and ensures that every line of code reflects those principles.
          </p>
           <a
            href="https://www.instagram.com/macuradesign/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FF7D29] font-semibold text-sm mt-2 hover:underline"
          >
            @macuradesign
          </a>
        </div>
      </div>
    </section>
  )
}
