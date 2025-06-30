import { getUndeliveredUnseenMessages } from "@/lib/services/message.service"
import { searchUsers } from "@/lib/services/user.services"
import { useState } from "react"

export const useUnseenMessages = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const messages = async (creatorId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await getUndeliveredUnseenMessages(creatorId);
      return result
    
    } catch (error: any) {    
      console.log("error in getUndeliveredUnseenMessages", error)
      console.log("error deteced @getUndeliveredUnseenMessages Hook", error?.response?.data?.message || error.message)
      setError(error?.response?.data?.message || error.message || "Failed! @ugetUndeliveredUnseenMessages")
      
      return null
    } finally {
      setLoading(false)
    }
  }

  return { messages, loading, error }
}