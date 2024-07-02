import prisma from "@/app/libs/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const createdRoom = await prisma.room.create({
      data: {
        roomName: "test",
      },
    });
    return new NextResponse(createdRoom.id, { status: 200 });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
