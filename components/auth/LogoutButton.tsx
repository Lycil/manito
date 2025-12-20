"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => signOut({ callbackUrl: "/" })} // 로그아웃 후 메인('/')으로 이동
      title="로그아웃"
      className="text-gray-500 hover:text-red-600 hover:bg-red-50"
    >
      <LogOut className="h-5 w-5" />
    </Button>
  );
}