import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Bot, Leaf, ArrowRight, Mail } from "lucide-react";
import { getServerSession } from "next-auth"; 
import { authOptions } from "@/lib/authOptions";
import SiteHeader from "@/components/layout/SiteHeader"; 

export default async function Home() {
  const session = await getServerSession(authOptions); 

  return (
    <div className="h-screen bg-gray-100 dark:bg-zinc-950 flex flex-col items-center transition-colors duration-300 overflow-hidden">
      
      <SiteHeader session={session} />
      
      <main className="flex-1 w-full">
        <div className="flex flex-col items-center justify-center w-full">
          
          <section className="w-full py-24 lg:py-32 flex flex-col items-center text-center px-4 animate-in fade-in duration-500">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight lg:text-7xl mb-6 dark:text-gray-100">
              <div className="mb-3">개인정보 보호를 위한</div>
              <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
              스마트 메일
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed dark:text-gray-400">
              내 진짜 이메일은 숨기고, 
              <span className="font-semibold text-foreground dark:text-gray-200"> @manito.kr </span>
              이메일 주소를 사용해 보세요!<br />
              스팸은 차단하고 중요한 메일만 전달해 드립니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              {session ? (
                <div className="flex flex-col items-center gap-4">
                   <p className="text-xl font-bold text-primary">
                     반가워요, {session.user?.name} 님!
                   </p>
                   <Button asChild size="lg" className="text-lg h-12 px-12 shadow-lg rounded-full">
                    <Link href="/mailbox">
                      내 메일함 바로가기 <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              ) : (
                <Button asChild size="lg" className="text-lg h-12 px-12 shadow-lg rounded-full">
                  <Link href="/login">
                    <Mail className="mr-2 h-5 w-5" /> 지금 시작하기
                  </Link>
                </Button>
              )}
            </div>
          </section>

          <section className="w-full max-w-6xl px-4 py-20 grid md:grid-cols-3 gap-6">
            <Card className="border-2 rounded-3xl hover:border-primary/50 transition-colors shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-800">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mb-4 text-indigo-600 dark:text-indigo-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl dark:text-gray-100">개인정보 보호</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground dark:text-gray-400">
                나의 진짜 이메일 주소를 노출하지 마세요.
                Manito가 안전한 이메일 주소를 제공해 드립니다.
              </CardContent>
            </Card>

            <Card className="border-2 rounded-3xl hover:border-primary/50 transition-colors shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-800">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center mb-4 text-pink-600 dark:text-pink-400">
                  <Bot className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl dark:text-gray-100">이메일 자동 분석</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground dark:text-gray-400">
                이메일의 중요도를 분석하여 중요한 메일만 전달해 드립니다. 긴 메일 내용을 요약해서 한눈에 확인할 수도 있습니다.
              </CardContent>
            </Card>

            <Card className="border-2 rounded-3xl hover:border-primary/50 transition-colors shadow-sm bg-white dark:bg-zinc-900 dark:border-zinc-800">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                  <Leaf className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl dark:text-gray-100">디지털 탄소 절감</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground dark:text-gray-400">
                쌓여만 가는 스팸 메일은 서버 용량을 차지하며 탄소를 배출합니다.
                불필요한 메일은 일정 기간 후 자동으로 삭제하여 환경을 보호합니다.
              </CardContent>
            </Card>
          </section>
          
          <footer className="py-10 text-center text-sm text-muted-foreground dark:text-gray-500">
            © 2025 Manito Project. All rights reserved.
          </footer>
        </div>
      </main>
    </div>
  );
}