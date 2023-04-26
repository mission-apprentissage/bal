import "./globals.css";
import "react-notion-x/src/styles.css";

import { Metadata } from "next";
import { headers } from "next/headers";
import { PropsWithChildren } from "react";

import { IUser } from "../../shared/models/user.model";
import { AuthContextProvider } from "../context/AuthContext";

async function getSession() {
  const response = await fetch(
    `${process.env.NEXT_SERVER_URI}/api/auth/session`,
    {
      headers: {
        cookie: headers().get("cookie") ?? "",
      },
    }
  );

  const session: IUser = await response.json();

  if (!response.ok || session.error) {
    return;
  }

  return session;
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

  return (
    <html lang="fr">
      <body>
        <AuthContextProvider initialUser={session}>
          {children}
        </AuthContextProvider>
      </body>
    </html>
  );
}
