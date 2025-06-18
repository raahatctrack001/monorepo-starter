'use client'

import { Loader2 } from 'lucide-react' // or use any icon lib you prefer
import { motion } from 'framer-motion'

type LoaderProps = {
    heading?: string,
    description?: string,
}
export default function GlobalLoader({heading, description}: LoaderProps) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center space-y-4"
      >
        <Loader2 className="h-12 w-12 animate-spin text-white" />
        <h1 className="text-white text-lg font-medium">{heading ?? "Loading"} </h1>
        <p className='relative bottom-4'> {description ?? "please wait..."} </p>
      </motion.div>
    </div>
  )
}
