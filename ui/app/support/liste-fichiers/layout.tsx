"use client"
import type { FC, PropsWithChildren } from "react"
import React from "react"

import { Redirect } from "@/components/Redirect"
import { useAuth } from "@/context/AuthContext"

const ListeDiffusionLayout: FC<PropsWithChildren> = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return <Redirect to="/auth/connexion" />
  }

  if (!user.is_support && !user.is_admin) {
    return <Redirect to="/404" />
  }

  return <>{children}</>
}

export default ListeDiffusionLayout
