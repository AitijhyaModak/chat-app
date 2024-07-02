import prisma from "@/app/libs/prisma";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  try {
    const { Username, Email, Password } = body;

    console.log(Username, Email, Password);

    const hashedPassword = await bcrypt.hash(Password, 10);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: Email,
      },
    });

    if (existingUser)
      return new NextResponse("Account already exits", { status: 400 });
    await prisma.user.create({
      data: {
        name: Username,
        hashedPassword,
        email: Email,
      },
    });

    return new NextResponse("Account created succesfully", {
      status: 200,
    });
  } catch (error) {
    console.log(error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
