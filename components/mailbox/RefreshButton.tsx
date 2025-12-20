"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("자동 새로고침");
      router.refresh();
      
      setIsSpinning(true);
      setTimeout(() => setIsSpinning(false), 500);
    }, 10000);

    return () => clearInterval(interval);
  }, [router]);

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