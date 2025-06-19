import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

type LoaderProps = {
  heading?: string;
  description?: string;
};

export default function LocalLoader({ heading, description }: LoaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center p-6"
    >
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      <h1 className="text-sm font-medium mt-2">{heading ?? "Loading..."}</h1>
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </motion.div>
  );
}
