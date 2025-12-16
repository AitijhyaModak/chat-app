"use client";

import { signOut } from "next-auth/react";
import LoadingComponent from "./LoadingComponent";

export default function UserTray({ setIsLoading }) {
  function logout() {
    setIsLoading(true);
    signOut({ callbackUrl: "/", redirect: true });
  }

  return (
    <div
      onClick={logout}
      className="flex w-full justify-center cursor-pointer mt-3 px-10 py-2 bg-gradient-to-r from-[#e52d27] via-[#b31217] to-[#e52d27] bg-[length:200%_auto] shadow-lg rounded-lg hover:bg-right transition-all duration-300 text-center hover:scale-70 active:bg-red-700 " // Added subtle animation to the button to elevate the look and feel of the UI.
    >
      <button>LOGOUT</button>
    </div>
  );
}
