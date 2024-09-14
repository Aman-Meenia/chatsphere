import React from "react";
import { LogOut, Settings, User, Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import Link from "next/link";

const LeftSidebarBottomBar = () => {
  return (
    <div className="border-t border-gray-700 p-4 flex justify-between items-center">
      <Button variant="ghost" size="icon">
        <Circle className="h-6 w-6 text-green-500" />
      </Button>
      <Link href="/profile">
        <Button variant="ghost" size="icon">
          <User className="h-6 w-6" />
        </Button>
      </Link>

      <Button variant="ghost" size="icon">
        <Settings className="h-6 w-6" />
      </Button>
      <Button variant="ghost" size="icon">
        <LogOut className="h-6 w-6" onClick={() => signOut()} />
      </Button>
    </div>
  );
};

export default LeftSidebarBottomBar;
