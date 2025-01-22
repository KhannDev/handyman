import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext({} as AuthContextType);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [auth, setAuth] = useState<AuthProps | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const { return: returnRoute } = router.query;
  const inLoginPage = router.pathname === "/login";

  useEffect(() => {
    const inDeleteAccountPage = router.pathname === "/delete-account";
    const auth = localStorage.getItem("authToken");
    if (!auth) {
      if (!inDeleteAccountPage)
        if (!inLoginPage) router.push(`/login/?return=${router.pathname}`);

      setLoading(false);

      return;
    }
    console.log(auth);
    setAuth(JSON.parse(auth) as AuthProps);

    setLoading(false);
  }, []);

  useEffect(() => {
    if (isLoggedIn) return;

    if (inLoginPage) setLoading(false);
  }, [router.pathname]);

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("authToken");
    router.push("/login");
  };

  const login = (auth: AuthProps) => {
    setAuth(auth);
    localStorage.setItem("authToken", JSON.stringify(auth));
    router.push(returnRoute ? returnRoute.toString() : "/");
  };

  const token = auth || null;
  const isLoggedIn = !!auth;

  return (
    <AuthContext.Provider
      value={{
        authLoading: loading,
        isLoggedIn,
        login,
        logout,
        token,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

type AuthProps = { token: string };

type AuthContextType = {
  token: AuthProps | null;
  isLoggedIn?: boolean | null;
  logout: () => void;
  login: ({ token }: AuthProps) => void;
  authLoading: boolean;
};

type AuthProviderProps = {
  children: React.ReactNode;
};
