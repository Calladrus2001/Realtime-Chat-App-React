import React from "react";

function ChatBubble({ user, message, previousMessage }) {
  const isCurrentUser = message.user_id === user.id;

  const currDate = new Date(message.inserted_at);
  const prevDate = new Date(previousMessage?.inserted_at);
  const hour = currDate.getHours().toString().padStart(2, "0");
  const minute = currDate.getMinutes().toString().padStart(2, "0");

  const isDateChanged = previousMessage && currDate.getDate() !== prevDate.getDate();

  return (
    <div className="w-full">
      {isDateChanged && (
        <p className="w-20 mx-auto bg-gray-700 text-center text-sm text-gray-300 rounded-sm">{prevDate.toLocaleDateString()}</p>
      )}
      <div className={`flex justify-${isCurrentUser ? "end" : "start"}`}>
        <div
          className={`max-w-1/2 px-2 pt-1 rounded-sm ${
            isCurrentUser ? "bg-lime-600 text-end" : "bg-gray-700 text-start"
          }`}
        >
          <p className="text-white">{message.message}</p>
          <p className="text-2xs text-gray-300">{`${hour}:${minute}`}</p>
        </div>
      </div>
    </div>
  );
}

export default ChatBubble;
