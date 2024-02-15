import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import authService from "../services/authService";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; /* prettier-ignore */
import { IoChatbubbleEllipsesOutline, IoSettingsOutline } from "react-icons/io5"; /* prettier-ignore */

function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="h-full px-2 py-4 flex flex-col justify-between items-center bg-gray-900">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          isActive && "border-l-2 border-lime-500 bg-gray-700 rounded-r-md"
        }
      >
        <div className="py-1 px-3">
          <IoChatbubbleEllipsesOutline className="text-white text-2xl" />
        </div>
      </NavLink>

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
          <AvatarFallback>VD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}

export default Sidebar;
