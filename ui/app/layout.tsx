import "./globals.css";
import "react-notion-x/src/styles.css";

import { DsfrHead } from "@codegouvfr/react-dsfr/next-appdir/DsfrHead";
import { DsfrProvider } from "@codegouvfr/react-dsfr/next-appdir/DsfrProvider";
import { getHtmlAttributes } from "@codegouvfr/react-dsfr/next-appdir/getHtmlAttributes";
import type { Metadata } from "next";
import Link from "next/link";
import type { PropsWithChildren } from "react";
import type { IUserPublic } from "shared/models/user.model";
import { cookies } from "next/headers";

import { StartDsfr } from "./StartDsfr";
import { AuthContextProvider } from "@/context/AuthContext";
import { defaultColorScheme } from "@/theme/defaultColorScheme";
import { apiGet } from "@/utils/api.utils";

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
    console.log(error);
    return;
  }
}

export const metadata: Metadata = {
  viewport: "width=device-width, initial-scale=1",
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
    <html {...getHtmlAttributes({ defaultColorScheme, lang })}>
      <head>
        <StartDsfr />
        <DsfrHead
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
        <AuthContextProvider initialUser={session}>
          <DsfrProvider lang={lang}>{children}</DsfrProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}
