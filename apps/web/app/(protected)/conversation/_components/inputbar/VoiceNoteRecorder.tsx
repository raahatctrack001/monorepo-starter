"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, StopCircle, Redo, SendHorizontal, Download } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSend: (audioFile: File) => void;
}

export const VoiceNoteRecorder: React.FC<Props> = ({ open, onClose, onSend }: Props) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [audioDuration, setAudioDuration] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);


  // Cleanup function
  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
  }, [audioUrl]);

  // Cleanup on unmount or dialog close
  useEffect(() => {
    if (!open) {
      cleanup();
      resetRecording();
    }
    return cleanup;
  }, [open, cleanup]);

  // Timer effect
  useEffect(() => {
    if (recording) {
      timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  }, [recording]);

  const startRecording = async () => {
    try {
      setError(null);
      setAudioBlob(null);
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      setAudioUrl(null);
      chunksRef.current = [];
      setTimer(0);
      setAudioDuration(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, { mimeType: "audio/webm;codecs=opus" });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        try {
          const blob = new Blob(chunksRef.current, { type: "audio/webm;codecs=opus" });
          setAudioBlob(blob);
          
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);

          // Get accurate duration via AudioContext
          const audioCtx = new AudioContext();
          try {
            const arrayBuffer = await blob.arrayBuffer();
            const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
            setAudioDuration(audioBuffer.duration);
          } catch (err) {
            console.warn("Could not decode audio for duration:", err);
          } finally {
            await audioCtx.close();
          }

          // Stop media tracks
          if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
          }
        } catch (err) {
          console.error("Error processing recording:", err);
          setError("Failed to process recording");
        }
      };

      recorder.onerror = (e) => {
        console.error("MediaRecorder error:", e);
        setError("Recording failed");
        setRecording(false);
      };

      recorder.start();
      setRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const resetRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioBlob(null);
    setAudioUrl(null);
    chunksRef.current = [];
    setTimer(0);
    setAudioDuration(null);
    setError(null);
  };

  const formatTime = (seconds: number) =>
    `${Math.floor(seconds / 60).toString().padStart(2, "0")}:${(seconds % 60)
      .toString()
      .padStart(2, "0")}`;

  const handleSend = () => {
    if (!audioBlob) return;
    try {
      const file = new File([audioBlob], `voice-note-${Date.now()}.webm`, {
        type: "audio/webm",
      });
      onSend(file);
      resetRecording();
      onClose();
    } catch (err) {
      console.error("Error creating file:", err);
      setError("Failed to create audio file");
    }
  };

  const handleDownload = () => {
    if (!audioUrl) return;
    const a = document.createElement('a');
    a.href = audioUrl;
    a.download = `voice-note-${Date.now()}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClose = () => {
    if (recording) {
      stopRecording();
    }
    resetRecording();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Voice Note</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4 py-4">
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {error}
            </div>
          )}

          {!recording && !audioBlob && (
            <Button onClick={startRecording} className="gap-2" disabled={!!error}>
              <Mic size={20} /> Start Recording
            </Button>
          )}

          {recording && (
            <>
              <div className="text-lg font-mono text-blue-600">
                Recording... {formatTime(timer)}
              </div>
              <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse" />
              <Button onClick={stopRecording} variant="destructive" className="gap-2">
                <StopCircle size={20} /> Stop Recording
              </Button>
            </>
          )}

          {audioUrl && audioBlob && (
            <div className="flex flex-col items-center gap-4 w-full">
              <audio 
                controls 
                src={audioUrl} 
                className="w-full max-w-sm rounded"
                preload="metadata"
              />
              {audioDuration !== null && (
                <div className="text-sm text-gray-500">
                  Duration: {formatTime(Math.round(audioDuration))}
                </div>
              )}
              <div className="flex gap-2 flex-wrap justify-center">
                <Button onClick={resetRecording} variant="outline" className="gap-2">
                  <Redo size={16} /> Retry
                </Button>
                <Button onClick={handleDownload} variant="outline" className="gap-2">
                  <Download size={16} /> Download
                </Button>
                <Button onClick={handleSend} className="gap-2">
                  <SendHorizontal size={16} /> Send
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};