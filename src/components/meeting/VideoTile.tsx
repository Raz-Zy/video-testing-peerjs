"use client";

import { useEffect, useRef } from "react";

interface VideoTileProps {
  stream: MediaStream | null;
  userName: string;
  muted?: boolean;
  small?: boolean;
}

export default function VideoTile({
  stream,
  userName,
  muted = false,
  small = false,
}: VideoTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gray-900 ${
        small ? "h-28 w-44 flex-shrink-0" : "h-full w-full"
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={muted}
        className="h-full w-full object-cover"
      />
      {!stream && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-700 text-2xl font-semibold text-white">
            {userName.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
        {userName}
      </div>
    </div>
  );
}
