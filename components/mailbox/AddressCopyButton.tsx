"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface Props {
  address: string;
}

export default function AddressCopyButton({ address }: Props) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setIsCopied(true);
      
      setTimeout(() => setIsCopied(false), 2000); // 2초 뒤 원상복구
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button 
      onClick={handleCopy}
      className="
        group flex items-center gap-2 cursor-pointer 
        hover:bg-gray-100 dark:hover:bg-zinc-800 
        px-2 py-1 rounded-md transition-colors
      "
      title="클릭해서 주소 복사"
    >
      <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100 truncate max-w-[150px] md:max-w-none">
        {address}
      </h2>
      
      {/* 복사됨 상태에 따라 아이콘 변경 */}
      <div className="text-gray-400 dark:text-gray-500">
        {isCopied ? (
          <Check className="w-4 h-4 text-green-500 animate-in zoom-in duration-300" />
        ) : (
          <Copy className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </button>
  );
}