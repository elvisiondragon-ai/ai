import { useState, useRef, useEffect } from 'react';
import { PlayCircle } from 'lucide-react';
import { useAnalytics } from '@/hooks/use-analytics';
import { trackCustomEvent } from '@/utils/fbpixel';

interface VideoFacadeProps {
  src: string;
  poster: string;
  className?: string;
  ariaLabel?: string;
  contentId?: string; // Optional: specific ID for analytics
}

export function VideoFacade({ src, poster, className = "", ariaLabel = "Play video", contentId }: VideoFacadeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { trackEvent } = useAnalytics();
  
  // Use provided contentId or fallback to filename from src
  const trackingId = contentId || src.split('/').pop() || src;
  
  // Tracking state to prevent duplicate events
  const [trackedImpression, setTrackedImpression] = useState(false);
  const [tracked15, setTracked15] = useState(false);
  const [tracked30, setTracked30] = useState(false);
  const [tracked60, setTracked60] = useState(false);

  // Track impression when video becomes visible
  useEffect(() => {
    if (trackedImpression) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !trackedImpression) {
          trackEvent('impression', trackingId, { type: 'video_view' });
          setTrackedImpression(true);
        }
      },
      { threshold: 0.5 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [trackingId, trackedImpression, trackEvent]);

  const handlePlay = () => {
    setIsPlaying(true);
    // Track initial play as an start event
    trackEvent('impression', trackingId, { type: 'video_start' });
    
    // Meta Pixel Tracking
    trackCustomEvent('VideoPlay', { 
      content_name: trackingId,
      video_url: src 
    });
    
    // Use a small timeout to ensure the video element is ready if it was hidden
    if (!isYouTube) {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(err => {
            console.error("Video play failed:", err);
          });
        }
      }, 0);
    }
  };

  const isYouTube = src.includes('youtube.com') || src.includes('youtu.be');
  const getEmbedUrl = (url: string) => {
    if (url.includes('shorts/')) {
      return url.replace('shorts/', 'embed/');
    }
    if (url.includes('watch?v=')) {
      return url.replace('watch?v=', 'embed/');
    }
    if (url.includes('youtu.be/')) {
      return url.replace('youtu.be/', 'www.youtube.com/embed/');
    }
    return url;
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;

    if (currentTime >= 15 && !tracked15) {
      trackEvent('content_engagement', trackingId, { duration: 15, video_url: src });
      trackCustomEvent('VideoSpent', { 
        content_name: trackingId, 
        seconds: 15,
        url: window.location.pathname 
      });
      setTracked15(true);
    }

    if (currentTime >= 30 && !tracked30) {
      trackEvent('content_engagement', trackingId, { duration: 30, video_url: src });
      trackCustomEvent('VideoSpent', { 
        content_name: trackingId, 
        seconds: 30,
        url: window.location.pathname 
      });
      setTracked30(true);
    }

    if (currentTime >= 60 && !tracked60) {
      trackEvent('content_engagement', trackingId, { duration: 60, video_url: src });
      trackCustomEvent('VideoSpent', { 
        content_name: trackingId, 
        seconds: 60,
        url: window.location.pathname 
      });
      setTracked60(true);
    }
  };

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {!isPlaying ? (
        <div 
          className="absolute inset-0 z-10 cursor-pointer group"
          onClick={handlePlay}
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
      ) : null}

      {isPlaying && isYouTube ? (
        <iframe
          src={`${getEmbedUrl(src)}?autoplay=1`}
          className="w-full h-full absolute inset-0"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          controls
          playsInline
          preload="metadata"
          poster={poster}
          onTimeUpdate={handleTimeUpdate}
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </div>
  );
}