"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

interface CoinCardProps {
  amount: number;
  price: string;
  value: string;
  index: number;
  onBuy: () => void;
}

export function CoinCard({ amount, price, value, index, onBuy }: CoinCardProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    onBuy();
  };

  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center bg-[#FFEFC4] rounded-lg px-4 py-4 shadow gap-4">
      <div className="flex items-center gap-3 md:gap-4">
        <Image
          src={`/images/by${index + 1}.png`}
          alt={`Pack ${index + 1}`}
          width={80}
          height={80}
        />
        <div className="md:text-left">
          <p className="font-extrabold text-lg font-montserrat text-[#1D1D1D]">
            {amount.toLocaleString()} coins
          </p>
          <p className="text-sm font-semibold font-inter text-[#666]">
            In-game value: {price}
          </p>
        </div>
      </div>

      <button
        onClick={handleClick}
        className="w-full md:w-auto bg-[#FF7D29] hover:bg-[#e96e1b] text-white font-bold font-montserrat text-sm px-4 py-3 md:py-2 rounded-md shadow"
      >
        Buy for {value}
      </button>
    </div>
  );
}
