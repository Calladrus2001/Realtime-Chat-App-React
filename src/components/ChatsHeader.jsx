import React, { useRef, useState } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; /* prettier-ignore */
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; /* prettier-ignore */
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { HiMiniPencilSquare, HiMiniPlus, HiMiniUsers } from "react-icons/hi2";

function ChatsHeader() {
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const className =
    "p-1.5 flex justify-center items-center bg-gray-900 text-white font-medium rounded-md";

  const handleSubmit = () => {
    // try {
    // } catch (error) {
    //   toast.error(error.message);
    //   console.log(error);
    // }
  };

  return (
    <div className="flex justify-between items-center text-white text-xl mb-4">
      <strong>Chats</strong>
      <Popover>
        <PopoverTrigger>
          <div className="py-1 px-3">
            <HiMiniPencilSquare />
          </div>
        </PopoverTrigger>
        <PopoverContent
          className="w-44 bg-gray-700 border-0 flex flex-col gap-2"
          side="bottom"
          align="start"
          alignOffset={15}
        >
          <Dialog>
            <DialogTrigger>
              <div className={className}>
                <HiMiniPlus className="mr-2 text-lg" />
                <p>New Contact</p>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white border-0">
              <DialogHeader>
                <DialogTitle>Add New Contact</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" ref={emailRef} />
                </div>
                <div className="grid grid-cols-1 items-center gap-4">
                  <Label htmlFor="nickname">Nickname</Label>
                  <Input
                    id="nickname"
                    name="nickname"
                    type="text"
                    ref={nameRef}
                  />
                </div>
              </div>
              <DialogFooter>
                <button
                  className="p-1.5 font-semibold rounded-md bg-lime-500"
                  onClick={handleSubmit}
                >
                  Add Contact
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className={className}>
            <HiMiniUsers className="mr-4 text-lg" />
            <p>New Group</p>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default ChatsHeader;