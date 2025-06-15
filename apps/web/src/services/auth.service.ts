import { getDeviceInfo } from "@/lib/deviceInfo";

export const loginUser = async (data: {data: {userEmail: string, password: string}})=>{
    const deviceInfo = await getDeviceInfo();
      const newData = { ...data, device: [deviceInfo] };
    
      try {
        const response = await fetch("http://localhost:3010/api/v1/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(newData),
        });
    
        const dataRes = await response.json();
        if (!response.ok) {
          throw new Error(dataRes.message || "Network response wasn't good while logging in");
        }
        return dataRes;
      } catch (error) {
        console.log(error);
      }
}