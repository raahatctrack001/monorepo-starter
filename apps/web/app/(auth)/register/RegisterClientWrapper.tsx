"use client";

import { useSearchParams } from "next/navigation";
import RegisterForm from "../_components/RegisterForm";
import EmailVerification from "../_components/EmailVerification";
import { Email, FullName, Password, Username } from "../_components/register/Register";

export default function RegisterClientWrapper() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  console.log("tab", tab);

  if (!tab) {
    return <RegisterForm />;
  }

  return (
    <div className="w-full flex justify-around">
      {/* <div className="hidden sm:inline w-1/3">
        left screen
      </div> */}
      <div className="w-full mx-5">
        {/* {tab === 'username' && <Username />}
        {tab === 'full-name' && <FullName />}
        {tab === 'email' && <Email />}
        {tab === 'password' && <Password />} */}
        {tab === "email-verification" && <EmailVerification />}
      </div>
    </div>
  );
}
