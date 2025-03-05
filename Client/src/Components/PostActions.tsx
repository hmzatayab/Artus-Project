import React, { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RiMore2Fill } from "@remixicon/react";
import { Post } from "@/Types/Post";
import { updatePost } from "@/APIs/Post";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { getUser } from "@/utils/storage";
import LoadingIcon from "@/utils/Loading";

interface PostActionsProps {
  post: Post;
  userId: string | undefined;
  onPostUpdate: (updatedPost: Post) => void;
}

export const PostActions = ({ post, userId, onPostUpdate }: PostActionsProps) => {
  const [title, setTitle] = useState(post.title);
  const [description, setDescription] = useState(post.description);
  const [tags, setTags] = useState(post.tags.join(", "));
  const [loading, setLoading] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const token = getUser().token;

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedData = {
        title,
        description,
        tags: tags.split(",").map((tag) => tag.trim()),
      };
      if (updatedData.tags.length < 3) {
        toast.error("You must add at least 3 tags");
        return;
      }
      if (updatedData.tags.length > 10) {
        toast.error("You can add a maximum of 10 tags");
        return;
      }
      if (updatedData.title.length < 15) {
        toast.error("Title must be at least 10 characters long");
        return;
      }
      if (updatedData.description.length < 50) {
        toast.error("Description must be at least 50 characters long");
        return;
      }
      const response = (await updatePost(post.id, updatedData, token)) as Post;
      const updatedPost: Post = {
        ...response,
        id: post.id,
        user: response.user || post.user,
        createdAt: post.createdAt,
        updatedAt: new Date().toISOString(),
      };

      onPostUpdate(updatedPost);
      toast.success("Post updated successfully!");
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <RiMore2Fill className="cursor-pointer" />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {/* Report Option */}
          <DropdownMenuItem className="cursor-pointer">
            <Link to={'/'}>Report</Link>
          </DropdownMenuItem>
          {userId === post.user.id && (
            <DropdownMenuItem className="cursor-pointer" onClick={() => setIsDialogOpen(true)}>Edit</DropdownMenuItem>
          )}
          {/* Copy Link Option */}
          <DropdownMenuItem className="cursor-pointer">Copy link</DropdownMenuItem>

          {/* Delete Option (Only for post owner) */}
          {userId === post.user.id && (
            <DropdownMenuItem className="text-red-500 cursor-pointer">
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>


      {/* Edit Option (Only for post owner) */}
      {userId === post.user.id && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Post</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              {/* Title Input */}
              <div>
                <Label>Title</Label>
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>

              {/* Description Input */}
              <div>
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>

              {/* Tags Input */}
              <div>
                <Label>Tags (comma separated)</Label>
                <Input value={tags} onChange={(e) => setTags(e.target.value)} />
              </div>

              {/* Save Button */}
              <Button onClick={handleSave} disabled={loading}>
                {loading ? (
                  <div role="status" className="flex items-center gap-2">
                    <LoadingIcon />
                    <span>Saving...</span>
                  </div>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
