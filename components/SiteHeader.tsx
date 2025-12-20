import Link from "next/link";
import Image from "next/image";
import { Mail, Shield } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import LogoutButton from "@/components/LogoutButton";
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
      z-50 w-[calc(100%-1.5rem)] max-w-6xl h-16 px-6 
      rounded-full flex items-center justify-between transition-all 
      backdrop-blur-md shadow-lg
      bg-white/75 dark:bg-zinc-950/70
      border border-gray-200 dark:border-zinc-800
    ">
      <div className="flex items-center gap-6">
        <Link href="/" className="text-2xl font-bold flex items-center gap-2 dark:text-gray-100 cursor-pointer">
          <Image src="/icon.png" height={30} width={30} alt="Manito" /> Manito
        </Link>

        
        <Link href="/mailbox" className="hidden md:block"> 
          <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 font-medium">
            <Mail className="w-4 h-4 mr-2" />
            내 메일함
          </Button>
        </Link>
      </div>
      
      <div className="flex items-center gap-2">
        {isAdmin && (
          <Link href="/admin">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300">
              <Shield className="w-4 h-4 mr-1" />
              관리자
            </Button>
          </Link>
        )}

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