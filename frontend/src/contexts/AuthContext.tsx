import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router";
import { RoutesEnum } from "../AppRoutes.tsx";
import {
  AuthHeadersFragment,
  useMeQuery,
  UserUnion,
  useSignInMutation,
  useSignOutMutation,
} from "../generated/graphql.tsx";

export type User = UserUnion;
interface AuthContextType {
  user: UserUnion | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string,
  ) => Promise<{
    success: boolean;
    errors?: Array<{ field: string; message: string }>;
  }>;
  logout: () => Promise<void>;
}

const setHeaders = (tokens?: AuthHeadersFragment | null) => {
  const token = tokens?.authorization?.replace("Bearer ", "") || "";
  const decoded = token ? JSON.parse(atob(token)) : "";
  localStorage.setItem("access-token", decoded["access-token"] || "");
  localStorage.setItem("authorization", tokens?.authorization || "");
  localStorage.setItem("client", tokens?.client || "");
  localStorage.setItem("expiry", tokens?.expiry?.toString() || "");
  localStorage.setItem("uid", tokens?.uid || "");
  localStorage.setItem("token-type", tokens?.tokenType || "");
};

export const getHeaders = () => {
  const accessToken = localStorage.getItem("access-token") || "";
  const client = localStorage.getItem("client") || "";
  const uid = localStorage.getItem("uid") || "";
  const expiry = localStorage.getItem("expiry") || "";
  return {
    "access-token": accessToken,
    client: client,
    uid: uid,
    expiry: expiry,
  };
};

const clearHeaders = () => {
  localStorage.removeItem("access-token");
  localStorage.removeItem("client");
  localStorage.removeItem("uid");
  localStorage.removeItem("expiry");
  localStorage.removeItem("authorization");
  localStorage.removeItem("token-type");
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [{ data, fetching }] = useMeQuery();
  const [, signInMutation] = useSignInMutation();
  const [, signOutMutation] = useSignOutMutation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!fetching) {
      if (data?.me) {
        setUser(data.me as unknown as User);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [data, fetching]);

  const login = async (email: string, password: string) => {
    const response = await signInMutation({
      input: {
        email,
        password,
      },
    });

    if (response.data?.signIn) {
      setHeaders(response.data.signIn.headers);
      setUser(response.data.signIn.user as unknown as User);
      return { success: true };
    }

    return {
      success: false,
      errors: [{ field: "general", message: "Login failed" }],
    };
  };

  const logout = async () => {
    await signOutMutation({});
    clearHeaders();
    setUser(null);
    navigate(RoutesEnum.Login);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
