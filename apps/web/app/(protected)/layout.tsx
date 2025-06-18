import Sidebar from "@/components/common/sidebar/Sidebar";
import ProtectedRoute from "app/ProtectedRouter";
import React from "react";

export default function Layout({children}: {children: React.ReactNode}){
    return <ProtectedRoute>
            <div className="flex w-full">
                <Sidebar />
                <div className="w-full">
                    {children}
                </div>
            </div>
        </ProtectedRoute>
}