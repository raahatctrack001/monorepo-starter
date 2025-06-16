"use client"

import { useParams } from 'next/navigation';
export default function Dashboard(){
    const { userId } = useParams();
    return <div> DashBoard components UserId: {userId}</div>
}