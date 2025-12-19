import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Email from "@/models/Email";
import VirtualAddress from "@/models/VirtualAddress";

// 가짜 메일 시나리오들
const dummyScenarios = [
  {
    from: "delivery@coupang.com",
    fromName: "쿠팡 로켓배송",
    subject: "[쿠팡] 주문하신 상품이 문 앞에 도착했습니다.",
    summary: "1. 로켓배송 상품 도착 완료\n2. 문 앞에 위탁 배송됨\n3. 사진 확인 바람",
    text: "고객님, 주문하신 상품이 배송 완료되었습니다. 소중한 상품을 문 앞에 두었습니다."
  },
  {
    from: "no-reply@google.com",
    fromName: "Google 보안",
    subject: "새로운 기기에서 로그인이 감지되었습니다.",
    summary: "1. 윈도우 PC에서 로그인 시도\n2. 본인이 아니라면 즉시 비번 변경\n3. 2단계 인증 설정 권장",
    text: "새로운 기기(Windows 10, Chrome)에서 고객님의 Google 계정에 액세스했습니다."
  },
  {
    from: "promo@netflix.com",
    fromName: "Netflix",
    subject: "이번 주말, 이 영화 어떠세요?",
    summary: "1. 신작 콘텐츠 업데이트\n2. 사용자 취향 저격 추천\n3. 지금 바로 시청 가능",
    text: "회원님을 위한 취향 저격 콘텐츠가 도착했습니다. 지금 바로 접속해서 확인해보세요."
  }
];

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { addressId } = await request.json();

    await dbConnect();

    // 1. 해당 주소 정보 가져오기
    const targetAddress = await VirtualAddress.findOne({ 
      _id: addressId, 
      owner: session.user.id 
    });

    if (!targetAddress) {
      return NextResponse.json({ error: "주소를 찾을 수 없습니다." }, { status: 404 });
    }

    // 2. 랜덤 시나리오 하나 뽑기
    const randomScenario = dummyScenarios[Math.floor(Math.random() * dummyScenarios.length)];

    // 3. 가짜 메일 DB에 저장
    const newEmail = await Email.create({
      owner: session.user.id,
      toAddress: targetAddress.fullAddress,
      fromAddress: randomScenario.from,
      fromName: randomScenario.fromName,
      subject: randomScenario.subject,
      text: randomScenario.text,
      summary: randomScenario.summary, // AI가 요약했다고 치고 넣음
      isRead: false,
    });

    return NextResponse.json(newEmail);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Test mail creation failed" }, { status: 500 });
  }
}