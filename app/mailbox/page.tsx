import { Mail } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-zinc-600 p-4 text-center">
      <Mail className="w-16 h-16 md:w-20 md:h-20 mb-6 opacity-10 text-primary" />
      <p className="text-lg font-medium text-gray-600 dark:text-gray-400 break-keep">
        왼쪽 목록에서 주소를 선택해 주세요.
      </p>
    </div>
  );
}