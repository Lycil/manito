"use client";

import { usePathname } from "next/navigation";

export default function DashboardLayoutClient({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isMainPage = pathname === "/dashboard";

  return (
    <div className="flex w-full max-w-screen-2xl h-full bg-white dark:bg-zinc-900 shadow-2xl rounded-3xl overflow-hidden border border-gray-200 dark:border-zinc-800 transition-colors duration-300">
      {/* 사이드바 */}
      <aside
        className={`
          w-full md:w-80 bg-white dark:bg-zinc-900 border-r border-gray-200 dark:border-zinc-800 flex-col transition-colors
          ${isMainPage ? "flex" : "hidden md:flex"}
        `}
      >
        {sidebar}
      </aside>

      {/* 메인 콘텐츠 */}
      <main
        className={`
          flex-1 flex-col overflow-hidden bg-gray-50/50 dark:bg-zinc-950/50 transition-colors
          ${isMainPage ? "hidden md:flex" : "flex"}
        `}
      >
        {children}
      </main>
    </div>
  );
}