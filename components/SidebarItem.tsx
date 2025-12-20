"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "@/components/ui/badge";
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
  // 현재 URL이 내 ID를 포함하고 있는지 확인
  const isSelected = pathname === `/dashboard/${addr._id}`;

  return (
    <Link href={`/dashboard/${addr._id}`}>
      <div
        className={`
          p-3 rounded-lg border cursor-pointer transition-colors group relative mb-3
          ${isSelected 
            ? "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/40 dark:border-indigo-800" 
            : "bg-white hover:bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800 dark:hover:bg-zinc-800/50"}
        `}
      >
        <div className="flex justify-between items-start mb-1">
          <span className={`font-semibold text-sm truncate w-32 md:w-40 
            ${isSelected 
              ? "text-indigo-700 dark:text-indigo-300" 
              : "text-gray-700 dark:text-gray-300"}
          `}>
            {addr.fullAddress}
          </span>
          
          <div className="flex items-center gap-2">
            <EditMemoButton addressId={addr._id} currentMemo={addr.memo || ""} />
            <DeleteAddressButton addressId={addr._id} />
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
          {addr.memo || "메모 없음"}
        </p>
      </div>
    </Link>
  );
}