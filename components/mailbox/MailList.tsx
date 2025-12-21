"use client";

import { useState } from "react";
import { Inbox, Filter, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmailDetailModal from "@/components/mailbox/EmailDetailModal";
import TestMailButton from "@/components/mailbox/TestMailButton";

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

interface MailListProps {
  mails: EmailData[];
  addressId: string;
}

export default function MailList({ mails, addressId }: MailListProps) {
  const [showImportantOnly, setShowImportantOnly] = useState(false);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredMails = mails.filter((mail) => {
    if (showImportantOnly && !mail.isImportant) return false;
    if (showUnreadOnly && mail.isRead) return false;
    return true;
  });

  return (
    <div className="p-4 space-y-3 pb-20">
      
      {mails.length > 0 && (
        <div className="flex justify-end mb-2 px-1 gap-2">
          
          <Button
            variant={showUnreadOnly ? "secondary" : "outline"}
            size="sm"
            onClick={() => setShowUnreadOnly(!showUnreadOnly)}
            className={`h-8 text-xs gap-1.5 transition-all shadow-sm ${showUnreadOnly ? "font-bold bg-slate-200 dark:bg-slate-700" : ""}`}
          >
            <Mail className="w-3.5 h-3.5" />
            안 읽은 메일
          </Button>

          <Button
            variant={showImportantOnly ? "destructive" : "outline"}
            size="sm"
            onClick={() => setShowImportantOnly(!showImportantOnly)}
            className="h-8 text-xs gap-1.5 transition-all shadow-sm"
          >
            <Filter className="w-3.5 h-3.5" />
            중요 메일
          </Button>
        </div>
      )}

      {filteredMails.length > 0 ? (
        filteredMails.map((mail) => (
          <EmailDetailModal 
            key={mail._id}
            mail={mail}
          />
        ))
      ) : (
        <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400 dark:text-zinc-600">
          <Inbox className="w-16 h-16 mb-4 opacity-20" />
          <p className="text-center font-medium">
            {(showImportantOnly || showUnreadOnly)
              ? "조건에 맞는 메일이 없습니다." 
              : "아직 도착한 메일이 없습니다."}
          </p>
          
          {/* {!showImportantOnly && !showUnreadOnly && mails.length === 0 && (
            <>
              <div className="mt-6">
                <TestMailButton addressId={addressId} />
              </div>
              <p className="text-xs mt-4 text-gray-400 dark:text-zinc-600 text-center px-4 break-keep">
                * 위 버튼을 누르면 테스트용 가짜 메일이 발송됩니다.
              </p>
            </>
          )} */}
        </div>
      )}

      {/* {mails.length > 0 && (
          <div className="pt-8 flex justify-center opacity-40 hover:opacity-100 transition-opacity">
            <TestMailButton addressId={addressId} />
          </div>
      )} */}
    </div>
  );
}