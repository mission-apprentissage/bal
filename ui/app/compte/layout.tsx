"use client"
import type { FC, PropsWithChildren } from "react"

import { Redirect } from "@/components/Redirect"
import { useAuth } from "@/context/AuthContext"

const ProfilLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return <Redirect to="/auth/connexion" />
  }

  return <>{children}</>
}

export default ProfilLayout
