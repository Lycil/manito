import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { User, Mail, Shield, ArrowLeft } from "lucide-react";
import LogoutButton from "@/components/auth/LogoutButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import SiteHeader from "@/components/layout/SiteHeader";
import ProfileEditDialog from "@/components/auth/ProfileEditDialog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manito - 마이페이지",
};

export default async function MyPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { user } = session;

  return (
    <div className="
      min-h-screen bg-gray-50/50 dark:bg-zinc-950 
      p-4 md:p-8 
      pt-24 md:pt-28 
      flex flex-col items-center">
      
      <SiteHeader session={session} />

      <Card className="w-full max-w-md shadow-lg border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <CardHeader className="text-center pb-2 relative">
          <CardTitle className="text-xl font-bold">내 정보</CardTitle>
          <div className="absolute right-4 top-4">
            <ProfileEditDialog 
              currentName={user.name || ""} 
              currentEmail={user.email || ""} 
            />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 프사 */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gray-100 dark:border-zinc-800 shadow-sm">
              {user.image ? (
                <Image 
                  src={user.image} 
                  alt="Profile" 
                  fill 
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-400">
                  <User className="w-10 h-10" />
                </div>
              )}
            </div>
            
            <div className="text-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {user.name || "이름 없음"}
              </h2>
            </div>
          </div>

          <Separator className="bg-gray-100 dark:bg-zinc-800" />

          <div className="space-y-4">
            {/* 이메일 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800">
              <div className="bg-white dark:bg-zinc-800 p-2 rounded-md shadow-sm text-indigo-500">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">이메일</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* 닉네임 */}
            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800">
              <div className="bg-white dark:bg-zinc-800 p-2 rounded-md shadow-sm text-indigo-500">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">닉네임</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {user.name || "설정되지 않음"}
                </p>
              </div>
            </div>
            
            {/* 관리자 여부 */}
            {(process.env.ADMIN_EMAILS || "").includes(user.email || "") && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900">
                <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">
                  관리자 계정
                </span>
              </div>
            )}
          </div>

          <Separator className="bg-gray-100 dark:bg-zinc-800" />

          {/* 하단 버튼 */}
          <div className="flex flex-col gap-2">
            <div className="w-full">
               <div className="flex justify-center">
                 <LogoutButton />
               </div>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}