import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Inbox, RefreshCcw, ArrowLeft } from "lucide-react";

import dbConnect from "@/lib/dbConnect";
import VirtualAddress from "@/models/VirtualAddress";
import Email from "@/models/Email";
import TestMailButton from "@/components/TestMailButton";
import EmailDetailModal from "@/components/EmailDetailModal";
import RefreshButton from "@/components/RefreshButton";

export default async function DashboardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const { id } = await params;

  await dbConnect();

  const selectedAddress = await VirtualAddress.findOne({ 
    _id: id, 
    owner: session.user.id 
  });

  if (!selectedAddress) {
    notFound();
  }

  const mails = await Email.find({ toAddress: selectedAddress.fullAddress })
    .sort({ receivedAt: -1 });

  return (
    <div className="relative h-full">
      <div className="absolute inset-0 overflow-y-auto">
        {/* 헤더 */}
        <header className={`
          sticky top-4 z-20 mx-4 mt-4 rounded-2xl border px-4 h-16 shrink-0
          flex items-center justify-between shadow-sm transition-all
          bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md
          border-gray-200/50 dark:border-zinc-800/50
        `}>
          <div className="flex items-center gap-2 overflow-hidden">
            
            <Link href="/dashboard" className="md:hidden mr-1">
              <Button variant="ghost" size="icon" className="-ml-2">
                <ArrowLeft className="h-5 w-5 dark:text-gray-200" />
              </Button>
            </Link>

            <h2 className="text-base md:text-lg font-bold text-gray-800 dark:text-gray-100 truncate max-w-[150px] md:max-w-none">
              {selectedAddress.fullAddress}
            </h2>
            <Badge variant="outline" className="text-xs whitespace-nowrap hidden sm:inline-flex dark:text-gray-300 dark:border-zinc-700 bg-transparent">
              {mails.length}개의 메일
            </Badge>
          </div>
          <div className="flex items-center">
            <RefreshButton />
          </div>
        </header>

        {/* 메일 리스트 */}
        <div className="p-4 space-y-3 pb-10">
          {mails.length > 0 ? (
            mails.map((mail) => (
              <EmailDetailModal 
                key={mail._id.toString()}
                mail={{
                  _id: mail._id.toString(),
                  subject: mail.subject,
                  fromAddress: mail.fromAddress,
                  receivedAt: mail.receivedAt.toISOString(),
                  summary: mail.summary,
                  text: mail.text,
                }}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400 dark:text-zinc-600">
              <Inbox className="w-16 h-16 mb-4 opacity-20" />
              <p className="text-center">아직 도착한 메일이 없습니다.</p>
              
              <div className="mt-6">
                <TestMailButton addressId={id} />
              </div>
              
              <p className="text-xs mt-4 text-gray-400 dark:text-zinc-600 text-center px-4 break-keep">
                * 위 버튼을 누르면 테스트용 가짜 메일이 발송됩니다.
              </p>
            </div>
          )}
          
          {mails.length > 0 && (
              <div className="pt-4 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
                <TestMailButton addressId={id} />
              </div>
          )}
        </div>
      </div>
    </div>
  );
}