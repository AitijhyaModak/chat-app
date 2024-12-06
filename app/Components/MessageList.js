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
        ></Message>
      ))}
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
