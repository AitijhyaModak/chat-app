import { NextResponse } from "next/server";
import Pusher from "pusher";

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: "ap2",
  useTLS: true,
});

export async function POST(req) {
  try {
    const { roomId, username, type } = await req.json();

    await pusher.trigger(roomId, "typing-event", {
      username,
      type, // "start" | "stop"
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Typing API error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
