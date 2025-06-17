"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usernameSchema } from "@/types/user.validator";
import { ArrowBigRight } from "lucide-react";
import { useRouter } from "next/navigation";

// Schema
const usernameZodSchema = z.object({
  username: usernameSchema,
});

type FormData = z.infer<typeof usernameZodSchema>;

export default function UsernameForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(usernameZodSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = (data: FormData) => {
    console.log("Submitted data:", data);
    localStorage.setItem("username@social", data.username);
    router.push("/register?tab=password")
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted">
      <Card className="w-full max-w-3xl">
        <CardHeader className="">
          <CardTitle className="text-2xl text-center">Username</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="username" className="pb-2">Username</Label>
              <Input
                id="username"
                placeholder="Enter username"
                {...register("username")}
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              next <ArrowBigRight />
            </Button>
          </form>
        </CardContent>
      </Card>
      <div className="w-full flex justify-between">
        <div></div>
        <ArrowBigRight />
      </div>
    </div>
  );
}
