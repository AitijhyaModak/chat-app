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
          // defiend a type prop
          type={item.type}
          content={item.content}
          // imageUrl prop and its corresponding caption prop
          imageUrl={item.imageUrl}
          caption={item.caption}
          // added a timestamp prop
          timestamp={item.timestamp}
          // added a openImage prop to maximize image in chat on clikcing the image
          openImage={item.openImage}
        ></Message>
      ))}
    </div>
  );
}

function Message({
  content,
  senderUsername,
  rightAlign,
  sameAsBefore,
  timestamp,
  type,
  imageUrl,
  caption,
  openImage,
}) {
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`relative bg-blue-500 mx-3 w-fit text-wrap animate-[fade_.2s_ease-in-out] p-3 rounded-lg max-w-[70%] ${
        rightAlign === true ? "self-end bg-yellow-500" : ""
      } ${sameAsBefore ? "mt-1" : "mt-3"}`}
      style={{ minWidth: "150px" }} // minimum width for very short messages so that the timestamp doesn't get parallel to the message content
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
      {/* added the image and caption in the message box and styled it a bit*/}
      {type === "image" ? (
        <div className="flex flex-col items-center">
          <img
            src={imageUrl}
            alt="Shared Image"
            className="rounded-lg max-w-[250px] mb-2"
            onClick={() => openImage(imageUrl)}
          />
          {caption && (
            <p className="sma:text-sm italic bottom-1 mb-4">{caption}</p>
          )}
        </div>
      ) : (
        <div className="font-semibold">
          <p className="sma:text-sm bottom-1 mb-4">{content}</p>{" "}
          {/* gap between message and timestamp */}
        </div>
      )}

      {/* added the timestamp in the message box and adjusted the styles for it*/}
      <span
        className={`mt-1 absolute bottom-1 right-2 text-gray-500 text-xs text-opacity-90 ${
          rightAlign ? "text-blue-700" : "text-yellow-600"
        }`}
      >
        {time}
      </span>
    </div>
  );
}
