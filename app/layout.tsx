import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google"; // 구글 폰트 가져오기
import localFont from "next/font/local"
import "./globals.css";
import AuthProvider from "@/components/SessionProvider"; // 방금 만든 거 import

// 폰트 설정 (한글 예쁘게!)
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Manito - 스마트 가상 이메일",
  description: "개인정보 보호와 탄소 절감을 위한 스마트 이메일 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={pretendard.variable}>
        {/* 나중에 여기에 네비게이션 바(헤더)를 넣으면 좋아 */}
        <main className="min-h-screen bg-gray-50 text-gray-900">
          <AuthProvider>{children}</AuthProvider>
        </main>
      </body>
    </html>
  );
}