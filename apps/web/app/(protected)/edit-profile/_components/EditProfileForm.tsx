"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const formSchema = z.object({
  fullName: z.string().min(3, "Full Name is required"),
  username: z.string().min(3, "Username is required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().optional(),
  bio: z.string().optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  birthday: z.string().optional(),
  themePreference: z.enum(["light", "dark", "system"]),
  language: z.string().optional(),
  preferredCatory: z.array(z.string()).optional(),
  website: z
    .array(
      z.object({
        name: z.string(),
        desc: z.string(),
        url: z.string().url("Invalid URL"),
      })
    )
    .optional(),
});

type ProfileFormData = z.infer<typeof formSchema>;

export default function EditProfileForm() {
  const form = useForm<ProfileFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      preferredCatory: [],
      website: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "website",
  });

  const onSubmit = (data: ProfileFormData) => {
    console.log("Profile data:", data);
    // API call here
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <h1 className="font-bold text-xl md:text-3xl"> Edit Profile </h1>
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Your Name" {...field} />
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
                <Input placeholder="Unique Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="Phone" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Write about yourself..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birthday</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="themePreference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Theme Preference</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Theme" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Language</FormLabel>
              <FormControl>
                <Input placeholder="English" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Dynamic Website Fields */}
        <div>
          <FormLabel className="text-base">Websites</FormLabel>
          {fields.map((fieldItem, index) => (
            <div key={fieldItem.id} className="space-y-2 border p-3 rounded-md mb-2">
              <Input
                placeholder="Name"
                {...form.register(`website.${index}.name`)}
              />
              <Input
                placeholder="Description"
                {...form.register(`website.${index}.desc`)}
              />
              <Input
                placeholder="URL"
                {...form.register(`website.${index}.url`)}
              />
              <Button
                type="button"
                variant="destructive"
                onClick={() => remove(index)}
                size="sm"
              >
                Remove
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={() => append({ name: "", desc: "", url: "" })}
          >
            Add Website
          </Button>
        </div>

        <Button type="submit" className="w-full">Save Profile</Button>
      </form>
    </Form>
  );
}
