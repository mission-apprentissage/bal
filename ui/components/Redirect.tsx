"use client"

import { useRouter } from "next/navigation"
import type { FC } from "react"
import { useEffect } from "react"

interface Props {
  to: string
}

/**
 * Redirection déclarative depuis un composant client.
 *
 * Appeler `router.push()` directement dans le corps du rendu déclenche un effet de bord
 * pendant le rendu : côté serveur, Next tente d'accéder à `location` qui n'existe pas
 * (`ReferenceError: location is not defined`) et bascule la page en rendu client.
 */
export const Redirect: FC<Props> = ({ to }) => {
  const { push } = useRouter()

  useEffect(() => {
    push(to)
  }, [push, to])

  return null
}
