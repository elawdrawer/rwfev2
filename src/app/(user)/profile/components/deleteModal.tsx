import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Share2Icon, ShareIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";



export default function DeleteModal() {

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button size={"icon"} variant={"default"} className="bg-black/50">
            <Trash2Icon />
          </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete</DialogTitle>
          <DialogDescription>
          Do you really want to delete this video?
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
         
           
          
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <div className="flex justify-between w-full items-center">
              <Button type="button" variant="secondary">
                Close
              </Button>
        
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
