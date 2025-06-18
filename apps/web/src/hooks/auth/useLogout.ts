import { logoutUserService } from "@/lib/services/auth.service"
import { LoginUserSchema } from "@/types/user.validator"
import { useState } from "react"


export const useLogoutUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const logoutUser = async (data: {token: string}) => {
    setLoading(true)
    setError(null)

    try {
      const result = await logoutUserService(data)
      return result
    
    } catch (error: any) {    
      console.log("error in logout", error)
      console.log("error deteced @userLogoutUser Hook", error.response.data.message)
      setError(error.response.data.message || "LogoutFailed! @useLoginUserHook")
      
      return null
    } finally {
      setLoading(false)
    }
  }

  return { logoutUser, loading, error }
}
