import { useState } from 'react';
import { PlayCircle } from 'lucide-react';

interface VideoFacadeProps {
  src: string;
  poster: string;
  className?: string;
  ariaLabel?: string;
}

export function VideoFacade({ src, poster, className = "", ariaLabel = "Play video" }: VideoFacadeProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <video
        src={src}
        className={className}
        controls
        autoPlay
        playsInline
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <div 
      className={`relative cursor-pointer group overflow-hidden ${className}`}
      onClick={() => setIsPlaying(true)}
      role="button"
      aria-label={ariaLabel}
    >
      <img 
        src={poster} 
        alt="Video thumbnail" 
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
        <div className="w-16 h-16 md:w-20 md:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transition-transform group-hover:scale-110">
            <PlayCircle className="w-10 h-10 md:w-12 md:h-12 text-white fill-white/20" />
        </div>
      </div>
    </div>
  );
}
