"use client";

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface FilePreviewDialogProps {
  open: boolean;
  onClose: () => void;
  file: File | null;
  onSend: () => void;
}

export default function FilePreviewDialog({ open, onClose, file, onSend }: FilePreviewDialogProps) {
  if (!file) return null;

  const isImage = file.type.startsWith("image/");

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Preview File</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-3">
          {isImage ? (
            <Image
              src={URL.createObjectURL(file)}
              alt="preview"
              width={300}
              height={300}
              className="rounded-md object-cover"
            />
          ) : (
            <div className="text-sm text-muted-foreground">{file.name}</div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onSend}>Send</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
