import "./globals.css";
import "react-notion-x/src/styles.css";

import { headers } from "next/headers";
import { PropsWithChildren } from "react";

import { IResGetSession } from "../../shared/routes/auth.routes";
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

  const session: IResGetSession = await response.json();

  if (!response.ok || session.error) {
    return;
  }

  return session;
}

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
