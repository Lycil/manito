import Link from "next/link";
import { Mail } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import LogoutButton from "@/components/LogoutButton";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";

interface SiteHeaderProps {
  session: Session | null;
}

export default function SiteHeader({ session }: SiteHeaderProps) {
  return (
    <header className="
      fixed top-4 left-1/2 -translate-x-1/2
      z-50 w-[calc(100%-2rem)] max-w-screen-2xl h-16 px-6 
      rounded-full border border-white/20 shadow-lg 
      flex items-center justify-between transition-all 
      bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md dark:border-zinc-800
    ">
      <div className="flex items-center gap-2">
        <Link href="/" className="text-xl font-bold flex items-center gap-2 dark:text-gray-100 cursor-pointer">
          <Mail className="text-primary" /> Manito
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {session ? (
          <LogoutButton />
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="sm">로그인</Button>
          </Link>
        )}
      </div>
    </header>
  );
}