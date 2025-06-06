'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailVerification() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const email = "hello@gmail.com"  // assuming you pass email as query param

  const handleVerify = async () => {
    try {
      const res = await fetch('http://localhost:3010/api/v1/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to verify OTP');
      }
      alert("email verified")
      router.push('/home-page');
      
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4">Verify your Email</h1>
      <p className="mb-4 text-gray-600">Enter the OTP sent to your email</p>

      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        className="border rounded px-4 py-2 mb-4 w-64"
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleVerify}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Verify OTP
      </button>
    </main>
  );
}
