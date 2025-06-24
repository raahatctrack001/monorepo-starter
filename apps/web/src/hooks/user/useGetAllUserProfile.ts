
import { getAllUserProfile } from "@/lib/services/user.services"
import { useState } from "react"


export const useGetAllUserProfile = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAllUser = async (userId: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await getAllUserProfile(userId)
      return result
    
    } catch (error: any) {    
      console.log("error in get all user profile in", error)
      console.log("error deteced @useAllGetUserProfile Hook", error?.response?.data?.message)
      setError(error?.response?.data?.message || error.message || "Get All User Profile Failed! @useLoginUserHook")
      
      return null
    } finally {
      setLoading(false)
    }
  }

  return { getAllUser, loading, error }
}
