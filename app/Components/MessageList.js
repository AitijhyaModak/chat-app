"use client";

import { useEffect, useRef, useState } from "react";
import { FaArrowDown } from "react-icons/fa";

export default function MessageList({ messageList, username }) {
  const messageListRef = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    if (messageListRef?.current) {
      const isScroll =
        messageListRef.current.scrollTop +
          messageListRef.current.clientHeight +
          130 <
        messageListRef.current.scrollHeight;
      console.log(isScroll);
      if (!isScroll) {
        messageListRef.current.scrollTo({
          top: messageListRef.current.scrollHeight,
          behavior: "smooth",
        });
        setShowScrollButton(false);
      } else setShowScrollButton(true);
    }
  }, [messageList]);

  function handleScrollDown() {
    setShowScrollButton(false);
    messageListRef.current.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: "smooth",
    });
  }

  return (
    <div
      ref={messageListRef}
      className="flex flex-col mt-8 h-full  overflow-hidden overflow-y-auto"
    >
      {messageList.map((item, index) => (
        <Message
          sameAsBefore={
            index > 0 && messageList[index - 1].username === item.username
          }
          rightAlign={username === item.username}
          key={index}
          senderUsername={item.username}
          content={item.content}
        ></Message>
      ))}
      {showScrollButton && (
        <button
          onClick={handleScrollDown}
          className="w-12 h-12 animate-pulse flex justify-center items-center rounded-full bg-green-500 absolute bottom-32 right-16"
        >
          <FaArrowDown size={20} color="black"></FaArrowDown>
        </button>
      )}
    </div>
  );
}

function Message({ content, senderUsername, rightAlign, sameAsBefore }) {
  return (
    <div
      className={`bg-blue-500 mx-3 w-fit text-wrap animate-[fade_.2s_ease-in-out] p-3 rounded-lg max-w-[70%] ${
        rightAlign === true ? "self-end bg-yellow-500" : ""
      } ${sameAsBefore ? "mt-1" : "mt-3"}`}
    >
      <div className="flex gap-2 items-center">
        <span
          className={`font-bold sma:text-sm underline ${
            rightAlign === true ? "text-blue-700" : "text-yellow-600"
          } ${sameAsBefore ? "hidden" : ""}`}
        >
          {senderUsername}
        </span>
      </div>
      <div className="font-semibold">
        <p className="sma:text-sm">{content}</p>
      </div>
    </div>
  );
}
