"use client";

import { signOut } from "next-auth/react";

export default function UserTray() {
  async function logout() {
    const { error } = await signOut({ redirect: false });
    if (error) {
      toast.error("Some error occured");
    } else {
      return navigateTo("/", { external: true });
    }
  }

  return (
    <div
      onClick={() => signOut({ callbackUrl: "https://am-chatapp.netlify.app" })}
      className="cursor-pointer mt-3 px-10 py-2 bg-red-500 rounded-lg active:bg-red-700"
    >
      <button>LOGOUT</button>
    </div>
  );
}
