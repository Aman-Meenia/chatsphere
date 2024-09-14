"use client";
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import axios from "axios";
import DisplayContacts from "../contacts/DisplayContacts";
import DisplaySearchUsers from "../contacts/DisplaySearchUsers";
import { friendListType } from "@/app/page";

const SearchUser = ({ friendsList }: { friendsList: friendListType[] }) => {
  const domain = process.env.NEXT_PUBLIC_DOMAIN;
  const [searchUser, setSearchUser] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<friendListType[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchUser);
    }, 500);

    // Cleanup function to clear the timeout if the user keeps typing
    return () => {
      clearTimeout(handler);
    };
  }, [searchUser]);

  const searchUserFun = async () => {
    setLoading(true);
    await axios
      .post(`${domain}/api/users/search`, {
        username: searchUser,
      })
      .then((reponse) => {
        setSearchResults(reponse.data.messages[0]);
      })
      .catch((err) => {
        // console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (debouncedSearchTerm) {
      // console.log("Searching for:", debouncedSearchTerm);
      searchUserFun();
    }
  }, [debouncedSearchTerm]);
  return (
    <>
      <div className="p-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Search for a user..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute top-1/2 left-3 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>

        {/* <SearchUser /> */}
      </div>
      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
          </div>
        ) : searchUser ? (
          <DisplaySearchUsers friendsList={searchResults} />
        ) : (
          <DisplayContacts friendsList={friendsList} />
        )}
      </div>
    </>
  );
};

export default SearchUser;
