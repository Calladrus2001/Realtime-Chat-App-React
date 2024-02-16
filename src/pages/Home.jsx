import React from "react";
import { useLoaderData } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { getInit } from "../utils/getInitialsFromName";
import chatService from "../services/chatService";
import Sidebar from "../components/Sidebar";
import ChatsHeader from "../components/ChatsHeader";

function Home({ authService }) {
  const channels = useLoaderData();
  return (
    <>
      <div className="h-screen w-full min-w-lg flex items-center justify-start">
        <Sidebar />
        <div className="h-full w-1/4 p-4 bg-gray-800 border-r border-black">
          <ChatsHeader authService={authService} />
          <ul>
            {channels.map((channel) => (
              <li key={channel.channels.id} className="mb-2">
                <div
                  className="w-full p-2 flex items-center gap-4 hover:bg-gray-700 cursor-pointer rounded-md"
                  onClick={() => handleChannelChange(channel.channels.id)}
                >
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

const handleChannelChange = (channelId) => {};

export const channelLoader = async (authService) => {
  const user = await authService.getCurrentUser();
  const channels = await chatService.fetchChannels(user.user.id);
  return channels;
};

export default Home;
