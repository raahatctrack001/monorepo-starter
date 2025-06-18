'use client';

import { authApi } from '@/lib/apiEndPoints/authEndPints';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { logOutSuccess } from '@/lib/store/slices/user.slice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const { currentUser } = useAppSelector((state) => state.user);
  // const dispatch = useAppDispatch();

  // useEffect(()=>{
  //   (async ()=>{
  //     const response = await fetch(authApi.isUserAuthenticated(), {method: "POST"});
  //     const data = await response.json();
  //     if(!data.success){
  //       console.log("checked authentication")
  //       dispatch(logOutSuccess());
  //     }
  //   })()
  // }, [dispatch])

  const router = useRouter();

  useEffect(() => {
    if (!currentUser) {
      router.replace('/login');  // or '/register' if you want
    }
  }, [currentUser, router]);

  if (!currentUser) return null; // or a loader component

  return <>{children}</>;
}
