import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { pusherServer } from "@/app/libs/pusher";
import { v4 as uuidv4 } from "uuid";
// configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  // extract data from req
  try {
    const formData = await req.formData();
    const image = formData.get("image");
    const caption = formData.get("caption");
    const roomId = formData.get("roomId");
    const senderUsername = formData.get("senderUsername");

    // validate necessary fields
    if (!image || !roomId || !senderUsername) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Convert ReadableStream to Buffer
    const stream = image.stream();
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "chat_images" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer); // Send the buffer to Cloudinary
    });

    const cloudinaryResult = await uploadPromise; // waiting for the upload to complete

    // Created image message for pushing into chat
    const imageMessage = {
      id: uuidv4(), // unique id to avoid dual rendering
      caption: caption || "",
      imageUrl: cloudinaryResult.secure_url,
      username: senderUsername,
      timestamp: new Date().toISOString(),
    };

    // Send Pusher event to chat room
    await pusherServer.trigger(roomId, "new-image", imageMessage);

    return NextResponse.json(
      { message: "Image uploaded successfully", data: imageMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
