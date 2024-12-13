"use client";

export default function MessageList({ messageList, username }) {
  return (
    <div className="flex flex-col mt-8 h-full  overflow-hidden overflow-y-auto">
      {messageList.map((item, index) => (
        <Message
          sameAsBefore={
            index > 0 && messageList[index - 1].username === item.username
          }
          rightAlign={username === item.username}
          key={index}
          senderUsername={item.username}
          content={item.content}
          // added a timestamp prop
          timestamp={item.timestamp}
        ></Message>
      ))}
    </div>
  );
}

function Message({ content, senderUsername, rightAlign, sameAsBefore, timestamp }) {
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
  className={`relative bg-yellow-200 mx-3 w-fit text-wrap animate-[fade_.2s_ease-in-out] p-3 rounded-lg max-w-[70%] ${
    rightAlign === true ? "self-end bg-yellow-500" : ""
  } ${sameAsBefore ? "mt-1" : "mt-3"}`}
    style={{ minWidth: "150px" }} // minimum width for very short messages so that the timestamp doesn't get parallel to the message content
>

      <div className="flex gap-2 items-center">
        <span
          className={`font-bold sma:text-sm underline ${
            rightAlign === true ? "text-blue-700" : "text-stone-1000"
          } ${sameAsBefore ? "hidden" : ""}`}
        >
          {senderUsername}
        </span>
      </div>
      <div className="font-semibold">
        <p className="sma:text-sm bottom-1 mb-4">{content}</p> {/* gap between message and timestamp */}
      </div>
      {/* added the timestamp in the message box and adjusted the styles for it*/}
      <span
        className={`absolute bottom-1 right-2 text-gray-500 text-xs text-opacity-90 ${
          rightAlign ? "text-blue-700" : "text-yellow-600"
        }`}
      >
        {time}
      </span>
    </div>
  );
}