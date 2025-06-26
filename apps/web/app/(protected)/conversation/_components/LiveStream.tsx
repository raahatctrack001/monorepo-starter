import React, { useRef, useEffect } from "react";

type Props = {
  stream: MediaStream | null;
};

export const LivestreamPlayer: React.FC<Props> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      controls
      className="w-full rounded-lg"
    />
  );
};
