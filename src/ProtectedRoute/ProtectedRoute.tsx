
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import { ReactNode, useContext, useEffect, useState } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { currentUser } = useContext(AuthContext)
  const router = useRouter()

  useEffect(() => {
    const session = sessionStorage.getItem("user")
    if (!session) {
      router.push("Login");
    }
  }, []);

  const isAuthenticated = currentUser
  return <>{children}</>;

}
