"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface CoinCardProps {
  amount: number;
  price: number;
  value: string;
}

export function CoinCard({ amount, price, value }: CoinCardProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    console.log(`Kupovina ${amount} coins`);
  };

  return (
<div
  className="flex flex-col md:flex-row md:justify-between md:items-center bg-[#FFEFC4] rounded-lg px-4 py-4 shadow gap-4"
>
  <div className="flex items-center gap-3 md:gap-4">
    <Image
      src="/images/coin.png"
      alt="Coin"
      width={40}
      height={40}
    />
    <div className="text-center md:text-left">
      <p className="font-extrabold font-montserrat text-[#1D1D1D]">
        {amount.toLocaleString()} coins
      </p>
      <p className="text-sm font-semibold font-inter text-[#666]">
        In-game value: {value}
      </p>
    </div>
  </div>

  <button
    onClick={handleClick}
    className="w-full md:w-auto text-center bg-[#FF7D29] hover:bg-[#e96e1b] text-white font-semibold font-montserrat text-sm px-4 py-3 md:py-2 rounded-md shadow"
  >
    Buy for ${price}
  </button>
</div>




  );
}
