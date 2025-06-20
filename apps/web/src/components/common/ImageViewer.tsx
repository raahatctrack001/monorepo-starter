import { Card } from "@/components/ui/card";
import { Maximize2, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ImageViewerProps {
  imageUrl: string;
  caption?: string;
}

export const ImageViewer: React.FC<ImageViewerProps> = ({ imageUrl, caption }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Card className="max-w-lg w-full shadow-md overflow-hidden border-none p-0 bg-gray-100">
        <div className="relative group cursor-pointer" onClick={() => setIsOpen(true)}>
          <Image
            src={imageUrl}
            alt="Attachment"
            width={800}
            height={600}
            className="w-full h-auto object-cover transition-transform duration-300 ease-in-out group-hover:scale-105 rounded-lg"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full p-1 shadow">
            <Maximize2 size={18} className="text-gray-600" />
          </div>
        </div>
        {caption && (
          <div className="p-2 text-center text-sm text-gray-600">{caption}</div>
        )}
      </Card>

      {/* Popup Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black bg-opacity-80 flex items-center justify-center p-4 animate-fade-in">
          <div className="relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-5 -right-5 bg-white p-2 rounded-full shadow hover:bg-gray-100"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <Image
              src={imageUrl}
              alt="Zoomed Attachment"
              width={1200}
              height={800}
              className="max-h-[90vh] w-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      )}
    </>
  );
};
