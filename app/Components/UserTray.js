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
      className="cursor-pointer mt-3 px-10 py-2 bg-red-500 rounded-lg active:bg-red-700"
    >
      <button>LOGOUT</button>
    </div>
  );
}
