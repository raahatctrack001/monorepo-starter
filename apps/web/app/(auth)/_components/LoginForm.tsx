"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { getDeviceInfo } from "@/lib/deviceInfo"
import { LoginUserSchema } from "@/types/user.validator"
import { useLoginUser } from "@/hooks/auth/useLogin"
import { useRouter } from "next/navigation"
import RedAlert from "@/components/common/RedAlert"
import { useAppDispatch } from "@/lib/store/hooks"
import { signInSuccess } from "@/lib/store/slices/user.slice"

export default function LoginForm() {
  const dispatch = useAppDispatch();
  const form = useForm<LoginUserSchema>({
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
        dispatch(signInSuccess(result.data));
        console.log(result)
        localStorage.setItem("user_detail@login", JSON.stringify(result))
        // router.push("/dashboard")
      }
}


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border-2 p-2 rounded-xl shadow-md">
        <h1 className="font-bold text-lg"> Login Form </h1>
        {error && <RedAlert heading="Login Error" description={error} />}
        <FormField
          control={form.control}
          name="userEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <Input {...field} placeholder="Enter your email" />
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
        <Button type="submit">Login</Button>
      </form>
    </Form>
  )
}
