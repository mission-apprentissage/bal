import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";

import { IUser } from "../../shared/models/user.model";
import { api } from "../utils/api.utils";

interface IAuthContext {
  user?: IUser;
  setUser: (user?: IUser) => void;
}

export const AuthContext = createContext<IAuthContext>({
  user: undefined,
  setUser: () => {},
});

export const AuthContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<IUser>();

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await api.get("/auth/session");
        setUser(response.data);
      } catch (error) {
        return;
      }
    };

    getUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
