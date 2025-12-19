"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Calendar, X } from "lucide-react";
import DeleteEmailButton from "./DeleteEmailButton"; // 삭제 버튼 재사용
import { useState } from "react";

// 메일 데이터 타입 정의 (부모로부터 받을 데이터)
interface EmailData {
  _id: string;
  subject: string;
  fromAddress: string;
  receivedAt: string; // 직렬화를 위해 string으로 받음
  summary?: string;
  text?: string;
}

export default function EmailDetailModal({ mail }: { mail: EmailData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* 🟢 1. 트리거: 클릭할 대상 (기존 메일 카드 디자인) */}
      <DialogTrigger asChild>
        <Card className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-transparent hover:border-l-primary mb-3">
          <CardHeader className="flex flex-row items-start justify-between p-3 pb-1">
            <div className="flex flex-col gap-0.5 overflow-hidden mr-2 text-left">
              <CardTitle className="text-base md:text-lg font-bold truncate text-gray-900">
                {mail.subject}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm truncate text-gray-500">
                {mail.fromAddress}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] md:text-xs text-gray-400 whitespace-nowrap">
                {new Date(mail.receivedAt).toLocaleDateString()}
              </span>
              {/* 삭제 버튼 클릭 시 모달이 열리지 않게 이벤트 전파 방지는 DeleteButton 내부에서 처리됨 */}
              <DeleteEmailButton emailId={mail._id} />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-left">
            {mail.summary ? (
              <div className="bg-indigo-50 p-2.5 rounded-md text-sm text-indigo-900 whitespace-pre-line mt-1.5">
                <span className="font-bold flex items-center gap-1 mb-1 text-xs text-indigo-700">
                  <Bot className="w-3 h-3" /> AI 요약
                </span>
                <span className="line-clamp-2">{mail.summary}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-600 line-clamp-2 mt-1.5">
                {mail.text?.substring(0, 100)}...
              </p>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>

      {/* 🔵 2. 컨텐츠: 팝업 상세 내용 */}
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs text-gray-500">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(mail.receivedAt).toLocaleString()}
            </Badge>
          </div>
          <DialogTitle className="text-2xl font-bold leading-tight mb-2">
            {mail.subject}
          </DialogTitle>
          <div className="flex items-center text-sm text-gray-600 bg-gray-50 p-2 rounded-md">
            <User className="w-4 h-4 mr-2 opacity-70" />
            보낸 사람: <span className="font-semibold ml-1 text-gray-900">{mail.fromAddress}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* AI 요약 강조 섹션 */}
          {mail.summary && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-indigo-700 flex items-center gap-2 mb-3">
                <Bot className="w-5 h-5" /> AI 3줄 요약
              </h3>
              <div className="text-indigo-900 leading-relaxed whitespace-pre-line">
                {mail.summary}
              </div>
            </div>
          )}

          {/* 메일 본문 섹션 */}
          <div className="space-y-2">
            <h3 className="font-semibold text-gray-900 text-lg border-b pb-2">메일 본문</h3>
            <div className="text-gray-700 leading-relaxed whitespace-pre-wrap min-h-[100px] p-2">
              {mail.text || "본문 내용이 없습니다."}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}