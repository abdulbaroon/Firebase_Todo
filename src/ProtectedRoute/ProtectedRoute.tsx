
import { AuthContext } from "@/context/auth-context";
import { useRouter } from "next/navigation";
import  { ReactNode, useContext, useEffect, useState } from "react";

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const [session,setSession]=useState(false)
    const { currentUser } = useContext(AuthContext)
    const router = useRouter()
    
    useEffect(() => {
     const  session =sessionStorage.getItem("user")
     if(session){
      setSession(true)
     }else{
      setSession(false)
     }
  }, []);

  const isAuthenticated = currentUser
  console.log(session)

  if (isAuthenticated||session) {
    return <>{children}</>;
  } else {
    router.push("Login");
    return null;
  }
};
