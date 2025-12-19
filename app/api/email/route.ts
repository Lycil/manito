import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Email from "@/models/Email";

export async function DELETE(request: Request) {
  try {
    // 1. 로그인 체크
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. URL에서 삭제할 메일 ID 가져오기 (?id=xxx)
    const { searchParams } = new URL(request.url);
    const emailId = searchParams.get("id");

    if (!emailId) {
      return NextResponse.json({ error: "Email ID is required" }, { status: 400 });
    }

    await dbConnect();

    // 3. 삭제 수행
    const deletedEmail = await Email.findOneAndDelete({
      _id: emailId,
      owner: session.user.id,
    });

    if (!deletedEmail) {
      return NextResponse.json({ error: "메일을 찾을 수 없거나 권한이 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}