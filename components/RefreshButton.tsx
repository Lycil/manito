"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function RefreshButton() {
  const router = useRouter();
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefresh = () => {
    setIsSpinning(true);
    router.refresh(); // 서버 컴포넌트 다시 실행

    setTimeout(() => setIsSpinning(false), 500);
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleRefresh}
      className="dark:text-gray-400 hover:bg-black/5 dark:hover:bg-white/10"
    >
      <RefreshCcw className={`h-4 w-4 transition-transform ${isSpinning ? "animate-spin" : ""}`} />
    </Button>
  );
}