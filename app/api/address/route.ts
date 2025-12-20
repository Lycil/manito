import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import VirtualAddress from "@/models/VirtualAddress";
import Email from "@/models/Email";

export async function DELETE(request: Request) {
  try {
    // 로그인 체크
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // URL에서 삭제할 주소 ID 가져옴
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Address id is required" }, { status: 400 });
    }

    await dbConnect();

    // 내 주소가 맞는지 확인하고 삭제할정보 찾음
    const targetAddress = await VirtualAddress.findOne({
      _id: id,
      owner: session.user.id,
    });

    if (!targetAddress) {
      return NextResponse.json({ error: "Address not found or unauthorized" }, { status: 404 });
    }

    // 해당 가상 주소로 수신된 모든 메일도 같이 삭제
    await Email.deleteMany({ toAddress: targetAddress.fullAddress });

    // 진짜 주소 삭제
    await VirtualAddress.findByIdAndDelete(id);

    return NextResponse.json({ message: "Address and related emails deleted" });

  } catch (error) {
    console.error("Delete Address Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}