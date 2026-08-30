import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter"
import "react-notion-x/src/styles.css"

import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui"
import { createGetHtmlAttributes, DsfrHeadBase } from "@codegouvfr/react-dsfr/next-app-router/server-only-index"
import { captureException } from "@sentry/nextjs"
import type { Metadata, Viewport } from "next"
import { cookies } from "next/headers"
import Link from "next/link"
import type { PropsWithChildren } from "react"
import { Suspense } from "react"
import type { IUserPublic } from "shared/models/user.model"
import { AuthContextProvider } from "@/context/AuthContext"
import type { ApiError } from "@/utils/api.utils"
import { apiGet } from "@/utils/api.utils"
import { DsfrProvider, StartDsfrOnHydration } from "./DsfrProvider"
import { defaultColorScheme } from "./defaultColorScheme"

const { getHtmlAttributes } = createGetHtmlAttributes({ defaultColorScheme })

async function getSession(): Promise<IUserPublic | undefined> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("bal_session")

    if (!sessionCookie) {
      return
    }

    const session = await apiGet(`/auth/session`, {}, { cache: "no-store" })
    return session
  } catch (error) {
    // 401/403 : cookie de session expiré ou invalide, l'utilisateur est simplement
    // considéré comme déconnecté. Ce n'est pas une erreur applicative.
    const statusCode = (error as ApiError).context?.statusCode
    if (statusCode !== 401 && statusCode !== 403) {
      captureException(error)
    }
    return
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export const metadata: Metadata = {
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/favicon.svg" }],
    apple: [{ url: "/apple-touch-icon.png" }],
    // other: {
    //   rel: '',
    //   url: '/android-chrome-192x192.png',
    //   url: '/android-chrome-512x512.png',
    // },
  },
  title: "BAL",
  description: "BAL apprentissage",
}

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getSession()
  const lang = "fr"
  return (
    <html {...getHtmlAttributes({ lang })}>
      <head>
        <DsfrHeadBase
          Link={Link}
          preloadFonts={[
            //"Marianne-Light",
            //"Marianne-Light_Italic",
            "Marianne-Regular",
            //"Marianne-Regular_Italic",
            "Marianne-Medium",
            //"Marianne-Medium_Italic",
            "Marianne-Bold",
            //"Marianne-Bold_Italic",
            //"Spectral-Regular",
            //"Spectral-ExtraBold"
          ]}
        />
      </head>
      <body>
        <AppRouterCacheProvider>
          <AuthContextProvider initialUser={session}>
            <DsfrProvider lang={lang}>
              <StartDsfrOnHydration />
              <MuiDsfrThemeProvider>
                <Suspense>{children}</Suspense>
              </MuiDsfrThemeProvider>
            </DsfrProvider>
          </AuthContextProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
