"use client"

import { ConnexionComponent } from "@/components/connexion/ConnexionComponent"
import { Redirect } from "@/components/Redirect"
import { useAuth } from "@/context/AuthContext"

const ConnexionPage = () => {
  const { user } = useAuth()

  if (user) {
    return <Redirect to="/" />
  }

  return <ConnexionComponent />
}
export default ConnexionPage
