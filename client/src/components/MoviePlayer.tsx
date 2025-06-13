import { Play, Download, Share2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Movie, Server } from "@shared/schema";
import Hls from "hls.js";

interface MoviePlayerProps {
  movie: Movie;
  isWatching: boolean;
  setIsWatching: (v: boolean) => void;
  selectedServer: number;
  setSelectedServer: (v: number) => void;
  selectedQuality: string;
  setSelectedQuality: (v: string) => void;
}

export default function MoviePlayer({
  movie,
  isWatching,
  setIsWatching,
  selectedServer,
  setSelectedServer,
  selectedQuality,
  setSelectedQuality,
}: MoviePlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  
  const { data: servers = [], isLoading: serversLoading } = useQuery<Server[]>({
    queryKey: [`/api/movies/${movie.id}/servers`],
    enabled: !!movie.id,
  });

  const getCurrentServer = () => {
    return servers.find((s) => s.id === selectedServer) || servers[0];
  };

  const getCurrentServerUrl = () => {
    const server = getCurrentServer();
    return server?.url || null;
  };

  const isEmbedType = () => {
    const server = getCurrentServer();
    return server?.type === 'embed';
  };

  // Set first server as default when servers load
  useEffect(() => {
    if (servers.length > 0 && !selectedServer) {
      setSelectedServer(servers[0].id);
    }
  }, [servers, selectedServer, setSelectedServer]);

  // Initialize HLS for direct server types
  useEffect(() => {
    const video = videoRef.current;
    const currentServer = getCurrentServer();
    const url = getCurrentServerUrl();

    if (!video || !url || !isWatching || currentServer?.type !== 'direct') {
      return;
    }

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    // Check if the URL is an m3u8 file (HLS stream)
    if (url.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: false,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        
        hlsRef.current = hls;
        hls.loadSource(url);
        hls.attachMedia(video);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          console.log('HLS manifest loaded, starting playback');
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('HLS Error:', data);
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('Network error, trying to recover...');
                hls.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('Media error, trying to recover...');
                hls.recoverMediaError();
                break;
              default:
                console.log('Fatal error, destroying HLS instance');
                hls.destroy();
                break;
            }
          }
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        video.src = url;
      } else {
        console.error('HLS is not supported in this browser');
      }
    } else {
      // Regular video file
      video.src = url;
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [isWatching, selectedServer, servers]);

  if (!isWatching) {
    return (
      <div
        className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[32rem] bg-cover bg-center group cursor-pointer"
        style={{
          backgroundImage: movie.backdrop
            ? `url(${movie.backdrop})`
            : undefined,
        }}
        onClick={() => setIsWatching(true)}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-dark-primary" />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-500 ease-in-out" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            onClick={() => setIsWatching(true)}
            size="lg"
            className="bg-accent-cyan/90 bg-accent-cyan hover:bg-accent-cyan group-hover:bg-accent-cyan group-hover:scale-110 group-hover:shadow-accent-cyan/50 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] group-hover:brightness-125 text-white rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-accent-cyan/50 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] hover:brightness-125"
          >
            <Play className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ml-1" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative w-full h-80 sm:h-96 md:h-[28rem] lg:h-[40rem] xl:h-[45rem] bg-black rounded-lg overflow-hidden shadow-2xl">
        {getCurrentServerUrl() ? (
          getCurrentServer()?.type === 'direct' ? (
            <video
              ref={videoRef}
              key={`${selectedServer}-${selectedQuality}`}
              className="w-full h-full rounded-lg"
              controls={!isEmbedType()}
              autoPlay
              playsInline
              crossOrigin="anonymous"
            />
          ) : (
            <iframe
              key={`${selectedServer}-${selectedQuality}`}
              src={getCurrentServerUrl() || ""}
              title={`${movie.title} - Player`}
              className="w-full h-full rounded-lg"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          )
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
                {serversLoading ? "Loading servers..." : "No servers available for streaming"}
              </p>
            </div>
          </div>
        )}
        {/* Only show controls if not embed type */}
        {!isEmbedType() && (
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <div className="bg-gradient-to-t from-black/95 via-black/80 to-transparent p-3 sm:p-4">
              <div className="mb-4">
                <div className="h-1 bg-gray-600/50 relative rounded-full">
                  <div className="h-full bg-accent-cyan w-[15%] relative rounded-full">
                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-accent-cyan rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Button
                    onClick={() => setIsWatching(false)}
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
        )}
        <Button
          onClick={() => setIsWatching(false)}
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 text-white hover:bg-black/50 rounded-full p-2 backdrop-blur-sm border border-white/20 transition-all duration-200 z-30"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      {servers.length > 0 && (
        <div className="w-full bg-black/95 p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">Server:</span>
              <div className="flex gap-1">
                {servers.map((server) => (
                  <Button
                    key={server.id}
                    onClick={() => setSelectedServer(server.id)}
                    className={`text-xs px-3 py-1.5 h-auto rounded-lg font-semibold transition-colors ${selectedServer === server.id ? "bg-accent-cyan hover:bg-accent-cyan-hover text-white" : "bg-gray-700/80 hover:bg-gray-600 text-white"}`}
                    disabled={!server.url}
                  >
                    {server.name}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white text-sm font-medium">Quality:</span>
              <div className="flex gap-1">
                {["Full HD", "HD", "720p"].map((quality) => (
                  <Button
                    key={quality}
                    onClick={() => setSelectedQuality(quality)}
                    className={`text-xs px-3 py-1.5 h-auto rounded-lg font-semibold transition-colors ${selectedQuality === quality ? "bg-accent-cyan hover:bg-accent-cyan-hover text-white" : "bg-gray-700/80 hover:bg-gray-600 text-white"}`}
                  >
                    {quality}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
