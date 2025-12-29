"use client";
import { useParams } from "next/navigation";
import { IoSend, IoCamera, IoCloseCircle } from "react-icons/io5";
import { MdEmojiEmotions } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import MessageList from "./MessageList";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import PusherClient from "pusher-js";
import LoadingComponent from "./LoadingComponent";
import { FaCropSimple } from "react-icons/fa6";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
// import sound related icons to toggle sound settings in chat ui
import { IoVolumeHigh, IoVolumeMute } from "react-icons/io5";
// useRef is used to store mutable values (audio element + window focus state)
import { useRef } from "react";

export default function ChatBox() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState("");
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmojiPickOn, setEmojiPick] = useState(false);
  const [messageList, setMessageList] = useState([]);
  const [someoneTyping, setSomeoneTyping] = useState(false);
  const [typingUser, setTypingUser] = useState("");


  // typing indicator refs
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef(null);

  // sound system state:
  // enabled toggle, volume level, and settings menu visibility
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [showSoundSettings, setShowSoundSettings] = useState(false);
  const isPageVisible = useRef(true);

  // added image state
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // new state for selected image to display onClick

  // track page visibility to prevent sound notifications when tab is hidden or minimized
  // uses page visibility API for reliable detection across browsers
  useEffect(() => {
    const handleVisibilityChange = () => {
      isPageVisible.current = !document.hidden;
      console.log("Page visible:", isPageVisible.current);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // play notification sound using Web Audio API
  // creates a simple two-tone "ding" sound programmatically
  // only plays if sound is enabled and page is visible
  const playSound = () => {
    if (!soundEnabled || !isPageVisible.current) return;

    // create simple beep sound on-demand
    const audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = 800;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + 0.3
    );

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  // save the playSound function
  const updateSoundSettings = (enabled, vol) => {
    setSoundEnabled(enabled);
    setVolume(vol);
  };

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
    if (newMessage.username === session.data.user.username) return;
    setMessageList((prevMessageList) => [...prevMessageList, newMessage]);

    // play sound for incoming messages
    playSound();
  }

  useEffect(() => {
    const pusherClient = new PusherClient(
      process.env.NEXT_PUBLIC_PUSHER_APP_KEY,
      {
        cluster: "ap2",
      }
    );

    pusherClient.subscribe(params.slug);
    pusherClient.bind("new-message", handleNewMessage);
    // binded new-image event listener
    pusherClient.bind("new-image", handleNewImageMessage);
    pusherClient.bind("typing-event", handleTypingEvent);


    return () => {
      pusherClient.unbind_all();
      pusherClient.unsubscribe();
      pusherClient.unbind("new-message", handleNewMessage);
      pusherClient.unbind("new-image", handleNewImageMessage);
    };
  }, []);

  // image related functions
  const handleNewImageMessage = (imageData) => {
    setMessageList((prevMessages) => {
      // Check for duplicates
      const alreadyExists = prevMessages.some((msg) => msg.id === imageData.id);

      if (alreadyExists) return prevMessages; // Skip duplicate message

      return [
        ...prevMessages,
        {
          type: "image",
          caption: imageData.caption,
          imageUrl: imageData.imageUrl,
          username: imageData.username,
          timestamp: imageData.timestamp,
          openImage: openImage,
        },
      ];
    });
  };

  // image change handler
  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  // send image message function
  async function sendImageMessage() {
    if (!image) {
      toast.error("No image selected");
      return;
    }
    const formData = new FormData();
    formData.append("image", image);
    formData.append("caption", caption);
    formData.append("roomId", params.slug);
    formData.append("senderUsername", session.data.user.username);
    setIsLoading(true);
    try {
      const response = await axios.post("/api/message/upload-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const imageMessage = {
        type: "image",
        caption: caption || "",
        imageUrl: response.data.imageUrl,
        username: session.data.user.username,
        timestamp: new Date().toISOString(),
      };

      // setMessageList((prevMessageList) => [...prevMessageList, imageMessage]);
      setImage(null);
      setImagePreview(null);
      setCaption("");
      setIsModalOpen(false);
    } catch (e) {
      toast.error("Error sending image message");
    } finally {
      setIsLoading(false);
    }
  }

  // function to open and close image upload modal
  function openImageModal() {
    setIsModalOpen(true);
  }
  function emojiHandle(a) {
    //add selected emoji to body of text
    //setEmojiPick(false);//uncomment to make emoji picker close after each emoji
    setContent(content + a);
  }
  function handleEmojiClick() {
    //open/close emoji Picker
    if (isEmojiPickOn) {
      setEmojiPick(false);
    } else {
      setEmojiPick(true);
    }
  }

    // emit typing event to backend
  const emitTypingEvent = async (type) => {
    try {
      await fetch("/api/message/typing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomId: params.slug,
          username: session?.data?.user?.username,
          type, // "start" | "stop"
        }),
      });
    } catch (err) {
      console.error("Typing emit failed", err);
    }
  };

  // Emits typing start/stop events using debounce to avoid spam
  const handleTyping = (value) => {
  setContent(value);

  if (!isTypingRef.current) {
    isTypingRef.current = true;
    emitTypingEvent("start");
  }

  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }

  typingTimeoutRef.current = setTimeout(() => {
    isTypingRef.current = false;
    emitTypingEvent("stop");
  }, 2000);
  };

  // Handles typing events from other users (ignores current user)
  const handleTypingEvent = (data) => {
  if (!data) return;

  // DO NOT show typing indicator for yourself
  if (data.username === session?.data?.user?.username) return;

  if (data.type === "start") {
    setTypingUser(data.username || "Someone");
    setSomeoneTyping(true);
  }

  if (data.type === "stop") {
    setSomeoneTyping(false);
    setTypingUser("");
  }
};


  function closeImageModal() {
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setIsModalOpen(false);
    setImage(null);
    setImagePreview(null);
    setCaption("");
  }

  // open and close image in chat on click
  function openImage(imageUrl) {
    setSelectedImage(imageUrl);
  }
  function closeImage(imageUrl) {
    setSelectedImage(null);
  }
  function onExit() {
    setIsLoading(true);
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
      // added a timestamp while sending the message
      timestamp: new Date().toISOString(),
    };
    setContent("");
    setMessageList((prevMessageList) => [...prevMessageList, newMessage]);
    try {
      await axios.post("/api/message/send", {
        newMessage,
        roomId: params.slug,
      });
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="w-full h-full  bg-[#0f172a] p-7 rounded-lg relative">
      {/* sound settings dropdown */}
      {showSoundSettings && (
        <div className="absolute top-20 right-10 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 p-4 z-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-white text-sm">Sound Settings</h3>
            <button
              onClick={() => setShowSoundSettings(false)}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* toggle sound */}
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-300">Message Sounds</label>
              <button
                onClick={() => updateSoundSettings(!soundEnabled, volume)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  soundEnabled ? "bg-blue-500" : "bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    soundEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* volume slider */}
            {soundEnabled && (
              <div>
                <label className="text-sm text-gray-300 mb-2 block">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) =>
                    updateSoundSettings(
                      soundEnabled,
                      parseFloat(e.target.value)
                    )
                  }
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
            )}

            {/* test sound button */}
            <button
              onClick={playSound}
              disabled={!soundEnabled}
              className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white py-2 rounded-lg text-sm transition-colors"
            >
              Test Sound
            </button>
          </div>
        </div>
      )}

      {/* open the image in full screen */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="relative">
            <IoCloseCircle
              className="absolute top-2 right-2 text-white text-4xl cursor-pointer"
              onClick={closeImage}
            />
            <img
              src={selectedImage}
              alt="Full-Screen Image"
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
      <div className=" bg-[#090d15] h-[10%] flex items-center justify-between px-10 py-8 rounded-xl shadow-xl">
        <div>
          <h1 className="text-xl font-semibold flex items-center sma:text-sm">
            Chat Room
            <span className="ml-4 text-sm font-thin bg-gray-900 px-4 py-4 rounded-md sma:text-sm sma:hidden">
              {params.slug}
            </span>
          </h1>
          <span className="hidden text-sm font-thin bg-gray-900 px-2 mr-4 sma:inline">
            {params.slug}
          </span>
        </div>

        {/* header action buttons: sound toggle opens settings dropdown, exit button leaves chat */}
        <div className="flex items-center gap-4">
          {/* sound toggle button */}
          <button
            onClick={() => setShowSoundSettings(!showSoundSettings)}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
            title="Sound Settings"
          >
            {soundEnabled ? (
              <IoVolumeHigh className="w-6 h-6 text-gray-300" />
            ) : (
              <IoVolumeMute className="w-6 h-6 text-gray-500" />
            )}
          </button>
          {/* exit button */}
          <button
            onClick={onExit}
            className="bg-gradient-to-r from-[#e52d27] via-[#b31217] to-[#e52d27] bg-[length:200%_auto] shadow-lg hover:bg-right transition-all duration-500 w-20 h-10 rounded-lg active:bg-red-700" // Added animation to the Exit button and improved the color by adding the color gradient..
          >
            Exit
          </button>
        </div>
      </div>

      {/* image upload modal component */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white shadow-lg border border-gray-300 p-6 rounded-lg w-96 relative">
            <IoCloseCircle
              className="w-6 h-6 text-gray-500 hover:text-gray-700 absolute top-2 right-2 cursor-pointer"
              onClick={closeImageModal}
            />

            <h2 className="text-xl font-bold mb-4 text-gray-800 text-center">
              Upload Image
            </h2>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mb-4 w-full border border-gray-300 rounded-md p-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />

            {imagePreview && (
              <div className="mb-4 relative">
                {/* Image preview */}
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-auto rounded-md border border-gray-300"
                />

                {/* // Crop Button 
               
                <button
                  
                  className="absolute top-2 right-2 bg-white text-gray-700 rounded-full shadow-md p-2 hover:bg-gray-200 focus:outline-none"
                  title="Crop"
                >
                  <FaCropSimple />
                </button>}

                {/* Loading component overlay */}
                {isLoading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
                    <LoadingComponent isLoading={isLoading}></LoadingComponent>
                  </div>
                )}
              </div>
            )}

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption"
              className="w-full p-2 border border-gray-300 rounded-md text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            />

            <button
              onClick={sendImageMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg w-full hover:bg-blue-600 transition-all duration-200"
            >
              Send
            </button>
          </div>
        </div>
      )}
      {/*emoji picker component */}
      {isEmojiPickOn && (
        <div className="absolute bottom-20 z-50">
          <Picker
            data={data}
            onEmojiSelect={(val) => {
              emojiHandle(val.native);
            }}
            onClickOutside={(a) => {
              setEmojiPick(false);
            }}
          />
        </div>
      )}
      {/* global LoadingComponent to avoid double loading rendering */}
      {isLoading && !isModalOpen && (
        <LoadingComponent isLoading={isLoading}></LoadingComponent>
      )}

      <div className="bg-[#0f172a] h-[75%]">
        <MessageList
          username={session?.data?.user?.username}
          messageList={messageList}
        ></MessageList>
      </div>

      <div className="py-7 flex items-center justify-between gap-4">
         {someoneTyping && (
         <div className="text-sm text-gray-400 px-4 pb-1">
         {typingUser} is typing...
         </div>
         )}
        <textarea
          value={content}
          onChange={(e) => handleTyping(e.target.value)}
          placeholder="Type your message here"
          className="bg-[#0a0f17] sm:text-md placeholder:text-gray-500 w-[95%] h-12 border-none border-gray-600 focus:border-gray-300 rounded-xl text-xl text-wrap px-5 outline-none py-2"
          type="text"
        />

        <MdEmojiEmotions
          className="cursor-pointer sma:size-7 size-12 active:fill-green-400"
          onClick={handleEmojiClick}
        ></MdEmojiEmotions>
        {/* image upload button*/}
        <IoCamera
          className="cursor-pointer sma:size-7 size-12 active:fill-green-400"
          onClick={openImageModal}
        ></IoCamera>
        <IoSend
          onClick={sendMessage}
          className="cursor-pointer sma:size-7 size-12 active:fill-green-400"
        ></IoSend>
      </div>
    </div>
  );
}
