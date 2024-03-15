import React from "react";
import chatService from "@/services/chatService";

import { AiOutlineLoading3Quarters } from "react-icons/ai";

function ChatBubble({ user, message, previousMessage, inserted_at}) {
  const isCurrentUser = message.user_id === user.id;
  const currDate = inserted_at ?? new Date(message.inserted_at);
  const prevDate = new Date(previousMessage?.inserted_at);
  const hour = currDate.getHours().toString().padStart(2, "0");
  const minute = currDate.getMinutes().toString().padStart(2, "0");

  const isDateChanged = previousMessage && currDate.getDate() !== prevDate.getDate();
  return (
    <div className="w-full">
      {isDateChanged && (
        <p className="w-20 mx-auto bg-gray-700 text-center text-sm text-gray-300 rounded-sm">
          {prevDate.toLocaleDateString()}
        </p>
      )}
      <div className={`flex justify-${isCurrentUser ? "end" : "start"}`}>
        <div
          className={`max-w-lg px-2 pt-1 rounded-sm ${
            isCurrentUser ? "bg-lime-600 text-end" : "bg-gray-700 text-start"
          }`}
        >

          {/* only one of localUrl or imgurl would be rendered at runtime, so don't worry about double images */}
          {message.localUrl && (
            <div className="relative">
              <img
                src={message.localUrl}
                alt="image"
                className={`rounded-sm my-1 ${
                  message.loading == true && "brightness-50"
                }`}
              />
              <AiOutlineLoading3Quarters
                className={`absolute top-1/2 left-1/2 text-2xl font-bold animate-spin ${message.loading == false && 'hidden'}`}
              />
            </div>
          )}

          {message.imgurl && (
            <img
              src={chatService.fetchDownloadUrl(message.imgurl).publicUrl}
              alt="image"
              className="rounded-sm my-1"
            />
          )}
          {message.message && <p className="text-white">{message.message}</p>}
          <p className="text-2xs text-gray-300">{`${hour}:${minute}`}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;