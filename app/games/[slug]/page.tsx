
"use client";

import { useParams, useRouter, notFound } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { gameData } from "@/lib/gameData";
import { useAuth } from "@/context/AuthContext";
import { Listbox } from "@headlessui/react";
import clsx from "clsx";
import { useTidio } from "@/lib/useTidio";
import { motion, AnimatePresence } from "framer-motion";
import {
  doc,
  updateDoc,
  increment,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const gameFaqs = [
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



type Country = "usa" | "canada" | "eu" | "australia" | "other";

export const dynamic = "force-dynamic";


export default function GameDetailPage() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [openFaqIndex, setOpenFaqIndex] = useState(-1);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? -1 : index));
  };
  const { user, userData } = useAuth();
  const router = useRouter();
  const countryLabel = (country: Country) => {
    switch (country) {
      case "usa":
        return "United States";
      case "canada":
        return "Canada";
      case "eu":
        return "Europe";
      case "australia":
        return "Australia";
        case "other":
  return "Other region";

      default:
        return "";
    }
  };

  const { openChatWithMessage } = useTidio();


  const universalPacks = [
    { label: "Any pack", coins: 500 },
    { label: "Any pack", coins: 1000 },
    { label: "Any pack", coins: 2000 },
    { label: "Any pack", coins: 5000 },
    { label: "Any pack", coins: 10000 },
  ];

  const countryPrices: Record<Country, number[]> = {
    usa: [4.99, 9.99, 19.99, 49.99, 99.99],
    canada: [6.99, 13.99, 26.99, 69.99, 139.99],
    eu: [5.99, 11.99, 22.99, 59.99, 119.99],
    australia: [7.99, 16.99, 33.99, 79.99, 159.99],
    other: [4.99, 9.99, 19.99, 49.99, 99.99], // isto kao usa

    
  };

  const currencyPrefixes: Record<Country, string> = {
    usa: "USD",
    canada: "CAD",
    eu: "EUR",
    australia: "AUD",
    other: "USD", // kao usa

  };

  const [selectedCountry, setSelectedCountry] = useState<Country>("usa");
  const [quantity, setQuantity] = useState<number>(1);
  const [accountInfo, setAccountInfo] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(0);
  const [isCredentialsChecked, setIsCredentialsChecked] = useState(false);
  const [isScreenshotChecked, setIsScreenshotChecked] = useState(false);
  const [isCodeRequiredChecked, setIsCodeRequiredChecked] = useState(false);



  const slug = (useParams()?.slug ?? "") as string;
  const game = gameData.find((g) => g.slug === slug);
  if (!game) return notFound();



  const currentPrices = countryPrices[selectedCountry];

  const handleBuyClick = (index: number) => {
    const neededCoins = universalPacks[index].coins;

    if (!user) {
      router.push("/login");
      return;
    }

    if (!userData || userData.coins < neededCoins) {
      router.push("/buycoins");
      return;
    }

    setSelectedPackIndex(index);


    document.getElementById("complete_purchase")?.scrollIntoView({ behavior: "smooth" });

  };

  return (
    <>
    <main className="bg-[#FFFDD0] min-h-screen pt-32 px-4 md:px-8 xl:px-16 font-inter">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-10">
        {/* LEFT */}
        <div>
          <h1 className="text-3xl md:text-5xl font-montserrat text-[#1d1d1d] leading-tight mb-6">
            Buy{" "}
            <span
              className="
                font-extrabold
                bg-gradient-to-r
                from-[#FF7D29]
                to-[#582503]
                bg-clip-text
                text-transparent
              "
            >
              {game.name}
            </span>{" "}
            packs safely and affordably with Kinged
          </h1>

          <div className="mb-4">
            <Listbox value={selectedCountry} onChange={setSelectedCountry}>
  <div className="relative mt-1">
    <Listbox.Button className="relative w-full md:w-auto cursor-pointer rounded-lg border border-black bg-transparent py-2 pl-3 pr-10 text-left text-sm">
          <span className="flex items-center gap-2">
            <Image
              src={`/images/${selectedCountry}.png`}
              alt={selectedCountry}
              width={20}
              height={14}
            />
            {countryLabel(selectedCountry)}
          </span>
        </Listbox.Button>
        <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full md:w-auto overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
{(["usa", "eu", "canada", "australia", "other"] as Country[]).map((country) => (
            <Listbox.Option
              key={country}
              value={country}
              className={({ active }) =>
                clsx(
                  "cursor-pointer select-none relative py-2 pl-3 pr-9",
                  active ? "bg-[#FFEFC4]" : ""
                )
              }
            >
              <div className="flex items-center gap-2">
                <Image
                  src={`/images/${country}.png`}
                  alt={country}
                  width={20}
                  height={14}
                />
                {countryLabel(country)}
              </div>
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </div>
    </Listbox>

          </div>

          <div className="mb-8">
            <p className="text-xs mb-4 font-montserrat">
              Check the prices of{" "}
              <span className="font-bold">Kinged coins</span>.
            </p>
            <Link
              href="/buycoins"
              className="border font-bold font-montserrat border-black px-6 py-2 rounded-lg hover:bg-black hover:text-white transition"
            >
              Buy coins
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {universalPacks.map((pack, i) => (
              <div
                key={i}
                className="bg-[#FFEFC4] p-3 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-lg transition"
              >
                <div className="w-[100px] h-[100px] relative rounded-md overflow-hidden shrink-0">
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-mds font-normal font-montserrat text-[#1d1d1d]">
                    Any{" "}
                    <strong className="font-extrabold text-[#1D1D1D] tracking-wide">
                      {currentPrices[i].toFixed(2)}{" "}
                      {currencyPrefixes[selectedCountry]}
                    </strong>{" "}
                    pack
                  </p>
                  <button
                    onClick={() => handleBuyClick(i)}
                    className="mt-2 bg-[#FF7D29] hover:bg-[#e96e1b] text-white text-sm font-montserrat font-bold px-6 py-2 rounded-md shadow flex items-center justify-center gap-2"
                  >
                    Buy for {pack.coins}
                    <Image
                      src="/images/coin.png"
                      alt="Kinged Coin"
                      width={25}
                      height={25}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-md text-[#1d1d1d] mt-10 max-w-xl leading-relaxed">
            Looking to enhance your{" "}
            <strong className="font-extrabold text-[#1D1D1D] tracking-wide">
              {game.name}
            </strong>{" "}
            experience without overpaying? Kinged offers a seamless,
            secure, and cost-effective solution for purchasing in-game packs.
            As a registered LLC, we prioritize your account’s safety and provide
            a transparent TopUp process.
          </p>
        </div>

        {/* RIGHT */}
        <div id="complete_purchase" className="bg-[#FFEFC4] p-6 rounded-xl shadow-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-bold font-montserrat mb-3">
              Purchase information
            </h2>
            <p className="text-sm mb-4 flex items-center gap-1">
              Selected:{" "}
              <strong>
                {universalPacks[selectedPackIndex].coins} coins
              </strong>
              <Image
                src="/images/coin.png"
                alt="Coin"
                width={20}
                height={20}
                className="inline-block ml-1"
              />
            </p>

            <div className="relative mb-4">
              <Image
                src="/icons/acct.png"
                alt="Account Icon"
                width={16}
                height={16}
                className="absolute top-3 left-3"
              />
              <textarea
                placeholder="Account information / login details"
                value={accountInfo}
                onChange={(e) => setAccountInfo(e.target.value)}
                className="w-full pl-10 border bg-[#FEFFD2] border-[#1d1d1d]  font-bold rounded px-4 py-2 text-sm outline-none placeholder:text-gray-600"
                rows={3}
              />

            </div>

            <div className="mb-4">
            
              <p className="text-xs mb-2 mt-1 font-montserrat">
                After placing your order, please share a {" "} 
                <span className="font-bold">screenshot(s)</span> of the desired {" "} 
                <span className="font-bold">package(s) </span> with our support team via live chat.
              </p>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between bg-[#FEFFD2] border  font-bold border-[#1d1d1d] rounded-lg px-4 py-2 text-sm text-gray-600 w-48">
                <button
                  className="text-[#FF7D29] text-lg px-2"
                  onClick={() =>
                    setQuantity((prev) => Math.max(1, prev - 1))
                  }
                >
                  –
                </button>
                <span>
                  {quantity > 1 ? `Quantity: ${quantity}` : "Quantity"}
                </span>
                <button
                  className="text-[#FF7D29] text-lg px-2"
                  onClick={() => setQuantity((prev) => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="relative mb-4">
              <Image
                src="/icons/notes.png"
                alt="Notes Icon"
                width={16}
                height={16}
                className="absolute top-3 left-3"
              />
              <textarea
                placeholder="Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full pl-10 border bg-[#FEFFD2] border-[#1d1d1d] font-bold rounded px-4 py-2 text-sm outline-none placeholder:text-gray-600"
                rows={6}
              />

            </div>

            <p className="text-md mb-4 font-semibold flex items-center gap-1">
              Total:
              <span className="text-[#FF7D29] font-bold flex items-center gap-1">
                {universalPacks[selectedPackIndex].coins * quantity}
                <Image
                  src="/images/coin.png"
                  alt="coin"
                  width={20}
                  height={20}
                />
              </span>
            </p>

            <div className="text-sm text-[#1d1d1d] mb-4">
              <p className="text-md mb-2 font-montserrat font-bold">
                I understand and agree:
              </p>
              <label className="block mb-2 text-xs">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isCredentialsChecked}
                  onChange={(e) => setIsCredentialsChecked(e.target.checked)}
                />
                Account login details are required to complete the top-up.
              </label>
              <label className="block text-xs">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isScreenshotChecked}
                  onChange={(e) => setIsScreenshotChecked(e.target.checked)}
                />
                Clear screenshot(s) of the desired package(s) will be sent via live chat.
              </label>
                          <label className="block text-xs">
              <input
                type="checkbox"
                className="mr-2"
                checked={isCodeRequiredChecked}
                onChange={(e) => setIsCodeRequiredChecked(e.target.checked)}
              />
              One-time login code may be required to complete the service.
            </label>

            </div>

          </div>
  {errorMessage && (
        <p className="text-red-600 text-sm mt-2 font-semibold">{errorMessage}</p>
      )}
        <button
          className="w-full bg-[#FF7D29] hover:bg-[#e96e1b] text-white font-bold py-3 rounded-lg font-montserrat mt-4 shadow-md"
          onClick={async () => {
    setErrorMessage("");

    // Ako nije ulogovan
    if (!user) {
      router.push("/login");
      return;
    }

    // Ako nema dovoljno coinsa
    const neededCoins = universalPacks[selectedPackIndex].coins * quantity;
    if (!userData || userData.coins < neededCoins) {
      router.push("/buycoins");
      return;
    }

    // Validacija polja
    if (!accountInfo.trim()) {
      setErrorMessage("Please enter your account information.");
      return;
    }

    if (!isCredentialsChecked || !isScreenshotChecked) {
      setErrorMessage("Please make sure you checked both boxes.");
      return;
    }

    // Ako sve prolazi, nastavi
    const message =
      `New purchase request:\n\n` +
      `Game: ${game.name}\n` +
      `Pack: ${universalPacks[selectedPackIndex].coins} coins\n` +
      `Quantity: ${quantity}\n` +
      `Account Info: ${accountInfo || "N/A"}\n` +
      `Notes: ${notes || "N/A"}\n` +
      `Country: ${countryLabel(selectedCountry)}\n` +
      `Screenshot: Please send the screenshot in this chat.`;

    // Update Firestore: deduct coins and log purchase
    const totalCoins = universalPacks[selectedPackIndex].coins * quantity;
    if (user) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { coins: increment(-totalCoins) });
        await addDoc(collection(db, "users", user.uid, "purchases"), {
          game: game.name,
          amount: totalCoins,
          image: game.image,
          timestamp: serverTimestamp(),
        });
      } catch (err) {
        console.error("Failed to record purchase", err);
      }
    }

    openChatWithMessage(message);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }}


        >
          
          Complete purchase
        </button>

      


        </div>
      </div>


      <section className="max-w-7xl mx-auto mt-16 mb-20 text-[#1D1D1D] font-inter px-4">
  <h2 className="text-xl md:text-2xl font-semibold mb-4">
    Why choose <span className="font-bold">Kinged</span> for your {game.name} TopUps?
  </h2>
  <ul className="list-disc list-inside space-y-2 mb-8">
    <li><span className="font-semibold">Legitimate and secure:</span> All our products are sourced from official channels, ensuring authenticity and quality.</li>
    <li><span className="font-semibold">Registered business:</span> Kinged operates as a legally registered LLC, offering you peace of mind with every transaction.</li>
    <li><span className="font-semibold">User-friendly process:</span> Our platform is designed for ease of use, making your TopUp experience straightforward and hassle-free.</li>
    <li><span className="font-semibold">Competitive pricing:</span> Enjoy better rates compared to standard in-app purchases, saving you money on your favorite games.</li>
    <li><span className="font-semibold">Responsive support:</span> Our dedicated customer service team is available to assist you at every step.</li>
  </ul>

  <h2 className="text-xl md:text-2xl font-semibold mb-4">How it works?</h2>
  <ol className="list-decimal list-inside space-y-2 mb-8">
    <li><span className="font-semibold">Create or log in to your Kinged account:</span> Start by accessing your account on our platform.</li>
    <li><span className="font-semibold">Purchase coins:</span> Buy the desired amount of Kinged coins using your preferred payment method.</li>
    <li><span className="font-semibold">Select your game and package:</span> Choose {game.name} and the specific pack you wish to purchase.</li>
    <li><span className="font-semibold">Provide game account details:</span> Enter your {game.name} login credentials securely. This information is necessary for us to process the TopUp directly into your account.</li>
    <li><span className="font-semibold">Confirm and complete your order:</span> After placing your order, send a clear screenshot of the desired package from your in-game store via live chat. This helps us match the correct product and avoid any confusion or mistakes. Once the payment is confirmed, our team will process your order promptly.</li>
  </ol>

  <h2 className="text-xl md:text-2xl font-semibold mb-4">Important information!</h2>
  <ul className="list-disc list-inside space-y-2">
    <li><span className="font-semibold">Virtual product:</span> This is a digital product with an online TopUp. Once the TopUp is successful, returns or exchanges are not available.</li>
    <li><span className="font-semibold">Processing time:</span> After communicating with customer service and placing an order, the TopUp is usually completed within approximately 30 minutes, depending on the order queue.</li>
    <li><span className="font-semibold">Security assurance:</span> All products on this site come from legitimate sources and are quality guaranteed.</li>
    <li><span className="font-semibold">Beware of scams:</span> Be cautious of third-party sites attempting scams. Always confirm transactions through our official site and links published on the site. Happy shopping!</li>
  </ul>
  <p className="mt-4 text-sm">
    By choosing Kinged, you are opting for a trusted, efficient, and user-centric TopUp service for {game.name}.
  </p>
</section>

        {/* FAQ Section */}
        <div className="max-w-7xl mx-auto mt-20 border-t border-[#1d1d1d]/20 pt-16 mb-20 px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <h2 className="text-2xl md:text-3xl font-extrabold font-montserrat text-[#1d1d1d] mb-2">
              Multi-Level Account Protection
            </h2>
            <p className="text-[#4b4b4b] text-base font-inter">
              Everything you need to know about keeping your account safe with Kinged.
            </p>
          </motion.div>

          <div className="space-y-3 max-w-3xl">
            {gameFaqs.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.07, duration: 0.5, ease: "easeOut" }}
                  viewport={{ once: true }}
                  className={`border-l-4 ${isOpen ? "border-[#FF7D29]" : "border-[#1d1d1d]/20"} bg-white/60 rounded-r-xl transition-all`}
                >
                  <button
                    className="w-full flex justify-between items-center px-5 py-4 text-left font-bold font-montserrat text-[#1d1d1d] hover:text-[#FF7D29] transition"
                    onClick={() => toggleFaq(i)}
                  >
                    <span>{faq.question}</span>
                    <span className={`text-xl font-light ml-4 flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}>+</span>
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
                        <p className="text-sm font-inter whitespace-pre-line leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>

    </main>
    </>
  );
}