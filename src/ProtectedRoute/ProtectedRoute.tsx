
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import React, { useContext } from "react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const { currentUser } = useContext(AuthContext)
    const router = useRouter()

  const isAuthenticated = currentUser

  if (!isAuthenticated) {
    router.push("Login");
    return null;
  } else {
    return <>{children}</>;
  }
};