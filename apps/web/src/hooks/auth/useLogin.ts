import { checkIfUsernameExists, loginUserService } from "@/lib/services/auth.service"
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
      console.log("error deteced @userLoginUser Hook",  error?.response?.data?.message || error.message)
      setError(error?.response?.data?.message || error?.message || "Login Failed! @useLoginUserHook")
      
      return null
    } finally {
      setLoading(false)
    }
  }

  return { loginUser, loading, error }
}

export const useUsernameStatus = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const usernameStatus = async (username: string) => {
    setLoading(true)
    setError(null)

    try {
      const result = await checkIfUsernameExists(username)
      return result
    
    } catch (error: any) {    
      console.log("error finding username status", error)
      console.log("error deteced @useUsernameStatus Hook",  error?.response?.data?.message || error.message)
      setError(error?.response?.data?.message || error?.message || "username status search Failed! @useUsernameStatus")
      
      return null
    } finally {
      setLoading(false)
    }
  }

  return { usernameStatus, loading, error }
}
