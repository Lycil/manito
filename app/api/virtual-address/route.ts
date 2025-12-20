import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import VirtualAddress from "@/models/VirtualAddress";
import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect(); // DB 연결

    // 현재 유저의 주소 개수 확인
    const currentCount = await VirtualAddress.countDocuments({ owner: session.user.id });

    // 10개 이상이면 에러 반환
    if (currentCount >= 10) {
      return NextResponse.json(
        { error: "최대 10개까지만 생성할 수 있습니다." }, 
        { status: 403 }
      );
    }

    const randomName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
      separator: '-',
      length: 2, // 단어 2개 조합
    });

    // 중복 방지용 숫자 생성
    const randomNumber = Math.floor(Math.random() * 900) + 100;

    const localPart = `${randomName}-${randomNumber}`;
    const fullAddress = `${localPart}@manito.kr`;

    const existing = await VirtualAddress.findOne({ fullAddress });
    if (existing) {
        return NextResponse.json({ error: "오류가 발생했습니다. 다시 시도해 주세요." }, { status: 409 });
    }

    const newAddress = await VirtualAddress.create({
      owner: session.user.id,
      localPart: localPart,
      fullAddress: fullAddress,
      memo: "새 이메일 주소",
    });

    return NextResponse.json(newAddress);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Creation failed" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // URL에서 삭제할 주소의 ID(?id=xxx)
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("id");

    if (!addressId) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await dbConnect();

    // 삭제 시도
    const deletedAddress = await VirtualAddress.findOneAndDelete({
      _id: addressId,
      owner: session.user.id, 
    });

    if (!deletedAddress) {
      return NextResponse.json({ error: "삭제할 주소를 찾지 못했습니다." }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, memo } = await request.json();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await dbConnect();

    // 내 주소인지 확인하고 업데이트 ($set: { memo: memo })
    const updatedAddress = await VirtualAddress.findOneAndUpdate(
      { _id: id, owner: session.user.id },
      { $set: { memo: memo } },
      { new: true } // 업데이트된 최신 데이터를 반환받음
    );

    if (!updatedAddress) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json(updatedAddress);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}