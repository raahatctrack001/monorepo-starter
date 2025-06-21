"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorPopupProps {
  open?: boolean;
  onClose: () => void;
  message: string;
  heading?: string;
}

const ErrorPopup: React.FC<ErrorPopupProps> = ({ open = true, onClose, message, heading = "Something went wrong!" }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm rounded-xl p-6">
        <DialogHeader className="flex items-center gap-2 mb-2">
          <AlertTriangle className="text-red-600" />
          <DialogTitle>{heading}</DialogTitle>
        </DialogHeader>
        <div className="text-sm mb-4">
          {message}
        </div>
        <DialogFooter>
          <Button onClick={onClose} variant="default">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ErrorPopup;
