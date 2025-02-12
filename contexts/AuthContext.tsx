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
  const inDeleteAccountPage = router.pathname === "/delete-account";

  const isLoggedIn = !!auth;
  const token = auth?.token || null;
  const role = auth?.role?.name || null;
  const permissions: any = auth?.role?.permissions || null;

  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");
    if (!storedAuth) {
      if (!inDeleteAccountPage && !inLoginPage) {
        router.push(`/login/?return=${router.pathname}`);
      }
      setLoading(false);
      return;
    }

    try {
      setAuth(JSON.parse(storedAuth) as AuthProps);
    } catch (error) {
      console.error("Error parsing auth data", error);
      localStorage.removeItem("auth");
      setAuth(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!isLoggedIn && inLoginPage) {
      setLoading(false);
    }
  }, [router.pathname, isLoggedIn]);

  const logout = () => {
    setAuth(null);
    localStorage.removeItem("auth");
    router.push("/login");
  };

  const login = (authData: AuthProps) => {
    console.log("AUTHH", authData);
    setAuth(authData);
    localStorage.setItem("auth", JSON.stringify(authData)); // Store the full object
    router.push(returnRoute ? returnRoute.toString() : "/");
  };

  console.log("Role permission", token, role, permissions);

  return (
    <AuthContext.Provider
      value={{
        authLoading: loading,
        isLoggedIn,
        login,
        logout,
        token,
        role,
        permissions,
      }}
    >
      {loading ? null : children}
    </AuthContext.Provider>
  );
}

type AuthProps = {
  token: string;
  role?: { name: string; permissions?: string[] };
};

type AuthContextType = {
  token: string | null;
  role?: string | null;
  permissions?: string[] | null;
  isLoggedIn: boolean;
  logout: () => void;
  login: (auth: AuthProps) => void;
  authLoading: boolean;
};

type AuthProviderProps = {
  children: React.ReactNode;
};
