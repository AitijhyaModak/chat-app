import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  const newMessage = body.newMessage;
  const roomId = body.roomId;

  await pusherServer.trigger(roomId, "new-message", newMessage);

  return new NextResponse("Message sent", { status: 200 });
}
