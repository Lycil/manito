import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/dbConnect";
import Email from "@/models/Email";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await dbConnect();

    const updatedEmail = await Email.findOneAndUpdate(
      { _id: id, owner: session.user.id },
      { isRead: true },
      { new: true }
    );

    if (!updatedEmail) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    return NextResponse.json(updatedEmail);
  } catch (error) {
    console.error("읽음 처리 실패 ", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}