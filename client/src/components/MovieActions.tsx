import { Button } from "@/components/ui/button";
import { Heart, Share2, Download } from "lucide-react";
import React from "react";

interface MovieActionsProps {
  isLiked: boolean;
  onLike: () => void;
  onShare: () => void;
  onDownload: () => void;
  onWatchNow: () => void;
  variant?: "mobile" | "desktop";
}

export default function MovieActions({
  isLiked,
  onLike,
  onShare,
  onDownload,
  onWatchNow,
  variant = "desktop",
}: MovieActionsProps) {
  if (variant === "mobile") {
    return (
      <div className="md:hidden space-y-3 mt-6">
        <Button
          onClick={onWatchNow}
          className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white font-semibold py-3"
        >
          Stream in HD
        </Button>
        <Button
          onClick={onDownload}
          className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white font-semibold py-3"
        >
          Download in HD
        </Button>
        <div className="flex space-x-2 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={`flex-1 ${isLiked ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
          >
            <Heart
              className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
            />
            Like
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="flex-1 text-gray-400 hover:text-accent-cyan"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    );
  }
  return (
    <div className="hidden md:block md:col-span-3 lg:col-span-3 xl:col-span-3">
      <div className="space-y-3 sticky top-4">
        <Button
          onClick={onWatchNow}
          className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white font-semibold py-3 text-sm md:text-base"
        >
          Stream in HD
        </Button>
        <Button
          onClick={onDownload}
          className="w-full bg-accent-cyan hover:bg-accent-cyan-hover text-white font-semibold py-3 text-sm md:text-base"
        >
          Download in HD
        </Button>
        <div className="flex flex-col md:flex-row lg:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={onLike}
            className={`flex-1 ${isLiked ? "text-red-500" : "text-gray-400"} hover:text-red-500`}
          >
            <Heart
              className={`w-4 h-4 mr-2 ${isLiked ? "fill-current" : ""}`}
            />
            Like
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onShare}
            className="flex-1 text-gray-400 hover:text-accent-cyan"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>
    </div>
  );
}
