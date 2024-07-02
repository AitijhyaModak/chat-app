"use client";
import { useParams } from "next/navigation";
import { IoSend } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import MessageList from "./MessageList";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import PusherClient from "pusher-js";

export default function ChatBox() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState("");
  const session = useSession();

  const [messageList, setMessageList] = useState([]);

  useEffect(() => {
    async function fetchRoomDetails() {
      try {
        const response = await axios.post("/api/room/get", {
          roomId: params.slug,
        });
      } catch (error) {
        router.push("/home/room/error");
      }
    }
    fetchRoomDetails();
  }, []);

  function handleNewMessage(newMessage) {
    setMessageList((prevMessageList) => [...prevMessageList, newMessage]);
  }

  useEffect(() => {
    const pusherClient = new Pusher(process.env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: "ap2",
    });
    pusherClient.subscribe(params.slug);
    pusherClient.bind("new-message", handleNewMessage);

    return () => {
      pusherClient.unbind_all();
      pusherClient.unsubscribe();
      pusherClient.unbind("new-message", handleNewMessage);
    };
  }, []);

  function onExit() {
    router.push("/home");
  }

  async function sendMessage() {
    if (content === "") {
      toast.error("Cannot send empty message");
      return;
    }
    const newMessage = {
      content,
      username: session.data.user.username,
    };

    try {
      await axios.post("/api/message/send", {
        newMessage,
        roomId: params.slug,
      });
      setContent("");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-full h-full  bg-[#0f172a] p-7 rounded-lg relative">
      <div className=" bg-[#0f172a] h-[10%] flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center sma:text-sm">
            Chat Room
            <span className="ml-2 text-sm font-thin bg-gray-900 px-4 sma:text-sm sma:hidden">
              {params.slug}
            </span>
          </h1>
          <span className="hidden text-sm font-thin bg-gray-900 px-2 mr-4 sma:inline">
            {params.slug}
          </span>
        </div>

        <button
          onClick={onExit}
          className="bg-red-500 w-20 h-10 rounded-lg active:bg-red-700"
        >
          Exit
        </button>
      </div>
      <div className="bg-[#0f172a] h-[75%]">
        <MessageList
          username={session?.data?.user?.username}
          messageList={messageList}
        ></MessageList>
      </div>
      <div className="py-7 flex items-center justify-between gap-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="type your message here"
          className="bg-[#1e293b] sm:text-md placeholder:text-gray-600 w-[95%] h-12 border-b-2 border-gray-600 focus:border-gray-300 text-xl text-wrap px-5 outline-none py-2"
          type="text"
        />
        <IoSend
          onClick={sendMessage}
          className="cursor-pointer sma:size-7 size-12 active:fill-green-400"
        ></IoSend>
      </div>
    </div>
  );
}
