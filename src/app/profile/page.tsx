"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenSquare, User, Upload } from "lucide-react";
import Header from "@/components/header/Header";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    username: "jane_doe",
    email: "jane@example.com",
    bio: "Passionate about technology and communication.",
    avatar: "/placeholder.svg?height=200&width=200",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated profile:", profile);
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prev) => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Header />

      <div className=" min-h-[calc(100vh-60px)] bg-black/95">
        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-3xl mx-auto bg-[#0B0F17] border-0 shadow-2xl">
            <CardHeader className="border-b border-border/5 pb-4">
              <CardTitle className="text-2xl font-semibold text-white">
                Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="w-32 h-32 rounded-full border-2 border-primary/20">
                      <AvatarImage
                        src={profile.avatar}
                        alt={profile.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-background">
                        <User className="w-16 h-16 text-muted-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <div className="relative">
                        <Input
                          id="avatar"
                          type="file"
                          className="hidden"
                          onChange={handleAvatarChange}
                          accept="image/*"
                        />
                        <Label
                          htmlFor="avatar"
                          className="cursor-pointer inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary/10 text-primary hover:bg-primary/20 h-9 px-4 py-2 rounded-md"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Change Avatar
                        </Label>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label
                          htmlFor="name"
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Name
                        </Label>
                        <Input
                          id="name"
                          name="name"
                          value={profile.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="bg-background/5 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="username"
                          className="text-sm font-medium text-muted-foreground"
                        >
                          Username
                        </Label>
                        <Input
                          id="username"
                          name="username"
                          value={profile.username}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="bg-background/5 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="email"
                        className="text-sm font-medium text-muted-foreground"
                      >
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profile.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="bg-background/5 border-0 focus-visible:ring-1 focus-visible:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="bio"
                        className="text-sm font-medium text-muted-foreground"
                      >
                        Bio
                      </Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        rows={3}
                        className="bg-background/5 border-0 focus-visible:ring-1 focus-visible:ring-primary resize-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-8">
                  {isEditing ? (
                    <div className="space-x-2">
                      <Button
                        type="submit"
                        variant="ghost"
                        className="bg-primary/10 text-primary hover:bg-primary/20"
                      >
                        Save Changes
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsEditing(false)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      variant="ghost"
                      className="text-muted-foreground hover:text-primary"
                    >
                      <PenSquare className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </>
  );
}
