import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const roomId = body.roomId;

  try {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room) return new NextResponse("room not found", { status: 400 });

    return new NextResponse(room, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("internal sever error", { status: 500 });
  }
}
