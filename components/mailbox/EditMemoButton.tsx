"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  addressId: string;
  currentMemo: string;
}

export default function EditMemoButton({ addressId, currentMemo }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [memo, setMemo] = useState(currentMemo);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

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
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
        onClick={(e) => {
          e.preventDefault(); 
          e.stopPropagation();
          setIsOpen(true);
        }}
        title="메모 수정"
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="bg-white dark:bg-zinc-950 dark:border-zinc-800 rounded-3xl"
          onClick={(e) => e.stopPropagation()} 
        >
          <DialogHeader>
            <DialogTitle className="dark:text-gray-100">메모 수정</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="memo" className="text-right dark:text-gray-300">
                메모
              </Label>
              <Input
                id="memo"
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                className="col-span-3 dark:bg-zinc-900 dark:border-zinc-700 dark:text-gray-100"
                maxLength={20}
                placeholder="예: 쇼핑몰용"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={(e) => {
                 e.stopPropagation();
                 setIsOpen(false);
              }}
              className="dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700 dark:hover:bg-zinc-700"
            >
              취소
            </Button>
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "저장 중..." : "저장"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}