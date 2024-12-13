import { pusherServer } from "@/app/libs/pusher";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();
  let newMessage = body.newMessage;
  const roomId = body.roomId;

  // ensuring time stamps is present in the message by user else adding it here 
  if (!newMessage.timestamp) {
    newMessage.timestamp = new Date().toISOString();
  }

  await pusherServer.trigger(roomId, "new-message", newMessage);

  return new NextResponse("Message sent", { status: 200 });
}
