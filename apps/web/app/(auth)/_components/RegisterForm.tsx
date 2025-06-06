// components/RegisterForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { registerUserSchema }  from '../../../src/types/user.validator';
import { Input } from '../../../src/components/ui/input';
import { Button } from '../../../src/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../../src/components/ui/form';
import { useRouter } from 'next/navigation';

type RegisterUserInput = z.infer<typeof registerUserSchema>;

export default function RegisterForm() {
    const router = useRouter();  
    const form = useForm<RegisterUserInput>({
      resolver: zodResolver(registerUserSchema),
      defaultValues: {
        email: '',
        fullName: '',
        username: '',
        password: '',
        repeatPassword: ''
      },
    });
  
    const onSubmit = async (data: RegisterUserInput) => {
      console.log('Form submitted:', data);
      // Handle form submission logic here
    
      try {
          const formData = new FormData();
          Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
          });
        
          const response = await fetch("http://localhost:3010/api/v1/auth/register", {
            method: "POST",
            body: formData,
          })
          
          console.log(response)
          const recData = await response.json(); //recieved data
          console.log(recData)
          if(!recData?.success){
            throw new Error(recData.statusCode||500, recData.message||"Network error");
          }
          
          localStorage.setItem("email", recData?.email);
          router.push("/email-verification"); 
          
      } catch (error) {
        console.log(error)
      }
    };

    return (
        <div className='w-full min-h-screen flex justify-center items-center mx-2'>
          <Form {...form} >
    
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-xl space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
  
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
  
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="john_doe" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
  
              <FormField
                control={form.control}
                name="repeatPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Repeat Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="********" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                />
  
              <Button type="submit" className="w-full">
                Register
              </Button>
            </form>
          </Form>
      </div>
    );
} 
  
  