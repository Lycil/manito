"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, User, Calendar, AlertCircle, Tag, Info, CheckCircle2, Mail } from "lucide-react";
import DeleteEmailButton from "./DeleteEmailButton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface EmailData {
  _id: string;
  subject: string;
  fromAddress: string;
  receivedAt: string;
  summary?: string;
  text?: string;
  html?: string;
  isImportant?: boolean;
  category?: string;
  importanceReason?: string;
  isRead?: boolean;
}

function cleanEmailText(text: string | undefined) {
  if (!text) return "";
  return text
    .replace(/\[.*?\]/g, "") 
    .replace(/>/g, "")       
    .replace(/https?:\/\/\S+/g, "") 
    .replace(/\s+/g, " ")    
    .trim();                 
}

export default function EmailDetailModal({ mail }: { mail: EmailData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isRead, setIsRead] = useState(mail.isRead || false);
  const router = useRouter();

  const previewText = cleanEmailText(mail.text);

  const handleOpenChange = async (open: boolean) => {
    setIsOpen(open);

    if (open && !isRead) {
      setIsRead(true);

      try {
        // 읽음 처리
        const res = await fetch(`/api/email/${mail._id}/read`, {
          method: "PATCH",
        });

        if (res.ok) {
          router.refresh(); 
        }
      } catch (error) {
        console.error("읽음 처리 중 에러 발생:", error);
      }
    }
  };
  const markAsUnread = async (e: React.MouseEvent) => {
    e.stopPropagation();

    setIsRead(false);
    setIsOpen(false);

    try {
      const res = await fetch(`/api/email/${mail._id}/unread`, {
        method: "PATCH",
      });

      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.error("읽지 않음 처리 실패", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Card className={`
          hover:shadow-md transition-all cursor-pointer py-2 gap-1 border-l-4 
          border-l-transparent hover:border-l-primary dark:hover:border-l-primary
          ${!isRead ? "bg-white dark:bg-zinc-900 shadow-sm" : "bg-gray-50/50 dark:bg-zinc-900/40 opacity-90"}
          border-gray-200 dark:border-zinc-800
        `}>
          <CardHeader className="flex flex-row items-start justify-between p-3 pb-1">
            <div className="flex flex-col gap-1 overflow-hidden mr-2 text-left w-full">

              <div className="flex flex-wrap gap-1.5 mb-1 items-center">
                {!isRead && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse mr-1" title="읽지 않음" />
                )}

                <Badge 
                  variant={mail.isImportant ? "destructive" : "secondary"} 
                  className={`
                    h-5 px-1.5 text-[10px] font-normal flex items-center gap-0.5
                    ${!mail.isImportant && "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700"}
                  `}
                >
                  {mail.isImportant ? (
                    <><AlertCircle className="w-3 h-3" /> 중요도 높음</>
                  ) : (
                    <><CheckCircle2 className="w-3 h-3 opacity-70" /> 일반 메일</>
                  )}
                </Badge>

                {mail.category && (
                  <Badge variant="outline" className="h-5 px-1.5 text-[10px] font-normal text-indigo-600 dark:text-indigo-300 border-indigo-100 dark:border-indigo-900 bg-indigo-50 dark:bg-indigo-950/30">
                    <Tag className="w-3 h-3 mr-0.5 opacity-70" /> {mail.category}
                  </Badge>
                )}
              </div>

              <CardTitle className={`
                text-base md:text-xl truncate text-gray-900 dark:text-gray-100 w-full
                ${!isRead ? "font-bold" : "font-medium text-gray-800 dark:text-gray-300"}
              `}>
                {mail.subject}
              </CardTitle>
              <CardDescription className="text-xs md:text-sm truncate text-gray-500 dark:text-gray-400">
                {mail.fromAddress}
              </CardDescription>
            </div>
            
            <div className="flex flex-col items-end gap-1 shrink-0">
              <span suppressHydrationWarning className="text-[10px] md:text-xs text-gray-400 dark:text-zinc-500 whitespace-nowrap">
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
              <p className={`
                text-sm line-clamp-2 mt-1.5 break-all
                ${!isRead ? "text-gray-800 dark:text-gray-300 font-medium" : "text-gray-500 dark:text-gray-500"}
              `}>
                {previewText.substring(0, 100) || "내용 없음"}...
              </p>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-5xl w-[95vw] md:w-full h-[90vh] flex flex-col p-0 overflow-hidden bg-white dark:bg-zinc-950 dark:border-zinc-800 rounded-3xl">
        <DialogHeader className="p-6 pb-4 border-b dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs text-gray-500 dark:text-gray-400 dark:border-zinc-700">
              <Calendar className="w-3 h-3 mr-1" />
              {new Date(mail.receivedAt).toLocaleString()}
            </Badge>
            {mail.category && (
              <Badge variant="secondary" className="text-xs dark:bg-zinc-800">
                {mail.category}
              </Badge>
            )}
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={markAsUnread}
              className="h-7 text-xs text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              읽지 않음 표시
            </Button>
          </div>

          <DialogTitle className="text-2xl font-bold leading-tight mb-2 text-gray-900 dark:text-gray-100">
            {mail.subject}
          </DialogTitle>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-zinc-900 p-2 rounded-md border border-transparent dark:border-zinc-800 w-fit">
            <User className="w-4 h-4 mr-2 opacity-70" />
            보낸 사람: <span className="font-semibold ml-1 text-gray-900 dark:text-gray-100">{mail.fromAddress}</span>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 pt-3 scrollbar-hide">
          <div className="space-y-6">
            {/* AI 분석 */}
            {(mail.summary || mail.importanceReason) && (
              <div className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 rounded-lg p-5 shadow-sm">
                <h3 className="font-bold text-indigo-700 dark:text-indigo-300 flex items-center gap-2 mb-4 text-lg">
                  <Bot className="w-5 h-5" /> AI 분석
                </h3>

                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge variant={mail.isImportant ? "destructive" : "secondary"} className={`text-sm py-1 px-3 ${!mail.isImportant && "bg-gray-200 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-300"}`}>
                      {mail.isImportant ? (
                        <><AlertCircle className="w-3.5 h-3.5 mr-1.5" /> 중요도 높음</>
                      ) : (
                        <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> 일반 메일</>
                      )}
                    </Badge>
                    
                    {mail.category && (
                      <Badge variant="outline" className="text-sm py-1 px-3 bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                        <Tag className="w-3.5 h-3.5 mr-1.5" /> {mail.category}
                      </Badge>
                    )}
                  </div>

                  {mail.importanceReason && (
                    <div className="flex items-start gap-2 text-sm bg-white/60 dark:bg-black/20 p-3 rounded-md border border-indigo-100/50 dark:border-indigo-900/30">
                      <Info className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                      <span className="text-indigo-900 dark:text-indigo-200 leading-snug">
                        <span className="font-semibold mr-1">AI 판단:</span>
                        {mail.importanceReason}
                      </span>
                    </div>
                  )}

                  {mail.summary && (
                    <div className="text-indigo-900 dark:text-indigo-100 leading-relaxed whitespace-pre-line pl-1">
                      {mail.summary}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              {mail.html ? (
                <div 
                  className="
                    prose max-w-none p-6 rounded-lg border bg-white text-black overflow-x-auto
                    [&_img]:max-w-full [&_img]:h-auto
                    [&_table]:w-full [&_table]:max-w-full
                  "
                  dangerouslySetInnerHTML={{ __html: mail.html }} 
                />
              ) : (
                <div className="text-gray-700 dark:text-gray-300 leading-relaxed min-h-[100px] p-2 whitespace-pre-wrap">
                  {mail.text || "본문 내용이 없습니다."}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}