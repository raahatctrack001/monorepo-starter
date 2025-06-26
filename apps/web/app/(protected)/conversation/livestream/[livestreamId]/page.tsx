"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { LivestreamPlayer } from "../../_components/LiveStream";

export default function LivestreamPage() {
  const { streamId } = useParams();
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);

  // Here you’d connect to media server or WebRTC peer and assign stream

  return (
    <div className="p-6">
      <h1>Livestream: {streamId}</h1>
      <LivestreamPlayer stream={remoteStream} />
    </div>
  );
}
