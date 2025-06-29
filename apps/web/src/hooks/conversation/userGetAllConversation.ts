import { getAllConversation } from "@/lib/services/converstion.service"
import { useState } from "react"

export const useGetAllConversations = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAllConversations = async (creatorId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await getAllConversation(creatorId);
      return result
    
    } catch (error: any) {    
      console.log("error in getting all conversations", error)
      console.log("error deteced @userGetAllConversations Hook", error?.response?.data?.message || error.message)
      setError(error?.response?.data?.message || error.message || "Failed! @useGetAllConversation")
      
      return null
    } finally {
      setLoading(false)
    }
  }

  return { getAllConversations, loading, error }
}