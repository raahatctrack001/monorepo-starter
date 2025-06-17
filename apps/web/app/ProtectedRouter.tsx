'use client';

import { useAppSelector } from '@/lib/store/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { currentUser } = useAppSelector((state) => state.user);
  console.log("currentUser is: ",currentUser)
  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');  // or '/register' if you want
    }
  }, [currentUser, router]);

  if (!currentUser) return null; // or a loader component

  return <>{children}</>;
}
