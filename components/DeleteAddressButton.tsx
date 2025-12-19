"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  addressId: string;
}

export default function DeleteAddressButton({ addressId }: Props) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("정말 이 가상 주소를 삭제하시겠습니까?\n이 주소로 더 이상 메일을 받을 수 없습니다.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/virtual-address?id=${addressId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        router.refresh(); // 목록 새로고침
      } else {
        alert("삭제에 실패했습니다.");
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
      className="text-red-400 hover:text-red-600 hover:bg-red-50"
      onClick={handleDelete}
      disabled={isDeleting}
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}