
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Play } from 'lucide-react';

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerUrl: string;
  movieTitle: string;
}

export default function TrailerModal({ isOpen, onClose, trailerUrl, movieTitle }: TrailerModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract video ID from YouTube URL
  const getYouTubeVideoId = (url: string) => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(trailerUrl);
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0` : null;

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handleClose = () => {
    setIsPlaying(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-full bg-black border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {movieTitle} - Trailer
          </DialogTitle>
        </DialogHeader>
        
        <div className="aspect-video bg-black rounded-lg overflow-hidden">
          {!isPlaying ? (
            <div 
              className="relative w-full h-full bg-gray-900 flex items-center justify-center cursor-pointer group"
              onClick={handlePlay}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
              <Button
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 shadow-2xl transition-all duration-300 group-hover:scale-110"
              >
                <Play className="w-8 h-8 ml-1" />
              </Button>
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-lg font-semibold">Watch Trailer</h3>
                <p className="text-gray-300 text-sm">Click to play</p>
              </div>
            </div>
          ) : (
            <>
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={`${movieTitle} Trailer`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  <div className="text-center">
                    <p className="text-lg mb-2">Trailer not available</p>
                    <p className="text-gray-400">Invalid video URL</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
