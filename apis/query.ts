import axios from "./axios";

import { Buffer } from "buffer";

export const auth = async (
  email: string,
  password: string,
  type: "login" | "signup"
) => {
  const response = await axios.post("/auth/" + type, {
    email,
    password,
    deviceToken: "no-token",
  });
  return response.data;
};

export const logout = async () => {
  const response = await axios.get("/auth/logout");
  return response.data;
};
