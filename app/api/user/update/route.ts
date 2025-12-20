import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: "닉네임과 이메일은 필수입니다." }, { status: 400 });
    }

    await dbConnect();

    // DB 업데이트
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      { name, email },
      { new: true } // 업데이트된 정보를 반환받음
    );

    return NextResponse.json({ 
      message: "정보 수정이 완료되었습니다.", 
      user: updatedUser 
    });

  } catch (error) {
    console.error("Update error", error);
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }
}