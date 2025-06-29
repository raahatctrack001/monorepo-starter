import { searchUsers } from "@/lib/services/user.services"
import { useState } from "react"

export const useSearchUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchUser = async (creatorId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await searchUsers(creatorId);
      return result
    
    } catch (error: any) {    
      console.log("error in searching users in conversation list", error)
      console.log("error deteced @userSearchUser Hook", error?.response?.data?.message || error.message)
      setError(error?.response?.data?.message || error.message || "Failed! @useSearchUser")
      
      return null
    } finally {
      setLoading(false)
    }
  }

  return { searchUser, loading, error }
}