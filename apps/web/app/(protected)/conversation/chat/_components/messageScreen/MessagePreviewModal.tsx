import { X, FileText, Video, Image as ImageIcon, Maximize2, Minimize2 } from "lucide-react";
import { IMessage } from "@/types/conversations/message.types";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";

interface MessagePreviewModalProps {
  message: IMessage | null;
  onClose: () => void;
}

export const MessagePreviewModal: React.FC<MessagePreviewModalProps> = ({ message, onClose }: MessagePreviewModalProps) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [size, setSize] = useState({ width: 800, height: 600 });
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({ x: 0, y: 0, width: 0, height: 0 });
  
  const modalRef = useRef<HTMLDivElement>(null);

  if (!message) return null;

  // Disable scroll when modal open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Center modal on mount
  useEffect(() => {
    if (!isFullscreen) {
      const centerX = (window.innerWidth - size.width) / 2;
      const centerY = (window.innerHeight - size.height) / 2;
      setPosition({ x: centerX, y: centerY });
    }
  }, [isFullscreen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isFullscreen) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && !isFullscreen) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // Keep modal within viewport bounds
      const maxX = window.innerWidth - size.width;
      const maxY = window.innerHeight - size.height;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
    
    if (isResizing && !isFullscreen) {
      const newWidth = Math.max(400, resizeStart.width + (e.clientX - resizeStart.x));
      const newHeight = Math.max(300, resizeStart.height + (e.clientY - resizeStart.y));
      
      // Keep within viewport bounds
      const maxWidth = window.innerWidth - position.x;
      const maxHeight = window.innerHeight - position.y;
      
      setSize({
        width: Math.min(newWidth, maxWidth),
        height: Math.min(newHeight, maxHeight)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeStart = (e: React.MouseEvent) => {
    if (isFullscreen) return;
    e.stopPropagation();
    setIsResizing(true);
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: size.width,
      height: size.height
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeStart, position, size]);

  const modalStyle = isFullscreen 
    ? { width: '100vw', height: '100vh', top: 0, left: 0 }
    : { 
        width: `${size.width}px`, 
        height: `${size.height}px`,
        top: `${position.y}px`,
        left: `${position.x}px`
      };

  return (
    <div className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center">
      <div 
        ref={modalRef}
        className={`absolute bg-gray-800 rounded-lg shadow-2xl flex flex-col ${isFullscreen ? '' : 'min-w-[400px] min-h-[300px]'}`}
        style={modalStyle}
      >
        {/* Header with drag handle and controls */}
        <div 
          className={`flex items-center justify-between p-3 bg-gray-700 ${isFullscreen ? '' : 'rounded-t-lg cursor-move'}`}
          onMouseDown={handleMouseDown}
        >
          <div className="text-white font-medium">Message Preview</div>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded hover:bg-gray-600 transition text-white"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded hover:bg-gray-600 transition text-white"
              title="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="flex-1 p-4 overflow-scroll flex flex-col items-center justify-center">
          {/* Type-specific previews */}
          {message.messageType === "image" && message.mediaUrl && (
            <div className="w-full h-full flex items-center justify-center">
              <div className="relative max-w-full max-h-full">
                <Image
                  src={message.mediaUrl}
                  alt="Image Preview"
                  width={800}
                  height={600}
                  className="max-w-full max-h-full object-contain rounded-lg"
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
            </div>
          )}

          {message.messageType === "video" && message.mediaUrl && (
            <div className="w-full h-full flex items-center justify-center">
              <video 
                controls 
                className="max-w-full max-h-full rounded-lg"
                style={{ width: 'auto', height: 'auto' }}
              >
                <source src={message.mediaUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          {message.messageType === "document" && message.mediaUrl && (
            <div className="flex flex-col items-center gap-4">
              <FileText className="text-blue-400" size={48} />
              <a
                href={message.mediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline font-medium transition"
              >
                View Document
              </a>
            </div>
          )}

          {/* fallback */}
          {!["image", "video", "document"].includes(message.messageType) && (
            <div className="text-gray-400 text-center">
              No preview available for this message type.
            </div>
          )}
        </div>

        {/* Resize handle - only show when not fullscreen */}
        {!isFullscreen && (
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            onMouseDown={handleResizeStart}
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-500 rotate-45"></div>
          </div>
        )}
      </div>
    </div>
  );
};