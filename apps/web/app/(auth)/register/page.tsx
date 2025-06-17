import { Suspense } from "react";
import RegisterClientWrapper from "./RegisterClientWrapper";


export default function RegisterUserPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterClientWrapper />
    </Suspense>
  );
}
