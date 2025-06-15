"use client";

import { loginUser } from "@/services/auth.service";
import { useState } from "react";

export const useLogin = ()=>{
    const [loading, setLoading] = useState(false);

    const login = async (data: string)=>{
        setLoading(true);
        try {
            const result = await loginUser(data);
            return result;
        } 
        catch (error) {
            console.error(error)
        }
        finally{
            setLoading(false);
        }
    };

    return {loading, login}
}