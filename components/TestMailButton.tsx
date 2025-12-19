"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react"; // 아이콘
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  addressId: string;
}

export default function TestMailButton({ addressId }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const sendTestMail = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/test-mail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId }),
      });

      if (res.ok) {
        router.refresh(); // 메일함 새로고침
      } else {
        alert("테스트 메일 발송 실패");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      variant="secondary" 
      onClick={sendTestMail} 
      disabled={isLoading}
    >
      <Send className="mr-2 h-4 w-4" />
      {isLoading ? "전송 중..." : "가짜 메일 보내기 (테스트)"}
    </Button>
  );
}