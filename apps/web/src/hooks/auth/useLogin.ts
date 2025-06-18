import { loginUserService } from "@/lib/services/auth.service"
import { LoginUserSchema } from "@/types/user.validator"
import { useState } from "react"


export const useLoginUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loginUser = async (data: LoginUserSchema) => {
    setLoading(true)
    setError(null)

    try {
      const result = await loginUserService(data)
      return result
    
    } catch (error: any) {    
      console.log("error in loggin in", error)
      console.log("error deteced @userLoginUser Hook", error.response.data.message)
      setError(error.response.data.message || "Login Failed! @useLoginUserHook")
      
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loginUser, loading, error }
}
