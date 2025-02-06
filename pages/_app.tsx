import "@/styles/globals.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
// import APIProvider from "@/providers/APIProvider";
import AuthProvider, { useAuth } from "@/contexts/AuthContext";

import Sidebar from "@/components/layout/Sidebar";
import type { AppProps } from "next/app";
import Header from "@/components/layout/Header";

function App({ Component, pageProps }: AppProps) {
  const { isLoggedIn, authLoading } = useAuth();
  const router = useRouter();

  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    setShowSidebar(false);
  }, [router.pathname]);

  console.log(isLoggedIn, "IsLoggedIn");
  return (
    <div className="flex min-h-screen flex-col bg-gray-50 text-gray-900">
      <Header setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
      <div className="mt-16 flex flex-1 md:mt-12 ">
        {isLoggedIn && (
          <Sidebar setShowSidebar={setShowSidebar} showSidebar={showSidebar} />
        )}

        <div className="flex flex-1 justify-center">
          <div className="flex max-w-7xl flex-1 p-4">
            {authLoading ? null : <Component pageProps={pageProps} />}

            <ToastContainer position="bottom-right" />
          </div>
        </div>
      </div>
    </div>
  );
}

function withProviders(
  App: ({ Component, pageProps }: AppProps) => React.ReactNode
) {
  return (props: AppProps) => (
    <AuthProvider>
      <App {...props} />
    </AuthProvider>
  );
}

export default withProviders(App);
