import { axiosPrivate } from "../apis/axios";
import { useContext, useEffect } from "react";

import { useAuth } from "@/contexts/AuthContext";

const useAxiosPrivate = () => {
  const { token } = useAuth();

  useEffect(() => {
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config: any) => {
        config.headers["x-access-token"] = `${token}`;

        return config;
      },
      (error) => Promise.reject(error)
    );
    ``;

    // const responseIntercept = axiosPrivate.interceptors.response.use(
    //   (response) => response,
    //   async (error) => {
    //     const prevRequest = error?.config;
    //     // if (
    //     //   error?.response?.status === 403 ||
    //     //   (error?.response?.status === 401 && !prevRequest?.sent)
    //     // ) {
    //     //   prevRequest.sent = true;
    //     //   const newAccessToken = await refresh();
    //     //   prevRequest.headers!.Authorization = `Bearer ${newAccessToken}`;
    //     //   return axiosPrivate(prevRequest);
    //     // }
    //     // if (error.response.status === 401) {
    //     //   dispatch(AccountStatus.NEW);
    //     // }

    //     return Promise.reject(error);
    //   }
    // );

    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      // axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [token]);

  return axiosPrivate;
};

export default useAxiosPrivate;
