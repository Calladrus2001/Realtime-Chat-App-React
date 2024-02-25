import React, { useEffect } from "react";
import { Input } from "./ui/input";

function ChatWindow({ currentChannel, chatService }) {
  useEffect(() => {
    return () => {};
  }, [currentChannel]);

  return (
    <div
      className="w-full h-full flex flex-col"
      style={{
        backgroundImage: `url("/src/assets/chat_bg.png")`,
        backgroundRepeat: "repeat",
        backgroundSize: "contain",
      }}
    >
      {currentChannel == null ? (
        <></>
      ) : (
        <>
          <div className="w-full p-4 bg-gray-800 shadow-md text-white">
            {currentChannel.slug}
          </div>
          <div className="w-full px-4 py-3 absolute flex items-center bottom-0 bg-gray-800 text-white">
            <input
              type="text"
              placeholder="Type Something..."
              className="w-full border-none bg-gray-800 outline-none focus:outline-none"
            />
            <div className="ml-2">Send</div>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatWindow;
