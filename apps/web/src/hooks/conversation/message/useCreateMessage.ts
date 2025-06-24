
import { createMessage } from "@/lib/services/message.service"
import { useState } from "react"

export const useCreateMessage = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = async (body: any, conversationId: string, senderId: string) => {
    setLoading(true)
    setError(null)

    try {
      if(!conversationId || !senderId){
        throw new Error("conversationId or senderId is missing")
      }
      
      const result = await createMessage(body, conversationId?.toString(), senderId?.toString())
      return result
    
    } catch (error: any) {    
      console.log("error in create message hook", error)
      console.log("error deteced @useCreateMessage Hook", error?.response?.data?.message)
      setError(error?.response?.data?.message || error.message || "Create Message Failed! @useCreateMessage")
      
      return null
    } finally {
      setLoading(false)
    }
  }

  return { sendMessage, loading, error }
}
