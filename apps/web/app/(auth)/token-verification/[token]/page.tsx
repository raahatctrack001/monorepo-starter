
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { isReady, query } = router;
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!isReady) return; // Wait until router is ready

    const { token } = query;
    if (token) {
      axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password/${token}`)
        .then(() => setIsValid(true))
        .catch(() => setIsValid(false));
    }
  }, [isReady, query]);

  const handleReset = async () => {
    const { token } = query;
    if (!token) return;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/reset-password/${token}`, {
        newPassword: password,
      });
      alert('Password successfully reset!');
      router.push('/login');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error resetting password.');
    }
  };

  if (!isReady) return null;
  if (isValid === null) return <p>Checking token validity…</p>;
  if (isValid === false) return <p>Invalid or expired reset link.</p>;

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h1>Reset Your Password</h1>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: 'block', margin: '1rem 0' }}
      />
      <input
        type="password"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        style={{ display: 'block', margin: '1rem 0' }}
      />
      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}
