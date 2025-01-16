"use client";

import { Upload, RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface VideoUploaderProps {
  onUploadComplete: (url: string, file: File) => void;
  hasExistingVideo: boolean;
}

export function VideoUploader({ onUploadComplete, hasExistingVideo }: VideoUploaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    setIsUploading(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        const videoUrl = URL.createObjectURL(file);
        onUploadComplete(videoUrl, file);
        // toast.success("Video uploaded successfully! Click Next to continue.");
        setIsUploading(false);
      }
    }, 100);
  };

  return (
    <div
      className={`relative rounded-lg border-2 border-dashed p-12 transition-all
        ${isDragging ? "border-primary bg-primary/5" : "border-border"}
        ${isUploading ? "pointer-events-none opacity-50" : ""}
      `}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleUpload(file);
      }}
    >
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="rounded-full bg-primary/10 p-4">
          {hasExistingVideo ? (
            <RefreshCw className="h-8 w-8 text-primary" />
          ) : (
            <Upload className="h-8 w-8 text-primary" />
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold">
            {hasExistingVideo ? "Change Video" : "Upload your video review"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {hasExistingVideo 
              ? "Select a different video file"
              : "Drag and drop your video here or click to browse"
            }
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "video/*";
            input.onchange = (e) => {
              const file = (e.target as HTMLInputElement).files?.[0];
              if (file) handleUpload(file);
            };
            input.click();
          }}
          disabled={isUploading}
        >
          {hasExistingVideo ? "Select New Video" : "Choose Video"}
        </Button>
      </div>
      {progress > 0 && progress < 100 && (
        <div className="mt-4">
          <Progress value={progress} className="h-2 w-full" />
          <p className="mt-2 text-sm text-center text-muted-foreground">
            Uploading... {progress}%
          </p>
        </div>
      )}
    </div>
  );
}