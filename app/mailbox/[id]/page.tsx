import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from "lucide-react";

import dbConnect from "@/lib/dbConnect";
import VirtualAddress from "@/models/VirtualAddress";
import Email from "@/models/Email";
import RefreshButton from "@/components/mailbox/RefreshButton";
import AddressCopyButton from "@/components/mailbox/AddressCopyButton";
import MailList from "@/components/mailbox/MailList";

export const dynamic = "force-dynamic"; 

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

  const rawMails = await Email.find({ toAddress: selectedAddress.fullAddress })
    .sort({ receivedAt: -1 });

  const plainMails = rawMails.map((mail) => ({
    _id: mail._id.toString(),
    subject: mail.subject,
    fromAddress: mail.fromAddress,
    receivedAt: mail.receivedAt.toISOString(),
    summary: mail.summary,
    text: mail.text,
    html: mail.html,
    isImportant: mail.isImportant,
    category: mail.category,
    importanceReason: mail.importanceReason,
    isRead: mail.isRead,
  }));

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
            <Link href="/mailbox" className="md:hidden mr-1">
              <Button variant="ghost" size="icon" className="-ml-2">
                <ArrowLeft className="h-5 w-5 dark:text-gray-200" />
              </Button>
            </Link>

            <AddressCopyButton address={selectedAddress.fullAddress} />
            <Badge variant="outline" className="text-xs whitespace-nowrap hidden sm:inline-flex dark:text-gray-300 dark:border-zinc-700 bg-transparent">
              {plainMails.length}개의 메일
            </Badge>
          </div>
          <div className="flex items-center">
            <RefreshButton />
          </div>
        </header>

        <MailList mails={plainMails} addressId={id} />
        
      </div>
    </div>
  );
}