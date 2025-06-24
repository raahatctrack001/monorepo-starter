
import { getMessageByConversation } from "@/lib/services/message.service"
import { useState } from "react"


export const useGetMessageByConversation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAllMessageByConversation = async (conversationId: string, userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await getMessageByConversation(conversationId, userId)
      return result
    
    } catch (error: any) {    
      console.log("error in get all message by conversation in", error)
      console.log("error deteced @useGetAllMessageByConversation Hook", error?.response?.data?.message)
      setError(error?.response?.data?.message || error.message ||  "Get All Message by conversation Failed! @useGetAllMessageByConversationHook")
      
      return null
    } finally {
      setLoading(false)
    }
  }

  return { getAllMessageByConversation, loading, error }
}
