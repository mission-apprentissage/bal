import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import "react-notion-x/src/styles.css";

import { createGetHtmlAttributes, DsfrHeadBase } from "@codegouvfr/react-dsfr/next-app-router/server-only-index";

import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Suspense } from "react";
import type { PropsWithChildren } from "react";
import type { IUserPublic } from "shared/models/user.model";
import { cookies } from "next/headers";

import { captureException } from "@sentry/nextjs";
import MuiDsfrThemeProvider from "@codegouvfr/react-dsfr/mui";
import { DsfrProvider, StartDsfrOnHydration } from "./DsfrProvider";
import { defaultColorScheme } from "./defaultColorScheme";
import { AuthContextProvider } from "@/context/AuthContext";
import { apiGet } from "@/utils/api.utils";
import type { ApiError } from "@/utils/api.utils";

const { getHtmlAttributes } = createGetHtmlAttributes({ defaultColorScheme });

async function getSession(): Promise<IUserPublic | undefined> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("bal_session");

    if (!sessionCookie) {
      return;
    }

    const session = await apiGet(`/auth/session`, {}, { cache: "no-store" });
    return session;
  } catch (error) {
    if ((error as ApiError).context?.statusCode !== 401) {
      captureException(error);
    }
    return;
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

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
};

export default async function RootLayout({ children }: PropsWithChildren) {
  const session = await getSession();
  const lang = "fr";
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
  );
}
