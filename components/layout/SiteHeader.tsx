import Link from "next/link";
import Image from "next/image";
import { Mail, Shield, User } from "lucide-react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import LogoutButton from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/button";
import { Session } from "next-auth";

interface SiteHeaderProps {
  session: Session | null;
}

export default function SiteHeader({ session }: SiteHeaderProps) {
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");
  const isAdmin = session?.user?.email && adminEmails.includes(session.user.email);

  return (
    <header className="
      fixed top-3 left-1/2 -translate-x-1/2
      z-50 w-[calc(100%-1.5rem)] max-w-6xl h-16 px-2 md:px-6 
      rounded-full flex items-center justify-between transition-all 
      backdrop-blur-md shadow-lg
      bg-white/75 dark:bg-zinc-950/70
      border border-gray-200 dark:border-zinc-800
    ">
      <div className="flex items-center gap-1 md:gap-4">
        <Link href="/" className="text-xl md:text-2xl font-bold flex items-center gap-2 dark:text-gray-100 cursor-pointer">
          <Image src="/icon.png" height={28} width={28} alt="Manito" /> Manito
        </Link>

        
        <Link href="/mailbox"> 
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 font-medium cursor-pointer">
            <Mail className="w-4 h-4" />
            <span className="hidden md:inline-block">내 메일함</span>
          </Button>
        </Link>

        <Link href="/mypage"> 
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 font-medium cursor-pointer">
            <User className="w-4 h-4" />
            <span className="hidden md:inline-block">마이페이지</span>
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 cursor-pointer">
              <Shield className="w-4 h-4" />
              <span className="hidden md:inline-block">관리자</span>
            </Button>
          </Link>
        )}

        <ThemeToggle />
        
        {session ? (
          <LogoutButton />
        ) : (
          <Link href="/login">
            <Button variant="ghost" size="sm" className="cursor-pointer">로그인</Button>
          </Link>
        )}
      </div>
    </header>
  );
}