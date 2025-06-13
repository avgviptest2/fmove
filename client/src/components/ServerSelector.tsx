import { Button } from "@/components/ui/button";

interface Server {
  id: number;
  name: string;
  url: string | null;
}

interface ServerSelectorProps {
  servers: Server[];
  selectedServer: number;
  onServerChange: (serverId: number) => void;
  selectedQuality: string;
  onQualityChange: (quality: string) => void;
  qualities?: string[];
}

export default function ServerSelector({
  servers,
  selectedServer,
  onServerChange,
  selectedQuality,
  onQualityChange,
  qualities = ['Full HD', 'HD', '720p']
}: ServerSelectorProps) {
  return (
    <div className="w-full bg-black/95 p-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Server Selection */}
        <div className="flex items-center gap-2">
          <span className="text-white text-sm font-medium">Server:</span>
          <div className="flex gap-1">
            {servers.map((server) => (
              <Button
                key={server.id}
                onClick={() => onServerChange(server.id)}
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
            {qualities.map((quality) => (
              <Button
                key={quality}
                onClick={() => onQualityChange(quality)}
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
  );
}