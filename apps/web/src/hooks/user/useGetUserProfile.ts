import { getUserProfile } from "@/lib/services/user.services"
import { useState } from "react"


export const useGetUserProfile = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getUser = async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await getUserProfile(userId)
      return result
    
    } catch (error: any) {    
      console.log("error in get user profile in", error)
      console.log("error deteced @useGetUserProfile Hook", error?.response?.data?.message || error.message)
      setError(error?.response?.data?.message || error.message || "Get User Profile Failed! @useLoginUserHook")
      
      return null
    } finally {
      setLoading(false)
    }
  }

  return { getUser, loading, error }
}
