import React, { useRef } from "react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"; /* prettier-ignore */
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"; /* prettier-ignore */
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { HiMiniPencilSquare, HiMiniPlus, HiMiniUsers } from "react-icons/hi2";

import authService from "../services/authService";
import contactService from "../services/contactService";

function ChatsHeader() {
  const emailRef = useRef(null);
  const nameRef = useRef(null);
  const className =
    "p-1.5 flex justify-center items-center bg-gray-900 text-white font-medium rounded-md";

  const handleNewContact = async () => {
    try {
      const email = emailRef.current.value;
      const nickname = nameRef.current.value;
      const user = await authService.getCurrentUser();
      const userId = user.user.id;
      await contactService.addContact({ userId, email, nickname });
      toast.info("Contact added successfully");
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
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
                <DialogClose>
                  <button className="mr-1 py-1.5 px-4 text-sm text-black font-semibold rounded-md bg-gray-100">
                    Cancel
                  </button>
                </DialogClose>

                <DialogClose>
                  <button
                    className="p-1.5 text-sm font-semibold rounded-md bg-lime-500"
                    onClick={() => {
                      handleNewContact();
                    }}
                  >
                    Add Contact
                  </button>
                </DialogClose>
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
