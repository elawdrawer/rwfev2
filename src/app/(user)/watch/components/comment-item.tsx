"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Comment } from "../types/comments";
import { TrashIcon } from "@radix-ui/react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { deleteComment } from "@/apis/watch";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string, isLiked: boolean) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export function CommentItem({ comment, onLike, onDelete }: CommentItemProps) {
  const DeleteButton = () => {
    return (
      <Tooltip.Provider>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <span
              className="cursor-pointer"
              style={{
                paddingTop: "5px",
              }}
              onClick={() => onDelete(comment._id)}
            >
              <TrashIcon />
            </span>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content
              className="rounded bg-black text-white px-2 py-1 text-xs shadow-md"
              side="top"
              sideOffset={5}
            >
              Delete Comment
              <Tooltip.Arrow className="fill-black" />
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
  };
  return (
    <div className="flex gap-3">
      <Avatar>
        <AvatarImage src={comment.profilePic.thumbnail} />
        <AvatarFallback>{comment.firstName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2 justify-between">
          <div>
            <span className="font-semibold text-sm">
              {`${comment.firstName} ${comment.lastName}`}
            </span>
            <span className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(comment.commentedDateTime), {
                addSuffix: true,
              })}
            </span>
          </div>
          <DeleteButton />
        </div>
        <p className="text-sm mt-1">{comment.comment}</p>
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onLike(comment._id, comment.isLiked)}
            className={comment.isLiked ? "text-primary" : ""}
          >
            👍 {comment.totalLikes}
          </Button>
          <Button variant="ghost" size="sm">
            Reply
          </Button>
        </div>
      </div>
    </div>
  );
}
