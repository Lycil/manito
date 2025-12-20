"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Calendar } from "lucide-react";
import DeleteEmailButton from "./DeleteEmailButton";
import { useState } from "react";

// 메일 데이터 타입 정의
interface EmailData {
  _id: string;
  subject: string;
  fromAddress: string;
  receivedAt: string;
  summary?: string;
  text?: string;
}

export default function EmailDetailModal({ mail }: { mail: EmailData }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {/* 리스트 */}
      <DialogTrigger asChild>
        <Card className={`
          hover:shadow-md transition-all cursor-pointer mb-3 border-l-4 border-l-transparent hover:border-l-primary
          bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800
        `}>
          <CardHeader className="flex flex-row items-start justify-between p-3 pb-1">
            <div className="flex flex-col gap-0.5 overflow-hidden mr-2 text-left">
              <CardTitle className="text-base md:text-lg font-bold truncate text-gray-900 dark:text-gray-100">
                {mail.subject}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm truncate text-gray-500 dark:text-gray-400">
                {mail.fromAddress}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span className="text-[10px] md:text-xs text-gray-400 dark:text-zinc-500 whitespace-nowrap">
                {new Date(mail.receivedAt).toLocaleDateString()}
              </span>
              <DeleteEmailButton emailId={mail._id} />
            </div>
          </CardHeader>
          <CardContent className="p-3 pt-0 text-left">
            {mail.summary ? (
              <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2.5 rounded-md text-sm text-indigo-900 dark:text-indigo-200 whitespace-pre-line mt-1.5 transition-colors">
                <span className="font-bold flex items-center gap-1 mb-1 text-xs text-indigo-700 dark:text-indigo-300">
                  <Bot className="w-3 h-3" /> AI 요약
                </span>
                <span className="line-clamp-2 opacity-90">{mail.summary}</span>
              </div>
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1.5">
                {mail.text?.substring(0, 100)}...
              </p>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>

      {/* 모달 */}
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-zinc-950 dark:border-zinc-800">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400 dark:border-zinc-700">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(mail.receivedAt).toLocaleString()}
            </Badge>
          </div>

          <DialogTitle className="text-2xl font-bold leading-tight mb-2 text-gray-900 dark:text-gray-100">
            {mail.subject}
          </DialogTitle>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-zinc-900 p-2 rounded-md border border-transparent dark:border-zinc-800">
            <User className="w-4 h-4 mr-2 opacity-70" />
            보낸 사람: <span className="font-semibold ml-1 text-gray-900 dark:text-gray-100">{mail.fromAddress}</span>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {mail.summary && (
            <div className="bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-900/50 rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2 mb-3">
                <Bot className="w-5 h-5" /> AI 3줄 요약
              </h3>
              <div className="text-indigo-900 dark:text-indigo-100 leading-relaxed whitespace-pre-line">
                {mail.summary}
              </div>
            </div>
          )}

          {/* 메일 본문 섹션 */}
          <div className="space-y-2">
            <div className="text-gray-700 dark:text-gray-300 leading-relaxed min-h-[100px] p-2">
              {mail.text || "본문 내용이 없습니다."}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}