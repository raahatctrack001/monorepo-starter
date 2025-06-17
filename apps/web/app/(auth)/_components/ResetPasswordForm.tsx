'use client'

import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { resetPasswordSchema } from '@/types/user.validator'
import { z } from 'zod'

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordForm() {
 
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ResetPasswordFormValues>()

  const [serverError, setServerError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const onSubmit = async (data: ResetPasswordFormValues) => {
    console.log("reset password data", data);

    
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-6 space-y-4 border rounded-lg shadow-md"
    >
      <h2 className="text-xl font-bold">Reset Password</h2>


      <div>
        <label className="block mb-1 font-medium">New Password</label>
        <input
          type="password"
          {...register('password', {
            required: 'New password is required',
            minLength: {
              value: 6,
              message: 'New password must be at least 6 characters',
            },
          })}
          className="w-full border p-2 rounded"
        />
        {errors.password && (
          <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="block mb-1 font-medium">Repeat New Password</label>
        <input
          type="password"
          {...register('repeatPassword', { required: 'Please repeat the new password' })}
          className="w-full border p-2 rounded"
        />
        {errors.repeatPassword && (
          <p className="text-red-600 text-sm mt-1">{errors.repeatPassword.message}</p>
        )}
      </div>

      {serverError && <p className="text-red-600">{serverError}</p>}
      {successMessage && <p className="text-green-600">{successMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        {isSubmitting ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  )
}
