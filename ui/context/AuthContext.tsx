"use client";
import type { FC, PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import type { IUserPublic } from "shared/models/user.model";

interface IAuthContext {
  user?: IUserPublic;
  setUser: (user?: IUserPublic) => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: undefined,
  setUser: () => {},
});

interface Props extends PropsWithChildren {
  initialUser?: IUserPublic;
}

export const AuthContextProvider: FC<Props> = ({ initialUser, children }) => {
  const [user, setUser] = useState<IUserPublic | undefined>(initialUser);

  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
