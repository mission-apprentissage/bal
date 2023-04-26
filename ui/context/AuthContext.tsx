"use client";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

import { IResGetSession } from "../../shared/routes/auth.routes";

interface IAuthContext {
  user?: IResGetSession;
  setUser: (user?: IResGetSession) => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: undefined,
  setUser: () => {},
});

interface Props extends PropsWithChildren {
  initialUser?: IResGetSession;
}

export const AuthContextProvider: FC<Props> = ({ initialUser, children }) => {
  const [user, setUser] = useState<IResGetSession | undefined>(initialUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
