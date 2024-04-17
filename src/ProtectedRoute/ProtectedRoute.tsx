
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useContext(AuthContext)
    const router = useRouter()
   const  session =sessionStorage.getItem("user")
  const isAuthenticated = currentUser
  console.log(session)

  if (isAuthenticated||session) {
    return <>{children}</>;
  } else {
    router.push("Login");
    return null;
  }
};