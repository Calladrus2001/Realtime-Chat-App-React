import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import ChatBubble from "./ChatBubble";
import { IoSend, IoHappyOutline, IoImageOutline } from "react-icons/io5";

function ChatWindow({ currentChannel, authService, chatService }) {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const msgRef = useRef(null);

  useEffect(() => {
    if (currentChannel) {
      chatService.subscribeToChannel({ channelId: currentChannel.id, setMessages });
    }
  }, [currentChannel]);

  useEffect(() => {
    const getUser = async () => {
      const user = await authService.getCurentUser();
      setCurrentUser(user);
    };
  }, []);

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
          <div className="w-full p-4 bg-gray-800 shadow-md font-semibold text-white text-center">
            {currentChannel.slug}
          </div>
          <ul className="text-white">
            {messages.map((message) => {
              return (
                <li key={message.id}>
                  <ChatBubble user={currentUser} message={message} />
                </li>
              );
            })}
          </ul>
          <div className="w-full px-4 py-3 absolute flex items-center bottom-0 bg-gray-800 text-white">
            <Button variant="ghost">
              <IoHappyOutline className="text-lg" />
            </Button>
            <Button variant="ghost">
              <IoImageOutline className="text-lg" />
            </Button>
            <ScrollArea className="w-full">
              <textarea
                ref={msgRef}
                type="text"
                placeholder="Type Something..."
                className="w-full h-auto ml-4 border-none bg-gray-800 outline-none focus:outline-none resize-none overflow-y-auto"
                maxLength={255}
                rows="1"
              />
            </ScrollArea>

            <Button variant="ghost">
              <IoSend />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatWindow;
