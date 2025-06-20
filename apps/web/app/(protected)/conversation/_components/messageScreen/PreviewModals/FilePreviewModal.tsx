"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, FileText, Video } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface FilePreviewModalProps {
  files: File[];
  onClose: () => void;
  onSend: (files: File[]) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({ files, onClose, onSend }: FilePreviewModalProps) => {
  const [previewFiles, setPreviewFiles] = useState(files);

  const removeFile = (index: number) => {
    const updated = [...previewFiles];
    updated.splice(index, 1);
    setPreviewFiles(updated);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Preview Attachments</DialogTitle>
        </DialogHeader>

        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {previewFiles.map((file, index) => {
            const url = URL.createObjectURL(file);
            const fileType = file.type;

            return (
              <div key={index} className="flex items-center gap-2 relative group">
                {fileType.startsWith("image/") && (
                  <Image src={url} alt={file.name} width={100} height={80} className="rounded" />
                )}
                {fileType.startsWith("video/") && (
                  <video src={url} className="w-28 h-20 rounded" controls />
                )}
                {fileType === "application/pdf" && (
                  <div className="flex items-center gap-2">
                    <FileText className="text-red-600" />
                    <span className="text-sm">{file.name}</span>
                  </div>
                )}

                {/* Remove Button */}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100"
                  onClick={() => removeFile(index)}
                >
                  <X size={16} />
                </Button>
              </div>
            );
          })}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={previewFiles.length === 0}
            onClick={() => onSend(previewFiles)}
          >
            Send {previewFiles.length > 0 ? `(${previewFiles.length})` : ""}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
