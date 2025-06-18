"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { getDeviceInfo } from "@/lib/deviceInfo"
import { loginUserSchema, LoginUserSchema } from "@/types/user.validator"
import { useLoginUser } from "@/hooks/auth/useLogin"
import { useRouter } from "next/navigation"
import RedAlert from "@/components/common/RedAlert"
import { useAppDispatch } from "@/lib/store/hooks"
import { logInSuccess } from "@/lib/store/slices/user.slice"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const form = useForm<LoginUserSchema>({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      userEmail: "",
      password: "",
    },
  })
  
const { loginUser, loading, error } = useLoginUser();
const router = useRouter();
const onSubmit = async (data: LoginUserSchema) => {
  console.log("login form submitted", data)
  console.log('Form submitted:', data);

      const deviceInfo = await getDeviceInfo();

      const newData = {...data, device: [deviceInfo]};
      const result = await loginUser(newData);
      console.log("login successfull", result)

      if(result?.success){
        console.log(result)
        dispatch(logInSuccess(result.data));
        console.log("login result", result)
        router.push(`/profile/${result?.data?._id}`)
      }
}


  return (
    <div>
      <div>
        <div className="text-3xl font-semibold w-full flex flex-col items-center">
          Social Desk
        </div>
        <p className='text-md font-semibold w-full mx-auto grid place-items-center mb-5'> 
          Login here to interact with people around the globe. 
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border-2 p-2 rounded-xl shadow-md">
          <h1 className="font-bold text-lg"> Login Form </h1>
          {error && <RedAlert heading="Login Error" description={error} />}
          <FormField
            control={form.control}
            name="userEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email/Username</FormLabel>
                <Input {...field} placeholder="Enter your email or username" />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <Input type="password" {...field} placeholder="Enter your password" />
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full cursor-pointer" disabled={loading}>Login</Button>
          <div> Don&apos;t have an account? 
            <Link href={'/register'} className='text-blue-700 italic underline underline-offset-8'> register here </Link>
          </div>
        </form>
      </Form>
    </div>
  )
}
