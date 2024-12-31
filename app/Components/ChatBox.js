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
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'

export default function ChatBox() {
  const params = useParams();
  const router = useRouter();
  const [content, setContent] = useState("");
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmojiPickOn,setEmojiPick] = useState(false);
  const [messageList, setMessageList] = useState([]);

  // added image state
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // new state for selected image to display onClick

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
  function emojiHandle(a)
  {
    //add selected emoji to body of text
    //setEmojiPick(false);//uncomment to make emoji picker close after each emoji
    setContent(content + a);
  }
  function handleEmojiClick()
  {
    //open/close emoji Picker
    if(isEmojiPickOn)
    {
       setEmojiPick(false);
    }
    else
    {
      setEmojiPick(true);
    }
  }

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
      {isEmojiPickOn && 
      (
        <div className="absolute bottom-20 z-50">
        <Picker data={data} onEmojiSelect={(val)=>{emojiHandle(val.native)}} onClickOutside={(a)=>{setEmojiPick(false)}}/>
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
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="type your message here"
          className="bg-[#1e293b] sm:text-md placeholder:text-gray-600 w-[95%] h-12 border-b-2 border-gray-600 focus:border-gray-300 text-xl text-wrap px-5 outline-none py-2"
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
