"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  addressId: string;
  currentMemo: string;
}

export default function EditMemoButton({ addressId, currentMemo }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [memo, setMemo] = useState(currentMemo);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/virtual-address", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: addressId, memo }),
      });

      if (res.ok) {
        setIsOpen(false);
        router.refresh(); // 목록 새로고침
      } else {
        alert("수정에 실패했습니다.");
      }
    } catch (error) {
      console.error(error);
      alert("오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsOpen(true);
          }}
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      
      {/* 팝업 내용 */}
      <DialogContent 
        onClick={(e) => e.stopPropagation()} 
        className="sm:max-w-[425px]"
      >
        <DialogHeader>
          <DialogTitle>메모 수정</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="memo">메모 내용</Label>
            <Input
              id="memo"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              placeholder="예: 쇼핑몰 가입용"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>취소</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}