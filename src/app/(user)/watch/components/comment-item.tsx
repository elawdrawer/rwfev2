"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Comment } from "../types/comments";
import { TrashIcon } from "@radix-ui/react-icons";
import * as Tooltip from "@radix-ui/react-tooltip";
import { deleteComment, getReplyComment, replyToComment } from "@/apis/watch";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { MdDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";

interface CommentItemProps {
  comment: Comment;
  onLike: (commentId: string, isLiked: boolean) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
  ownerName: string;
}

interface Reply {
  commentId: string;
  firstName: string;
  lastName: string;
  userName: string;
  profilePic: {
    original: string;
    thumbnail: string;
  };
  comment: string;
  commentedDateTime: string;
  totalLikes: number;
  isLiked: boolean;
}

export function CommentItem({
  comment,
  onLike,
  onDelete,
  ownerName,
}: CommentItemProps) {
  const [myProfile, setMyProfile] = useState<boolean>(false);
  const [replyCount, setreplyCount] = useState<number>(0);
  const [reply, setReply] = useState<Reply[]>([]);
  const [showReply, setShowReply] = useState<boolean>(false);
  const [addReply, setAddReply] = useState<boolean>(false);
  const [replyComment, setReplyComment] = useState<string>("");
  useEffect(() => {
    if (comment) {
      const data = localStorage.getItem("uib");
      const username = JSON.parse(data || "").userName;
      if (username === comment.userName || username === ownerName) {
        setMyProfile(true);
      }
      init();
    }
  }, []);

  const init = async () => {
    const replies = await getReplyComment(comment._id, 0);
    setReply(replies.data.data);
    setreplyCount(replies.data.count);
  };

  const handleReplyComment = async () => {
    const reply = await replyToComment(comment._id, replyComment);
    setReplyComment("")
    init();
  };

  const DeleteButton = () => {
    return (
      <>
        {myProfile && (
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
        )}
      </>
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
          <div className="flex gap-2">
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
          <Button variant="ghost" size="sm" onClick={() => setAddReply(true)}>
            Reply
          </Button>
        </div>
        <div>
          {addReply && (
            <div className="flex items-center space-x-2 pt-2">
              <Input
                type="text"
                value={replyComment}
                placeholder="type reply here.."
                className="text-xs"
                onChange={(e) => {
                  setReplyComment(e.target.value);
                }}
              />

              <Button
                size={"sm"}
                className="bg-red-500 hover:bg-red-700"
                onClick={() => {
                  setReplyComment("");
                  setAddReply(false);
                }}
              >
                <IoClose />
              </Button>
              <Button
                size={"sm"}
                className="bg-green-500 hover:bg-green-700"
                onClick={() => { setAddReply(false)
                replyComment.length===0?"":  handleReplyComment()
                }}
              >
                <MdDone />
              </Button>
            </div>
          )}
          {replyCount > 0 && !showReply && (
            <p
              className="text-xs mt-1 cursor-pointer"
              onClick={() => setShowReply(true)}
            >
              view all {replyCount} replies
            </p>
          )}
          {showReply && (
            <div className="p-2 ">
            <div className="space-y-2 max-h-36 overflow-y-scroll">
              {reply.map((item: Reply, index: number) => (
                <div className="flex">
                  <Avatar>
                    <AvatarImage
                      height={5}
                      width={5}
                      src={item.profilePic.thumbnail}
                    />
                    <AvatarFallback>{item.firstName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start pl-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex gap-2">
                          <span className="font-semibold text-xs">
                            {`${item.firstName} ${item.lastName}`}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(
                              new Date(item.commentedDateTime),
                              {
                                addSuffix: true,
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs mt-1" key={index}>
                      {item.comment}
                    </p>
                  </div>
                </div>
              ))}

             
            </div>
            <p
                className="text-xs mt-1 cursor-pointer pt-2"
                onClick={() => setShowReply(false)}
              >
                Hide All
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
