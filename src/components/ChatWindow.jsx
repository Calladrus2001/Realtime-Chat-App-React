import React, { useEffect, useRef, useState } from "react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import ChatBubble from "./ChatBubble";
import { IoSend, IoHappyOutline, IoImageOutline } from "react-icons/io5";
import { toast } from "sonner";

function ChatWindow({ currentChannel, authService, chatService }) {
  const [messages, setMessages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const msgRef = useRef(null);

  useEffect(() => {
    const getMessages = async ({ channelId }) => {
      const messages = await chatService.fetchMessages({ channelId });
      setMessages(messages);
    };

    if (currentChannel) {
      chatService.subscribeToChannel({ channelId: currentChannel.id, setMessages });
      getMessages({ channelId: currentChannel.id });
    }
  }, [currentChannel]);

  useEffect(() => {
    const getUser = async () => {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    };
    getUser();
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
          <div className="w-full p-4 flex justify-center items-center bg-gray-800 shadow-md font-semibold text-white">
            <p>{currentChannel.slug}</p>
            <div className="ml-4 mr-2 animate-ping size-1.5 rounded-full bg-lime-500 opacity-75"></div>
            <p className="text-gray-600 text-sm">x people online</p>
          </div>
          <ScrollArea>
            <ul className="w-full p-2 text-white">
              {messages.map((message) => {
                //? While adding a message, an unexpected [message] instead of object is also generated which
                //? does NOT have an id field so the following line is to prevent this from being rendered.
                //? Previously, a chatbubble with blank userid and message was being rendered along with the new message

                if (Array.isArray(message)) return null;
                return (
                  <li key={message.id} className="mb-1">
                    <ChatBubble user={currentUser.user} message={message} />
                  </li>
                );
              })}
            </ul>
          </ScrollArea>

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

            <Button
              variant="ghost"
              onClick={async () => {
                if (!msgRef.current.value) toast.warning("Message cannot be empty");
                else {
                  try {
                    const newMessage = await chatService.createMessage({
                      message: msgRef.current.value,
                      userId: currentUser.user.id,
                      channelId: currentChannel.id,
                    });
                    setMessages((prev) => [...prev, newMessage]);
                    msgRef.current.value = "";
                  } catch (error) {
                    console.log(error);
                    toast.error(error.message);
                  }
                }
              }}
            >
              <IoSend />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default ChatWindow;
