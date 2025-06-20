'use client';

import { authApi } from '@/lib/apiEndPoints/authEndPints';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logOutSuccess } from '@/lib/store/slices/user.slice';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { currentUser } = useAppSelector((state) => state.user);
  const theme = currentUser?.themePreference || "dark"
  const { setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    setTheme(theme);
    if (!currentUser) {
      router.replace('/login');  // or '/register' if you want
    }
  }, [currentUser, router]);

  if (!currentUser) return null; // or a loader component

  return <>{children}</>;
}
