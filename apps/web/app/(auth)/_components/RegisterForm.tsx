// components/RegisterForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterUserSchema, registerUserSchema }  from '../../../src/types/user.validator';
import { Input } from '../../../src/components/ui/input';
import { Button } from '../../../src/components/ui/button';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../../../src/components/ui/form';
import { useRouter } from 'next/navigation';
import { getDeviceInfo } from '@/lib/deviceInfo';
import { useRegisterUser } from '@/hooks/auth/useRegister';
import RedAlert from '@/components/common/RedAlert';
import Link from 'next/link';

export default function RegisterForm() {
    const router = useRouter();  
    const form = useForm<RegisterUserSchema>({
      resolver: zodResolver(registerUserSchema),
      defaultValues: {
        email: '',
        fullName: '',
        username: '',
        password: '',
        repeatPassword: '',
      },
    });
  
    const {registerUser, loading, error } = useRegisterUser();
    const onSubmit = async (data: RegisterUserSchema) => {
      console.log('Form submitted:', data);

      const deviceInfo = await getDeviceInfo();

      const newData = {...data, device: [deviceInfo]};
      const result = await registerUser(newData);
      console.log("registration successfull", result)

      if(result?.success){
        localStorage.setItem("user_detail@social", JSON.stringify(result))
        router.push("/homepage")
      }
    }
    return (
        <div className='w-full min-h-screen flex flex-col justify-center items-center mx-2'>
          <div>
            <div className="text-3xl font-semibold w-full flex flex-col items-center">
              Social Desk
            </div>
            <p className='text-md font-semibold w-full mx-auto grid place-items-center mb-5'> 
              Register here to interact with people around the globe. 
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-3xl space-y-6 border-2 p-5 rounded-xl shadow-xl">
            <h1 className="font-bold text-lg"> Registration Form </h1>
              
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
  
              {error && <RedAlert heading='Registration Error' description={error} />}
              <Button type="submit" className="w-full" disabled={loading}>
                Register
              </Button>
              <div> Already have an account? 
                <Link href={'/login'} className='text-blue-700 italic underline underline-offset-8'> login here </Link>
              </div>
            </form>
          </Form>
      </div>
    );
} 
  
  