import type { Metadata } from "next";
import localFont from "next/font/local"
import "./globals.css";
import AuthProvider from "@/components/SessionProvider";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from "nextjs-toploader";

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
    <html lang="ko" suppressHydrationWarning>
      <body className={pretendard.variable}>
        <NextTopLoader
          color="#6366f1"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px #6366f1,0 0 5px #6366f1"
        />

        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-gray-100 transition-colors">
            <AuthProvider>
              {children}
            </AuthProvider>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}