"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Mail, MapPin } from "lucide-react";

import SiteHeader from "@/components/layout/SiteHeader"; 

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      if (res.status === 403) {
        alert("관리자 권한이 없습니다.");
        router.push("/");
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error("데이터 로딩 실패:", error);
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetchStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex flex-col h-screen bg-gray-100 dark:bg-zinc-950 items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-zinc-950 overflow-hidden items-center transition-colors duration-300">
      
      <SiteHeader session={session} />

      <div className="flex-1 w-full max-w-screen-2xl overflow-y-auto p-4 pt-24">
        
        <div className="max-w-6xl mx-auto space-y-8 pb-10">
          <h1 className="text-3xl font-bold mb-6 dark:text-gray-100 pl-2">관리자 대시보드</h1>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="dark:bg-zinc-900 dark:border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-gray-200">총 회원 수</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-gray-100">{stats?.counts?.users || 0}명</div>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-zinc-900 dark:border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-gray-200">생성된 주소</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-gray-100">{stats?.counts?.addresses || 0}개</div>
              </CardContent>
            </Card>
            
            <Card className="dark:bg-zinc-900 dark:border-zinc-800">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium dark:text-gray-200">수신된 메일</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold dark:text-gray-100">{stats?.counts?.emails || 0}통</div>
              </CardContent>
            </Card>
          </div>

          <Card className="dark:bg-zinc-900 dark:border-zinc-800">
            <CardHeader>
              <CardTitle className="dark:text-gray-100">최근 수신 로그 (실시간)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border rounded-md dark:border-zinc-700 overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="p-3">시간</th>
                      <th className="p-3">수신 주소</th>
                      <th className="p-3">보낸 사람</th>
                      <th className="p-3">제목</th>
                      <th className="p-3">주인</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-zinc-800">
                    {stats?.recentEmails && stats.recentEmails.length > 0 ? (
                      stats.recentEmails.map((email: any) => (
                        <tr key={email._id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                          <td className="p-3 text-gray-500 dark:text-gray-400">
                            {new Date(email.receivedAt).toLocaleString('ko-KR')}
                          </td>
                          <td className="p-3 font-medium text-indigo-600 dark:text-indigo-400">
                            {email.toAddress}
                          </td>
                          <td className="p-3 dark:text-gray-300">{email.fromAddress}</td>
                          <td className="p-3 truncate max-w-[200px] dark:text-gray-300">
                            {email.subject}
                          </td>
                          <td className="p-3 text-gray-500 dark:text-gray-400">
                            {email.owner?.name || "알수없음"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-gray-500">
                          아직 수신된 메일이 없습니다.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}