"use client"
import { User } from "firebase/auth";
import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { SignOutUser, userStateListener } from "@/config/firebase";
import { toast } from "sonner";

  interface Props {
    children?: ReactNode
  }

  export const AuthContext = createContext({
    // "User" comes from firebase auth-public.d.ts
    currentUser: {} as User | null,
    setCurrentUser: (_user:User) => {},
    signOut: () => {}
  });

  export const AuthProvider = ({ children }: Props) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const navigate = useRouter()

    useEffect(() => {
      const unsubscribe = userStateListener((user) => {
        if (user) {
          setCurrentUser(user)
        }
      });
      return unsubscribe
    }, [setCurrentUser]);

    // As soon as setting the current user to null, 
    // the user will be redirected to the home page. 
    const signOut = () => {
      SignOutUser()
      setCurrentUser(null)
      toast.success("User Logout")
      navigate.push('/')
    }

    const value = {
      currentUser, 
      setCurrentUser,
      signOut
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  }