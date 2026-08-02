
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
import Faq from "@/components/Faq";
import { GAME_PACK_COINS } from "@/lib/gamePacks";

type Country =
  | "usa"
  | "canada"
  | "eu"
  | "australia"
  | "uk"
  | "switzerland"
  | "denmark"
  | "norway"
  | "poland"
  | "sweden"
  | "other";

export const dynamic = "force-dynamic";


export default function GameDetailPage() {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      case "uk":
        return "United Kingdom";
      case "switzerland":
        return "Switzerland";
      case "denmark":
        return "Denmark";
      case "norway":
        return "Norway";
      case "poland":
        return "Poland";
      case "sweden":
        return "Sweden";
      case "other":
        return "Other region";

      default:
        return "";
    }
  };

  const { openChatWithMessage } = useTidio();


  const universalPacks = GAME_PACK_COINS;

  const countryPrices: Record<Country, number[]> = {
    usa: [0.99, 4.99, 9.99, 19.99, 49.99, 99.99],
    canada: [1.39, 6.99, 13.99, 27.99, 69.99, 139.99],
    eu: [1.19, 5.99, 11.99, 23.99, 59.99, 119.99],
    australia: [1.59, 7.99, 15.99, 31.99, 79.99, 159.99],
    uk: [0.99, 4.99, 9.99, 19.99, 49.99, 99.99],
    switzerland: [0.89, 4.49, 8.99, 17.99, 44.99, 89.99],
    denmark: [8.99, 44.99, 89.99, 179.99, 449.99, 899.99],
    norway: [12.99, 64.99, 129.99, 259.99, 649.99, 1299.99],
    poland: [4.99, 24.99, 49.99, 99.99, 249.99, 499.99],
    sweden: [12.99, 64.99, 129.99, 259.99, 649.99, 1299.99],
    other: [0.99, 4.99, 9.99, 19.99, 49.99, 99.99], // isto kao usa
  };

  const currencyPrefixes: Record<Country, string> = {
    usa: "USD",
    canada: "CAD",
    eu: "EUR",
    australia: "AUD",
    uk: "GBP",
    switzerland: "CHF",
    denmark: "DKK",
    norway: "NOK",
    poland: "PLN",
    sweden: "SEK",
    other: "USD", // kao usa
  };

  const otherRegionLabels = [
    "lowest-priced",
    "entry-level",
    "lower mid-tier",
    "upper mid-tier",
    "high-tier",
    "top-tier",
  ];

  const [selectedCountry, setSelectedCountry] = useState<Country>("usa");
  const [quantity, setQuantity] = useState<number>(1);
  const [accountInfo, setAccountInfo] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedPackIndex, setSelectedPackIndex] = useState<number>(0);
  const [isCredentialsChecked, setIsCredentialsChecked] = useState(false);
  const [isScreenshotChecked, setIsScreenshotChecked] = useState(false);
  const [isCodeRequiredChecked, setIsCodeRequiredChecked] = useState(false);
  const [isLiveChatPrivateChecked, setIsLiveChatPrivateChecked] = useState(false);



  const slug = (useParams()?.slug ?? "") as string;
  const game = gameData.find((g) => g.slug === slug);
  if (!game) return notFound();



  const currentPrices = countryPrices[selectedCountry];

  const handleBuyClick = (index: number) => {
    const neededCoins = universalPacks[index];

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
{(["usa", "eu", "canada", "australia", "uk", "switzerland", "denmark", "norway", "poland", "sweden", "other"] as Country[]).map((country) => (
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
                      {selectedCountry === "other"
                        ? otherRegionLabels[i]
                        : `${currentPrices[i].toFixed(2)} ${currencyPrefixes[selectedCountry]}`}
                    </strong>{" "}
                    pack
                  </p>
                  <button
                    onClick={() => handleBuyClick(i)}
                    className="mt-2 bg-[#FF7D29] hover:bg-[#e96e1b] text-white text-sm font-montserrat font-bold px-6 py-2 rounded-md shadow flex items-center justify-center gap-2"
                  >
                    Buy for {pack}
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
                {universalPacks[selectedPackIndex]} coins
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
                {universalPacks[selectedPackIndex] * quantity}
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
                Kinged support must access my in-game account using my login details in order to purchase and deliver the selected package(s).
              </label>
              <label className="block mb-2 text-xs">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isCodeRequiredChecked}
                  onChange={(e) => setIsCodeRequiredChecked(e.target.checked)}
                />
                A one-time login code sent to my email is required to allow Kinged to access my account and complete the service.
              </label>
              <label className="block mb-2 text-xs">
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
                  checked={isLiveChatPrivateChecked}
                  onChange={(e) => setIsLiveChatPrivateChecked(e.target.checked)}
                />
                The live chat is accessible only to me and Kinged support staff.
              </label>

            </div>

          </div>
  {errorMessage && (
        <p className="text-red-600 text-sm mt-2 font-semibold">{errorMessage}</p>
      )}
        <button
          disabled={isSubmitting}
          className="w-full bg-[#FF7D29] hover:bg-[#e96e1b] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg font-montserrat mt-4 shadow-md"
          onClick={async () => {
    if (isSubmitting) return;
    setErrorMessage("");

    // Ako nije ulogovan
    if (!user) {
      router.push("/login");
      return;
    }

    // Ako nema dovoljno coinsa
    const neededCoins = universalPacks[selectedPackIndex] * quantity;
    if (!userData || userData.coins < neededCoins) {
      router.push("/buycoins");
      return;
    }

    // Validacija polja
    if (!accountInfo.trim()) {
      setErrorMessage("Please enter your account information.");
      return;
    }

    if (
      !isCredentialsChecked ||
      !isCodeRequiredChecked ||
      !isScreenshotChecked ||
      !isLiveChatPrivateChecked
    ) {
      setErrorMessage("Please make sure you checked all boxes.");
      return;
    }

    // Ako sve prolazi, nastavi
    const message =
      `New purchase request:\n\n` +
      `Game: ${game.name}\n` +
      `Pack: ${universalPacks[selectedPackIndex]} coins\n` +
      `Quantity: ${quantity}\n` +
      `Account Info: ${accountInfo || "N/A"}\n` +
      `Notes: ${notes || "N/A"}\n` +
      `Country: ${countryLabel(selectedCountry)}\n` +
      `Screenshot: Please send the screenshot in this chat.`;

    // The order is charged and logged server-side (admin SDK, single
    // transaction) so the coins and the purchase record can never diverge.
    setIsSubmitting(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          slug,
          packIndex: selectedPackIndex,
          quantity,
          notes,
          country: selectedCountry,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        if (res.status === 409) {
          router.push("/buycoins");
          return;
        }
        setErrorMessage(data.error ?? "Could not place the order. Please try again.");
        return;
      }
    } catch {
      setErrorMessage("Could not place the order. Please check your connection and try again.");
      return;
    } finally {
      setIsSubmitting(false);
    }

    openChatWithMessage(message);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }}


        >
          
          {isSubmitting ? "Placing order..." : "Complete purchase"}
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
        <div className="max-w-7xl mx-auto mt-10 border-t border-[#1d1d1d]/20 pt-4 mb-10">
          <Faq />
        </div>

    </main>
    </>
  );
}