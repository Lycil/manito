"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CreateAddressButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const createAddress = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/virtual-address", { method: "POST" });
      
      // 응답을 JSON으로 받기
      const data = await res.json();

      if (res.ok) {
        router.refresh(); // 성공 시 새로고침
      } else {
        // 실패 시 API가 보내준 에러 메시지(data.error)를 띄움
        alert(data.error || "주소 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      className="w-full mb-4" 
      variant="default" 
      onClick={createAddress} 
      disabled={isLoading}
    >
      <Plus className="mr-2 h-4 w-4" /> 
      {isLoading ? "생성 중..." : "새 주소 만들기 (최대 10개)"}
    </Button>
  );
}