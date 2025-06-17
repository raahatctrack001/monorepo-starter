import ProtectedRoute from "app/ProtectedRouter";
import React from "react";

export default function Layout({children}: {children: React.ReactNode}){
    return <div>
        <ProtectedRoute>
            {children}
        </ProtectedRoute>
    </div>
}