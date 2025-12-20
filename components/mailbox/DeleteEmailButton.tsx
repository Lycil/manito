"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  emailId: string;
}

export default function DeleteEmailButton({ emailId }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // 카드 클릭 이벤트가 있다면 방지

    if (!confirm("정말 이 메일을 삭제하시겠습니까?")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/email?id=${emailId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh(); // 목록 새로고침
      } else {
        alert("메일 삭제에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}