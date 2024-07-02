"use client";

import { signOut } from "next-auth/react";

export default function UserTray() {
  return (
    <div
      onClick={() => signOut({ callbackUrl: "/", redirect: true })}
      className="cursor-pointer mt-3 px-10 py-2 bg-red-500 rounded-lg active:bg-red-700"
    >
      <button>LOGOUT</button>
    </div>
  );
}
