import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import VirtualAddress from "@/models/VirtualAddress";
import Email from "@/models/Email";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    const adminEmails = (process.env.ADMIN_EMAILS || "").split(",");

    // 보안 체크
    if (!session || !session.user?.email || !adminEmails.includes(session.user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await dbConnect();

    // 데이터 집계
    const [userCount, addressCount, emailCount, recentEmails, allUsers] = await Promise.all([
      User.countDocuments(),                 // 총 회원 수
      VirtualAddress.countDocuments(),       // 총 가상 주소 수
      Email.countDocuments(),                // 총 수신 메일 수
      Email.find()
        .sort({ receivedAt: -1 })
        .limit(100)
        .populate("owner", "name email")     // 메일 주인 정보
        .lean(),
      User.find().sort({ createdAt: -1 }).select("name email createdAt").lean(),
    ]);

    return NextResponse.json({
      counts: {
        users: userCount,
        addresses: addressCount,
        emails: emailCount,
      },
      recentEmails,
      allUsers,
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}