import React from "react";
import { useLoaderData } from "react-router-dom";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; /* prettier-ignore */
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { HiMiniPencilSquare } from "react-icons/hi2";

import { getInit } from "../utils/getInitialsFromName";
import authService from "../services/authService";
import chatService from "../services/chatService";
import Sidebar from "../components/Sidebar";

function Home() {
  const channels = useLoaderData();
  return (
    <>
      <div className="h-screen w-full min-w-lg flex items-center justify-start">
        <Sidebar />
        <div className="h-full w-1/4 p-4 bg-gray-800 border-r border-black">
          <div className="flex justify-between items-center text-white text-xl mb-4">
            <strong>Chats</strong>
            <button>
              <HiMiniPencilSquare />
            </button>
          </div>

          <ul>
            {channels.map((channel) => (
              <li key={channel.channels.id} className="mb-2">
                <div className="w-full p-2 flex items-center gap-4 hover:bg-gray-700 cursor-pointer rounded-md">
                  <Avatar>
                    <AvatarFallback>
                      {getInit(channel.channels.slug)}
                    </AvatarFallback>
                  </Avatar>
                  <strong className="text-white">
                    {channel.channels.slug}
                  </strong>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-full w-3/4 bg-gray-800"></div>
      </div>
    </>
  );
}

export const channelLoader = async () => {
  const user = await authService.getCurrentUser();
  const channels = await chatService.fetchChannels(user.user.id);
  return channels;
};

export default Home;
