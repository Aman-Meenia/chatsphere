"use client";
import React, { useContext, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Search, UserPlus, Users } from "lucide-react";
import { friendListType } from "@/app/page";
import toast from "react-hot-toast";
import { UserContext } from "@/store/ContextProvider";
import axios from "axios";

const getFirstCharacterName = (name: string) => {
  return name.charAt(0).toUpperCase();
};

const CreateGroupPopover = ({
  friendsList,
}: {
  friendsList: friendListType[];
}) => {
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { loggedInUser } = useContext(UserContext);
  const [groupName, setGroupName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const filteredUsers: friendListType[] = friendsList.filter(
    (user) =>
      user.isGroup === false &&
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleUserToggle = (userId: number) => {
    setSelectedUsers((prev) => {
      const isUserSelected = prev.includes(userId);
      if (isUserSelected) {
        // If the user is already selected, remove them
        return prev.filter((id) => id !== userId);
      } else {
        // If the user is not selected, check if we can add them
        if (prev.length < 10) {
          return [...prev, userId];
        } else {
          // If we're at the maximum, show an error and don't change the selection
          toast.error("A group can have a maximum of 10 users only.");
          return prev;
        }
      }
    });
  };
  const domain = process.env.NEXT_PUBLIC_DOMAIN;

  const handleCreateGroup = async () => {
    console.log("Creating group with users:", selectedUsers);

    if (!groupName) {
      toast.error("Group Name is required");
      return;
    }
    setLoading(true);
    await axios
      .post(`${domain}/api/create-group`, {
        groupName: groupName,
        userIds: selectedUsers,
        adminId: loggedInUser?.id ? loggedInUser.id : 3,
      })
      .then((response) => {
        console.log(response);
        if (response?.data?.success === true) {
          toast.success("Group created successfully");
        } else {
          toast.error("Failed to create group");
        }
      })
      .catch((error) => {
        toast.error("Failed to create group");
      })
      .finally(() => {
        setLoading(false);
      });
    setSelectedUsers([]);
    setGroupName("");
    setSearchTerm("");
    setIsOpen(false);
  };

  return (
    <>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2 text-sm font-normal"
            onClick={() => {
              /* Handle create group */
            }}
          >
            <Users className="mr-2 h-4 w-4" />
            New Group
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div className="font-medium">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? "s" : ""}{" "}
              selected of 10
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`user-${user.id}`}
                    checked={selectedUsers.includes(Number(user.id))}
                    onCheckedChange={() => handleUserToggle(Number(user.id))}
                  />
                  <label
                    htmlFor={`user-${user.id}`}
                    className="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image} alt={user.username} />
                      <AvatarFallback>
                        {getFirstCharacterName(user.username)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.username}</span>
                  </label>
                </div>
              ))}
            </div>
            {selectedUsers.length > 0 && (
              <>
                <Input
                  placeholder="Enter group name"
                  className="w-full"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
                <Button className="w-full" onClick={handleCreateGroup}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>Create Group ({selectedUsers.length})</>
                  )}
                </Button>
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
};

export default CreateGroupPopover;
