"use client"

import type { PropsWithChildren } from "react"
import { useAuth } from "@/context/AuthContext"
import { ConnexionComponent } from "./ConnexionComponent"

export function LoggedUser({ children }: PropsWithChildren) {
  const { user } = useAuth()

  if (!user) {
    return <ConnexionComponent />
  }

  return <>{children}</>
}
