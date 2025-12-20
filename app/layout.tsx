import type { Metadata } from "next";
import localFont from "next/font/local"
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";

// Pretendard 폰트
const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "Manito - 스마트 가상 이메일",
  description: "개인정보 보호와 탄소 절감을 위한 스마트 이메일 서비스",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={pretendard.variable}>
        <main className="min-h-screen bg-gray-50 text-gray-900">
          <AuthProvider>{children}</AuthProvider>
        </main>
      </body>
    </html>
  );
}