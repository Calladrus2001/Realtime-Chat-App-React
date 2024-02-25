import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import authService from "../services/authService";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; /* prettier-ignore */
import { IoChatbubbleEllipsesOutline, IoSettingsOutline } from "react-icons/io5"; /* prettier-ignore */
import { getInit } from "../utils/getInitialsFromName";

function Sidebar({ authService }) {
  const navigate = useNavigate();
  const [initials, setInitials] = useState("");

  useEffect(() => {
    const getInitials = async () => {
      const user = await authService.getCurrentUser();
      setInitials(getInit(user.user.user_metadata.display_name));
    };
    getInitials();
  }, []);

  return (
    <div
      className="h-full px-2 py-4 flex flex-col justify-end items-center"
      style={{
        backgroundImage: `url('/src/assets/chat_bg.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="flex flex-col items-center gap-6">
        <Popover>
          <PopoverTrigger>
            <div className="py-1 px-3">
              <IoSettingsOutline className="text-white text-2xl" />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-44 bg-gray-700 border-0" side="right">
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => {
                try {
                  authService.signOut();
                  navigate("/", { replace: true });
                } catch (error) {
                  toast.error(error.message);
                  console.log(error);
                }
              }}
            >
              Sign Out
            </Button>
          </PopoverContent>
        </Popover>

        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default Sidebar;
