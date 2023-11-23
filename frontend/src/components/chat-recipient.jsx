import React from "react";
import { CiUser } from "react-icons/ci";

export const ChatRecipient = ({ user, isOnline, getChat }) => {
  return (
    <div
      onClick={() => getChat(user.id, user.name)}
      className="h-20 bg-gray-400 flex items-center p-3 relative gap-10 rounded-sm cursor-pointer"
    >
      <CiUser className="h-10 w-10" />
      <h2 className="text-xl">{user.name}</h2>
      {isOnline && (
        <div className="rounded-full bg-green-300 absolute top-2 right-2 h-5 w-5" />
      )}
    </div>
  );
};
