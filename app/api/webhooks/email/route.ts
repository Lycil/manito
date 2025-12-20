import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import VirtualAddress from "@/models/VirtualAddress";
import Email from "@/models/Email";
import { simpleParser } from "mailparser";

const SECRET_KEY = process.env.EMAIL_WEBHOOK_SECRET;

export async function POST(request: Request) {
  try {
    // 보안 검사
    const clientKey = request.headers.get("x-secret-key");
    if (clientKey !== SECRET_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 데이터 받기
    const body = await request.json();
    const { recipient, sender, raw } = body;

    if (!recipient || !sender || !raw) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 메일 파싱
    const parsed = await simpleParser(raw);
    
    const subject = parsed.subject || "(제목 없음)";
    const textBody = parsed.text || ""; // 텍스트 본문
    const htmlBody = parsed.html || ""; // HTML 본문

    await dbConnect();

    // 가상 주소 확인
    const targetAddress = await VirtualAddress.findOne({ fullAddress: recipient });

    if (!targetAddress) {
      return NextResponse.json({ message: "Address not found" }, { status: 200 });
    }

    // DB 저장
    await Email.create({
      owner: targetAddress.owner,
      toAddress: recipient,
      fromAddress: sender,
      fromName: parsed.from?.text || "",
      subject: subject,
      text: textBody,
      html: htmlBody,
      receivedAt: new Date(),
      isRead: false,
    });

    console.log(`메일 저장 완료 "${subject}"`);
    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}