import "./globals.css";

import { headers } from "next/headers";

import { IUser } from "../../shared/models/user.model";
import { AuthContextProvider } from "../context/AuthContext";

interface Props {
  children: React.ReactNode;
}

async function getSession(cookie: string): Promise<IUser | null> {
  const response = await fetch(`${process.env.SERVER_URI}/api/auth/session`, {
    headers: {
      cookie,
    },
  });

  const session = await response.json();

  return Object.keys(session).length > 0 && !session.error ? session : null;
}

export default async function RootLayout({ children }: Props) {
  const session = await getSession(headers().get("cookie") ?? "");

  return (
    <html lang="fr">
      <body>
        <AuthContextProvider session={session}>{children}</AuthContextProvider>
      </body>
    </html>
  );
}
