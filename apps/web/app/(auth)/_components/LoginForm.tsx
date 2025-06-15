"use client"

import { useForm } from "react-hook-form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { getDeviceInfo } from "@/lib/deviceInfo"

type LoginFormValues = {
  userEmail: string
  password: string
}

export default function LoginForm() {
  const form = useForm<LoginFormValues>({
    defaultValues: {
      userEmail: "",
      password: "",
    },
  })

  

const onSubmit = async (data: LoginFormValues) => {
  const deviceInfo = await getDeviceInfo();
  const newData = { ...data, device: [deviceInfo] };

  try {
    const response = await fetch("http://localhost:3010/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newData),
    });

    const dataRes = await response.json();
    if (!response.ok) {
      throw new Error(dataRes.message || "Network response wasn't good while logging in");
    }
    console.log(dataRes);
  } catch (error) {
    console.log(error);
  }
}


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border-2 p-2 rounded-xl shadow-md">
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
