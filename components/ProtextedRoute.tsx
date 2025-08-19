 'use client'

import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/router"
import { useEffect } from "react"

const ProtectedRoute = ({children}: {children: React.ReactNode}) => {
     const { state } = useAuth()
     const router = useRouter()

     useEffect(() => {
         if (!state.user && !state.isLoading) {
             router.push("/login")
         }
     }, [state.user, state.isLoading, router])

     
     if(!state.user) {
        return <p className="text-center mt-20">Redirecting...</p>
     }
  return (
    <div>{children}</div>
  )
}

export default ProtectedRoute