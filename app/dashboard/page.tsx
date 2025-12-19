import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Inbox, RefreshCcw, ArrowLeft } from "lucide-react";

import dbConnect from "@/lib/dbConnect";
import VirtualAddress from "@/models/VirtualAddress";
import Email from "@/models/Email";
import TestMailButton from "@/components/TestMailButton";
import CreateAddressButton from "@/components/CreateAddressButton";
import DeleteAddressButton from "@/components/DeleteAddressButton";
import EmailDetailModal from "@/components/EmailDetailModal"; 
import EditMemoButton from "@/components/EditMemoButton";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();

  const addresses = await VirtualAddress.find({ owner: session.user.id }).sort({ createdAt: -1 });

  const params = await searchParams;
  const selectedId = params.id;
  
  let selectedAddress = null;
  let mails = [];

  if (selectedId) {
    selectedAddress = await VirtualAddress.findOne({ 
      _id: selectedId, 
      owner: session.user.id 
    });

    if (selectedAddress) {
      mails = await Email.find({ toAddress: selectedAddress.fullAddress })
        .sort({ receivedAt: -1 });
    }
  }

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden justify-center">

      <div className="flex w-full max-w-screen-2xl h-full bg-white shadow-2xl overflow-hidden border-x border-gray-200">
        
        {/* 왼쪽 사이드바 */}
        <aside className={`
          w-full md:w-80 bg-white border-r flex-col
          ${selectedId ? 'hidden md:flex' : 'flex'} 
        `}>
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Mail className="text-primary" /> Manito
              </h1>
              {/* 로그아웃 버튼 */}
              <LogoutButton />
            </div>
            <p className="text-sm text-gray-500">{session.user?.name} 님의 메일함</p>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            <CreateAddressButton />

            {addresses.map((addr) => {
              const isSelected = addr._id.toString() === selectedId;

              return (
                <Link 
                  href={`/dashboard?id=${addr._id.toString()}`} 
                  key={addr._id.toString()}
                >
                  <div 
                    className={`
                      p-3 rounded-lg border cursor-pointer transition-colors group relative mb-3
                      ${isSelected ? "bg-indigo-50 border-indigo-200" : "bg-white hover:bg-gray-50"}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`font-semibold text-sm truncate w-32 md:w-40 ${isSelected ? "text-indigo-700" : "text-gray-700"}`}>
                        {addr.fullAddress}
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <EditMemoButton 
                            addressId={addr._id.toString()} 
                            currentMemo={addr.memo || ""} 
                        />
                        <DeleteAddressButton addressId={addr._id.toString()} />
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 truncate">
                      {addr.memo || "메모 없음"}
                    </p>
                  </div>
                </Link>
              );
            })}
            
            {addresses.length === 0 && (
              <div className="text-center text-gray-400 py-10 text-sm">
                주소를 먼저 생성해 주세요.
              </div>
            )}
          </div>
        </aside>

        {/* 메인 컨테이너 */}
        <main className={`
          flex-1 flex-col overflow-hidden bg-gray-50/50
          ${selectedId ? 'flex' : 'hidden md:flex'}
        `}>
          
          {selectedAddress ? (
            <>
              <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-6 sticky top-0 z-10 shrink-0">
                <div className="flex items-center gap-2 overflow-hidden">
                  
                  <Link href="/dashboard" className="md:hidden mr-1">
                    <Button variant="ghost" size="icon" className="-ml-2">
                      <ArrowLeft className="h-5 w-5" />
                    </Button>
                  </Link>

                  <h2 className="text-base md:text-lg font-bold text-gray-800 truncate max-w-[150px] md:max-w-none">
                    {selectedAddress.fullAddress}
                  </h2>
                  <Badge variant="outline" className="text-xs whitespace-nowrap hidden sm:inline-flex">
                    {mails.length}개의 메일
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Button variant="ghost" size="icon"><RefreshCcw className="h-4 w-4" /></Button>
                </div>
              </header>

              <div className="flex-1 overflow-y-auto p-4 md:p-4 space-y-3">
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
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 py-10">
                    <Inbox className="w-16 h-16 mb-4 opacity-20" />
                    <p className="text-center">아직 도착한 메일이 없습니다.</p>
                    
                    <div className="mt-3">
                      <TestMailButton addressId={selectedId!} />
                    </div>
                    
                    <p className="text-xs mt-4 text-gray-400 text-center px-4 break-keep">
                      * 위 버튼을 누르면 테스트용 가짜 메일이 발송됩니다.
                    </p>
                  </div>
                )}
              </div>
              <TestMailButton addressId={selectedId!} /> 
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 p-4 text-center">
              <Mail className="w-16 h-16 md:w-20 md:h-20 mb-6 opacity-10 text-primary" />
              <p className="text-lg font-medium text-gray-600 break-keep">
                왼쪽 목록에서 주소를 선택해 주세요.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}