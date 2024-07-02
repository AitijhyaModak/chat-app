import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/app/libs/prisma";
import bcrypt from "bcrypt";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "email", type: "text" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials, req) {
        const { Email, Password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email: Email },
        });

        if (!user || !user?.hashedPassword) return null;

        const checkPassword = await bcrypt.compare(
          Password,
          user.hashedPassword
        );

        if (!checkPassword) return null;
        return user;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_AUTH_CLIENTID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENTSECRET,
    }),
  ],
  debug: process.env.NODE_ENV === "development",
  callbacks: {
    async session({ session }) {
      const user = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
      });

      session.user.id = user.id;
      session.user.username = user.name;

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(AuthOptions);
export { handler as GET, handler as POST };
