import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import SiteHeader from "@/components/layout/SiteHeader";
import dbConnect from "@/lib/dbConnect";
import VirtualAddress from "@/models/VirtualAddress";
import CreateAddressButton from "@/components/mailbox/CreateAddressButton";
import SidebarItem from "@/components/mailbox/SidebarItem";
import DashboardLayoutClient from "@/components/mailbox/DashboardLayoutClient";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  await dbConnect();
  const addresses = await VirtualAddress.find({ owner: session.user.id }).sort({ createdAt: -1 });

  // 사이드바
  const sidebarContent = (
    <>
      <div className="p-6 border-b border-gray-200 dark:border-zinc-800">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {session.user?.name} 님의 메일함
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <CreateAddressButton />
        
        {addresses.map((addr) => (
          <SidebarItem 
            key={addr._id.toString()} 
            addr={{
              _id: addr._id.toString(),
              fullAddress: addr.fullAddress,
              isActive: addr.isActive,
              memo: addr.memo
            }} 
          />
        ))}

        {addresses.length === 0 && (
          <div className="text-center text-gray-400 dark:text-gray-600 py-10 text-sm">
            주소를 먼저 생성해 주세요.
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-zinc-950 overflow-hidden items-center transition-colors duration-300">
      <SiteHeader session={session} />
      <div className="flex-1 w-full max-w-screen-2xl overflow-hidden p-4 pt-4">
        <DashboardLayoutClient sidebar={sidebarContent}>
           {children}
        </DashboardLayoutClient>
      </div>
    </div>
  );
}