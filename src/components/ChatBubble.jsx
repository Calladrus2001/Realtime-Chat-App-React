import React from "react";

function ChatBubble({ user, message }) {
  const isCurrentUser = message.user_id === user.id;
  console.log(message);
  return (
    <div className={`flex justify-${isCurrentUser ? "end" : "start"}`}>
      <div
        className={`max-w-1/2 p-2 rounded-sm text-white ${
          isCurrentUser ? "bg-lime-600" : "bg-gray-700"
        }`}
      >
        <p>{message.message}</p>
      </div>
    </div>
  );
}

export default ChatBubble;
