import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#FEFFD2] py-10 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left: Company info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-[#FF7D29]">PlayerDoge LLC</h2>
          <p className="text-[#1D1D1D]">© 2025 PlayerDoge. All rights reserved.</p>
          <p className="text-sm leading-5 text-[#1D1D1D]">
            300 Colonial Center<br />
            Parkway STE 100N,<br />
            Roswell, GA, 30076<br />
            United States
          </p>
        </div>

        {/* Right: nav + contacts + icons */}
        <div className="flex flex-col items-center md:items-end gap-6 text-center md:text-right w-full">
          {/* Nav links */}
          <nav className="hidden md:flex flex-wrap gap-4 items-center justify-end text-[#1D1D1D] font-montserrat text-md">
            <Link className="hover:text-[#FF7D29] transition-colors duration-200" href="/">Home</Link>
            <Link className="hover:text-[#FF7D29] transition-colors duration-200" href="/#about">About</Link>
            <Link className="hover:text-[#FF7D29] transition-colors duration-200" href="/games">Games</Link>
            <Link className="hover:text-[#FF7D29] transition-colors duration-200" href="/#contact">Contact</Link>
            <Link href="/register" className="bg-[#FF7D29] text-white px-6 py-2 rounded-md font-bold font-montserrat hover:bg-[#e96e1b]">
              Register
            </Link>
          </nav>

          {/* Contact items */}
          <div className="flex flex-col gap-3 w-full max-w-xs">
            {[
              {
                icon: "/icons/email.png",
                label: "support@playerdoge.com",
                href: "mailto:support@playerdoge.com",
              },
              {
                icon: "/icons/instagram.png",
                label: "@packloader",
                href: "https://www.instagram.com/packloader/",
              },
              {
                icon: "/icons/discord.png",
                label: "PlayerDoge",
                href: "https://discord.gg/ntgxjAhtUQ",
              },
            ].map((contact) => (
              <Link
                key={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-[#FFEFC4] rounded-lg px-4 py-3 shadow hover:bg-[#ffe4a0] transition-colors duration-200"
              >
                <Image
                  src={contact.icon}
                  alt={`${contact.label} icon`}
                  width={24}
                  height={24}
                />
                <span className="font-semibold font-inter">{contact.label}</span>
              </Link>
            ))}
          </div>

          {/* Legal links */}
          <div className="flex gap-4 text-xs md:text-sm text-[#1D1D1D]">
            <Link href="/terms" className="underline hover:text-[#FF7D29]">Terms of Service</Link>
            <Link href="/privacy" className="underline hover:text-[#FF7D29]">Privacy Policy</Link>
          </div>

          {/* Payment icons */}
          <div className="grid grid-cols-4 md:flex md:flex-wrap justify-center md:justify-end gap-4 mt-4 w-full">
            {[
               "Paypal",
                "Wise",
                "Paysend",
                "Remitly",
                "Zelle",
                "Visa",
                "Mastercard",
                "Moneygram",
            ].map((name) => (
              <div key={name} className="flex justify-center md:justify-end">
                <Image
                  src={`/images/payments/${name}.png`}
                  alt={name}
                  width={60}
                  height={32}
                  className="h-8 md:h-10 w-auto object-contain"
                />
              </div>
              
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
