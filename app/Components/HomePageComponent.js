"use client";

import UserTray from "../Components/UserTray";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import LoadingComponent from "./LoadingComponent";

export default function HomePageComponent() {
  const router = useRouter();
  const [roomIdInput, setRoomIdInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  async function createRoom() {
    try {
      setIsLoading(true);
      const response = await axios.post("api/room/create");
      setShowLoading(true);
      toast.success("Room created");
      router.push(`/home/room/${response.data}`);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data);
    }
    setIsLoading(false);
  }

  async function joinRoom() {
    if (roomIdInput === "") {
      toast.error("Room ID cannot be empty");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const res = await axios.post("/api/room/get", { roomId: roomIdInput });
      router.push(`/home/room/${roomIdInput}`);
      toast.success("Joined room");
      setShowLoading(true);
    } catch (error) {
      toast.error("Incorrect room Id");
    }
    setIsLoading(false);
  }

  return (
    <div className="h-full flex flex-col justify-center items-center bg-[#0f172a]">
      <div className="flex flex-col p-4 bg-[#1e293b] rounded-lg mb-9">
        <input
          disabled={isLoading}
          value={roomIdInput}
          onChange={(e) => setRoomIdInput(e.target.value)}
          type="text"
          placeholder="enter room id"
          className="rounded-lg disabled:opacity-35 disabled:cursor-not-allowed outline-none focus:border-2 focus:border-cyan-600 bg-[#2F3949] mt-2 h-10 p-2"
        />
        <button
          disabled={isLoading}
          onClick={joinRoom}
          className="disabled:opacity-35 disabled:cursor-not-allowed active:bg-orange-800 mt-3 h-10 rounded-lg border-2 border-cyan-600"
        >
          Join
        </button>
        <button
          disabled={isLoading}
          onClick={() => createRoom()}
          className="disabled:opacity-35 disabled:cursor-not-allowed active:bg-green-700 mt-8 h-10 rounded-lg border-2 border-cyan-600"
        >
          Create room
        </button>
      </div>
      <UserTray setIsLoading={setShowLoading}></UserTray>
      {showLoading && (
        <LoadingComponent isLoading={setShowLoading}></LoadingComponent>
      )}
    </div>
  );
}
