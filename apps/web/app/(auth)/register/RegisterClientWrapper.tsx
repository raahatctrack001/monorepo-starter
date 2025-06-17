"use client";

import { useSearchParams } from "next/navigation";
import RegisterForm from "../_components/RegisterForm";
import EmailVerification from "../_components/EmailVerification";

export default function RegisterClientWrapper() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  console.log("tab", tab);

  if (!tab) {
    return <RegisterForm />;
  }

  return (
    <>
      {tab === "email-verification" && <EmailVerification />}
    </>
  );
}
