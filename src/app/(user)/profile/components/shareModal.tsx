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
import { Copy, Share2Icon, ShareIcon } from "lucide-react";
import { useState } from "react";

interface Props {
  shareLink: () => void;
  link: string;
}

export default function ShareLinkModal({ shareLink, link }: Props) {
  const [copy, setCopy] = useState<boolean>(false);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default"   onClick={shareLink}>
          <Share2Icon/> <small>share</small>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to view your Profile.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={link} readOnly />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={() => {
              navigator.clipboard.writeText(link);
              setCopy(true);
             const timer=  setTimeout(() => {
                setCopy(false);
                       clearTimeout(timer);
              }, 1000);
       
            }}
          >
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <div className="flex justify-between w-full items-center">
              <Button type="button" variant="secondary">
                Close
              </Button>
              {copy && <Badge className="py-2 bg-sky-500">Link Copied !</Badge>}
            </div>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
