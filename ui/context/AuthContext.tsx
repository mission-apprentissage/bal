"use client";
import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useState,
} from "react";

import { IUser } from "../../shared/models/user.model";

interface IAuthContext {
  user?: IUser;
  setUser: (user?: IUser) => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: undefined,
  setUser: () => {},
});

export const AuthContextProvider: FC<
  PropsWithChildren<{ session: IUser | null }>
> = ({ session, children }) => {
  const [user, setUser] = useState<IUser | undefined>(session as IUser);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
