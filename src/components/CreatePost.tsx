"use client";

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { createPost } from "@/actions/post.action";
import toast from "react-hot-toast";
import ImageUpload from "./ImageUpload";

const CreatePost = () => {
  const { user } = useUser();

  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() && !imageUrl) return;
    setIsPosting(true);
    try {
      const result = await createPost(content, imageUrl);
      if (result?.success) {
        setContent("");
        setImageUrl("");
        setShowImageUpload(false);

        toast.success("Post created successfully!");
      }
    } catch (error) {
      console.log("Failed to create a post!", error);
      toast.error("Failed to create a post!");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div>
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex space-x-4">
              <Avatar className="w-10 h-10">
                <AvatarImage src={user?.imageUrl || "/avatar.png"} />
              </Avatar>
              <Textarea
                placeholder="What's on your mind?"
                value={content}
                className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-base"
                onChange={(e) => setContent(e.target.value)}
                disabled={isPosting}
              />
            </div>

            {(showImageUpload || imageUrl) && (
              <div className="border rounded-lg p-4">
                <ImageUpload
                  endpoint="postImage"
                  value={imageUrl}
                  onChange={(url) => {
                    setImageUrl(url);
                    if (!url) setShowImageUpload(false);
                  }}
                />
              </div>
            )}

            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="hover:text-primary text-muted-foreground"
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  disabled={isPosting}
                >
                  <ImageIcon className="mr-2 size-4" />
                  Photo
                </Button>
              </div>
              <Button
                className="flex items-center"
                onClick={handleSubmit}
                disabled={isPosting || (!content.trim() && !imageUrl)}
              >
                {isPosting ? (
                  <>
                    <Loader2Icon className="size-4 mr-2 animate-spin" />
                    Posting
                  </>
                ) : (
                  <>
                    <SendIcon className="size-4 mr-2" />
                    Post
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreatePost;
