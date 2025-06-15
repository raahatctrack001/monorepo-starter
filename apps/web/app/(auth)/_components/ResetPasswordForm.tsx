'use client'

import { useForm } from 'react-hook-form'
import axios from 'axios'
import { useState } from 'react'
import { authApi } from '@/lib/apiEndPoints/authEndPints'

type ResetPasswordFormValues = {
  newPassword: string
  repeatPassword: string
}

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
    if (data.newPassword !== data.repeatPassword) {
      setServerError('New Password and Repeat Password do not match.')
      return
    }

    try {
      setServerError(null)
      setSuccessMessage(null)

      const response = await axios.put(authApi.updatePassword(), {
          newPassword: data.newPassword,
      })

      setSuccessMessage('Password updated successfully!')
      reset()

    } catch (error: any) {
      setServerError(
        error.response?.data?.message || 'Failed to update password.'
      )
    }
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
          {...register('newPassword', {
            required: 'New password is required',
            minLength: {
              value: 6,
              message: 'New password must be at least 6 characters',
            },
          })}
          className="w-full border p-2 rounded"
        />
        {errors.newPassword && (
          <p className="text-red-600 text-sm mt-1">{errors.newPassword.message}</p>
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
