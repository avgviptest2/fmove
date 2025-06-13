import { useState } from "react";
import { Play, Download, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Movie } from "@shared/schema";

interface VideoPlayerProps {
  movie: Movie;
  isWatching: boolean;
  onClose: () => void;
}

export default function VideoPlayer({ movie, isWatching, onClose }: VideoPlayerProps) {
  const [selectedServer, setSelectedServer] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('Full HD');

  // Server options
  const servers = [
    { id: 1, name: 'Server 1', url: movie?.embed_url || movie?.play_url },
    { id: 2, name: 'Server 2', url: movie?.play_url || movie?.embed_url },
    { id: 3, name: 'Server 3', url: movie?.trailer_url },
  ];

  const getCurrentServerUrl = () => {
    const server = servers.find(s => s.id === selectedServer);
    return server?.url || null;
  };

  if (!isWatching) return null;

  return (
    <>
      {/* Video Player and Control UI Container */}
      <div className="relative w-full h-80 sm:h-96 md:h-[28rem] lg:h-[40rem] xl:h-[45rem] bg-black rounded-lg overflow-hidden shadow-2xl">
        {/* Video Player */}
        {getCurrentServerUrl() ? (
          <iframe
            key={`${selectedServer}-${selectedQuality}`}
            src={getCurrentServerUrl() || ""}
            title={`${movie.title} - Player`}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
            <div className="text-center p-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-500/20 rounded-full flex items-center justify-center">
                <Play className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-red-400 text-xl mb-2 font-semibold">
                Video not available
              </div>
              <p className="text-gray-400 text-sm">
                This server is not available for streaming
              </p>
            </div>
          </div>
        )}

        {/* Player Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20">
          <div className="bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 sm:p-4">
            {/* Progress Bar */}
            <div className="mb-4">
              <div className="h-1 bg-gray-600/50 relative rounded-full">
                <div className="h-full bg-accent-cyan w-[15%] relative rounded-full">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-accent-cyan rounded-full shadow-lg"></div>
                </div>
              </div>
            </div>

            {/* Main Controls Row */}
            <div className="flex items-center justify-between">
              {/* Left Controls */}
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>

                <div className="flex items-center space-x-1 text-xs sm:text-sm text-white font-medium">
                  <span>0:01</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-300">1:36:02</span>
                  <Badge className="ml-2 bg-green-600 text-white text-xs px-2 py-0.5">
                    LIVE
                  </Badge>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded p-1.5"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 rounded p-1.5"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Close Player Button */}
        <Button
          onClick={onClose}
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 text-white hover:bg-black/50 rounded-full p-2 backdrop-blur-sm border border-white/20 transition-all duration-200 z-30"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Server and Quality Selection - Separate Panel */}
      <div className="w-full bg-black/95 p-4">
        <div className="flex flex-wrap items-center gap-4">
          {/* Server Selection */}
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">Server:</span>
            <div className="flex gap-1">
              {servers.map((server) => (
                <Button
                  key={server.id}
                  onClick={() => setSelectedServer(server.id)}
                  className={`text-xs px-3 py-1.5 h-auto rounded-lg font-semibold transition-colors ${
                    selectedServer === server.id
                      ? 'bg-accent-cyan hover:bg-accent-cyan-hover text-white'
                      : 'bg-gray-700/80 hover:bg-gray-600 text-white'
                  }`}
                  disabled={!server.url}
                >
                  {server.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Quality Selection */}
          <div className="flex items-center gap-2">
            <span className="text-white text-sm font-medium">Quality:</span>
            <div className="flex gap-1">
              {['Full HD', 'HD', '720p'].map((quality) => (
                <Button
                  key={quality}
                  onClick={() => setSelectedQuality(quality)}
                  className={`text-xs px-3 py-1.5 h-auto rounded-lg font-semibold transition-colors ${
                    selectedQuality === quality
                      ? 'bg-accent-cyan hover:bg-accent-cyan-hover text-white'
                      : 'bg-gray-700/80 hover:bg-gray-600 text-white'
                  }`}
                >
                  {quality}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}