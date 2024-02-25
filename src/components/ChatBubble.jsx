import React from "react";

const ChatBubble = ({ user, message }) => {
  const isCurrentUser = message.user_id === user.id;

  return (
    <div className={`flex justify-${isCurrentUser ? "end" : "start"}`}>
      <div
        className={`p-2 rounded-sm text-white ${
          isCurrentUser ? "bg-gray-700" : "bg-gray-800"
        }`}
      >
        <p>{message.message}</p>
      </div>
    </div>
  );
};

export default ChatBubble;