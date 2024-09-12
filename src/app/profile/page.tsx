"use client";
import { useState } from "react";
import { CldImage } from "next-cloudinary";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import Header from "@/components/header/Header";

export default function ProfilePage() {
  const [username, setUsername] = useState("Aman Meenia");
  const [avatarUrl, setAvatarUrl] = useState("/placeholder.svg");
  const [about, setAbout] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAboutChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAbout(event.target.value);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("about", about);
    if (avatarFile) {
      formData.append("avatar", avatarFile);
    }

    // Log form data contents
    console.log("Form data contents:");
    // for (let [key, value] of formData.entries()) {
    //   if (value instanceof File) {
    //     console.log(key, value.name, value.type, value.size + " bytes");
    //   } else {
    //     console.log(key, value);
    //   }
    // }

    try {
      const response = await fetch("/api/profile", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Profile updated successfully:", result);
        // Handle success (e.g., show a success message)
      } else {
        console.error("Failed to update profile");
        // Handle error (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      // Handle error (e.g., show an error message)
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-60px)] text-white flex items-center justify-center p-4 bg-gray-100 dark:bg-gray-900">
        <Card className="w-full max-w-[350px] sm:max-w-[450px] dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="w-32 h-32 border-2 border-white dark:border-[#1a1d24]">
                  <AvatarImage src={avatarUrl} alt={username} />
                  <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                </Avatar>
                <Label
                  htmlFor="avatar"
                  className="cursor-pointer text-sm text-[#4ade80]"
                >
                  Change Avatar
                </Label>
                <Input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  className="dark:bg-[#1a1d24]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="about">About</Label>
                <Textarea
                  id="about"
                  value={about}
                  onChange={handleAboutChange}
                  className="dark:bg-[#1a1d24] min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#4ade80] hover:bg-[#22c55e] text-black"
              >
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
