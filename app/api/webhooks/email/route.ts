import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import VirtualAddress from "@/models/VirtualAddress";
import Email from "@/models/Email";

const SECRET_KEY = process.env.EMAIL_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    const clientKey = request.headers.get("x-secret-key");
    
    if (!SECRET_KEY) {
      console.error(".env에 EMAIL_WEBHOOK_SECRET이 없습니다.");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    if (clientKey !== SECRET_KEY) {
      console.warn("잘못된 접근");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 데이터 파싱(Cloudflare Worker가 보낸 JSON)
    const body = await request.json();
    const { recipient, sender, subject, text } = body;

    console.log(`메일 수신 시도 ${sender} -> ${recipient}`);

    // 필수 정보가 없으면 거절
    if (!recipient || !sender) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();

    // 가상 주소 주인 찾기
    const targetAddress = await VirtualAddress.findOne({ fullAddress: recipient });

    if (!targetAddress) {
      console.log(`존재하지 않는 주소 ${recipient}`);
      // Cloudflare가 재시도하지 않도록 200 OK를 보내고 끝냄
      return NextResponse.json({ message: "Address not found, ignored" }, { status: 200 });
    }

    // DB에 메일 저장
    // Email 스키마에 맞춰서 데이터 저장
    const newEmail = await Email.create({
      owner: targetAddress.owner,
      toAddress: recipient,
      fromAddress: sender,
      subject: subject || "(제목 없음)",
      text: text || "",
      receivedAt: new Date(),
      isRead: false,
    });

    console.log(`메일 저장 완료 (ID: ${newEmail._id})`);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}