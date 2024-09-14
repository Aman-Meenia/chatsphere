"use client";
import React, { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Users, UserPlus } from "lucide-react";
import SearchUser from "@/components/searchUsers/SearchUser";
import { UserContext } from "@/store/ContextProvider";
import { friendListType } from "@/app/page";
import { loggedInUserType } from "@/store/ContextProvider";
import LeftSidebarBottomBar from "./LeftSidebarBottomBar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import CreateGroupPopover from "./CreateGroupPopover";

const HomePage = ({
  friendsList,
  loggedInUserData,
}: {
  friendsList: friendListType[];
  loggedInUserData: loggedInUserType;
}) => {
  const { selectedUser, setLoggedInUser } = useContext(UserContext);
  setLoggedInUser(loggedInUserData);

  return (
    <>
      <div
        className={`w-full lg:w-80 border-r border-gray-700 flex flex-col ${
          selectedUser ? "hidden lg:flex" : "flex"
        }`}
      >
        <div className="p-4 flex justify-between items-center border-b border-gray-700">
          <h1 className="text-xl font-bold">ChatSphere</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon">
                <Edit className="h-6 w-6 text-blue-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
              <div className="py-1">
                <CreateGroupPopover friendsList={friendsList} />
                <Button
                  variant="ghost"
                  className="w-full justify-start px-4 py-2 text-sm font-normal"
                  onClick={() => {
                    /* Handle join group */
                  }}
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Join Group
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <SearchUser friendsList={friendsList} />
        <LeftSidebarBottomBar />
      </div>
    </>
  );
};

export default HomePage;
// "use client";
//
// import React, { useContext } from "react";
// import { Button } from "@/components/ui/button";
// import { LogOut, Search, Send, Smile, ArrowLeft, Edit } from "lucide-react";
// import SearchUser from "@/components/searchUsers/SearchUser";
// import { UserContext } from "@/store/ContextProvider";
// import { signOut } from "next-auth/react";
// import { friendListType } from "@/app/page";
// import { loggedInUserType } from "@/store/ContextProvider";
// import LeftSidebarBottomBar from "./LeftSidebarBottomBar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
//
// const HomePage = ({
//   friendsList,
//   loggedInUserData,
// }: {
//   friendsList: friendListType[];
//   loggedInUserData: loggedInUserType;
// }) => {
//   const { selectedUser, setLoggedInUser } = useContext(UserContext);
//   setLoggedInUser(loggedInUserData);
//
//   return (
//     <>
//       <div
//         className={`w-full lg:w-80 border-r border-gray-700 flex flex-col ${
//           selectedUser ? "hidden lg:flex" : "flex"
//         }`}
//       >
//         <div className="p-4 flex justify-between items-center border-b border-gray-700">
//           <h1 className="text-xl font-bold">ChatSphere</h1>
//           <Popover>
//             <PopoverTrigger asChild>
//               <Button variant="ghost" size="icon">
//                 <Edit className="h-6 w-6 text-blue-500" />
//               </Button>
//             </PopoverTrigger>
//             <PopoverContent className="w-80">
//               <div className="grid gap-4">
//                 <div className="space-y-2">
//                   <h4 className="font-medium leading-none">Group Actions</h4>
//                   <p className="text-sm text-muted-foreground">
//                     Join an existing group or create a new one.
//                   </p>
//                 </div>
//                 <div className="grid gap-2">
//                   <div className="grid grid-cols-3 items-center gap-4">
//                     <label htmlFor="joinGroup">Join Group</label>
//                     <input
//                       id="joinGroup"
//                       placeholder="Enter group ID"
//                       className="col-span-2 h-8 bg-background border rounded px-2"
//                     />
//                   </div>
//                   <Button
//                     className="w-full"
//                     onClick={() => {
//                       /* Handle join group */
//                     }}
//                   >
//                     Join Group
//                   </Button>
//                   <div className="my-2 border-t" />
//                   <div className="grid grid-cols-3 items-center gap-4">
//                     <label htmlFor="createGroup">Create Group</label>
//                     <input
//                       id="createGroup"
//                       placeholder="New group name"
//                       className="col-span-2 h-8 bg-background border rounded px-2"
//                     />
//                   </div>
//                   <Button
//                     className="w-full"
//                     onClick={() => {
//                       /* Handle create group */
//                     }}
//                   >
//                     Create Group
//                   </Button>
//                 </div>
//               </div>
//             </PopoverContent>
//           </Popover>
//         </div>
//         <SearchUser friendsList={friendsList} />
//         <LeftSidebarBottomBar />
//       </div>
//     </>
//   );
// };
//
// export default HomePage;
// // "use client";
// // import React, { useContext } from "react";
// import { Button } from "@/components/ui/button";
// import { LogOut, Search, Send, Smile, ArrowLeft, Edit } from "lucide-react";
// import SearchUser from "@/components/searchUsers/SearchUser";
// import { UserContext } from "@/store/ContextProvider";
// import { signOut } from "next-auth/react";
// import { friendListType } from "@/app/page";
// import { loggedInUserType } from "@/store/ContextProvider";
// import LeftSidebarBottomBar from "./LeftSidebarBottomBar";
//
// const HomePage = ({
//   friendsList,
//   loggedInUserData,
// }: {
//   friendsList: friendListType[];
//   loggedInUserData: loggedInUserType;
// }) => {
//   const { selectedUser, setLoggedInUser } = useContext(UserContext);
//   setLoggedInUser(loggedInUserData);
//   return (
//     <>
//       {/* <div className={`w-full lg:w-80 border-r border-gray-700 flex flex-col `}> */}
//       <div
//         className={`w-full lg:w-80 border-r border-gray-700 flex flex-col ${
//           selectedUser ? "hidden lg:flex" : "flex"
//         }`}
//       >
//         <div className="p-4 flex justify-between items-center border-b border-gray-700">
//           <h1 className="text-xl font-bold">ChatSphere</h1>
//           {/* <Button variant="ghost" size="icon"> */}
//           {/*   <LogOut className="h-5 w-5" onClick={() => signOut()} /> */}
//           {/* </Button> */}
//           <Button variant="ghost" size="icon">
//             <Edit className="h-6 w-6 text-blue-500" />
//           </Button>
//         </div>
//         {/* <div className="p-4"> */}
//         <SearchUser friendsList={friendsList} />
//         {/* </div> */}
//         {/* <div className="flex-1 overflow-hidden"> */}
//         {/*   <DisplayContacts friendsList={friendsList} /> */}
//         {/* </div> */}
//         <LeftSidebarBottomBar />
//       </div>
//     </>
//   );
// };
//
// export default HomePage;
