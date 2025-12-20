"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import DeleteAddressButton from "@/components/DeleteAddressButton";
import EditMemoButton from "@/components/EditMemoButton";

interface Props {
  addr: {
    _id: string;
    fullAddress: string;
    isActive: boolean;
    memo?: string;
  };
}

export default function SidebarItem({ addr }: Props) {
  const pathname = usePathname();
  const isSelected = pathname === `/mailbox/${addr._id}`;

  return (
    <div
      className={`
        relative group mb-3 rounded-lg border transition-colors overflow-hidden
        ${isSelected 
          ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800" 
          : "bg-white hover:bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800/50"}
      `}
    >
      <Link 
        href={`/mailbox/${addr._id}`} 
        className="absolute inset-0 z-10"
        prefetch={false}
      />

      <div className="relative z-20 p-3 flex justify-between items-start pointer-events-none">
        
        <div className="flex flex-col">
           <span className={`font-semibold text-sm truncate w-32 md:w-40 mb-1
             ${isSelected 
               ? "text-indigo-700 dark:text-indigo-300" 
               : "text-gray-700 dark:text-gray-300"}
           `}>
             {addr.fullAddress.split("@")[0]}
           </span>
           <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
             {addr.memo || "메모 없음"}
           </p>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <EditMemoButton addressId={addr._id} currentMemo={addr.memo || ""} />
          <DeleteAddressButton addressId={addr._id} />
        </div>
      </div>
    </div>
  );
}