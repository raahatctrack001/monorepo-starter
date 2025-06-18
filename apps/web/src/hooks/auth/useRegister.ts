import { registerUserService } from "@/lib/services/auth.service"
import { RegisterUserSchema } from "@/types/user.validator"
import { useState } from "react"


export const useRegisterUser = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const registerUser = async (data: RegisterUserSchema) => {
    setLoading(true)
    setError(null)

    try {
      const result = await registerUserService(data)
      return result

    } catch (error: any) {    
      console.log("error deteced @userRegisterUser Hook", error.response.data.message)
      setError(error.response.data.message || "Registration Failed! @useRegisterUserHook")
      
      return null
    } finally {
      setLoading(false)
    }
  }

  return { registerUser, loading, error }
}
