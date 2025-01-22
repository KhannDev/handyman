import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import Button from "@/components/form/Button";
import Head from "next/head";
import React, { useEffect } from "react";
import TextInput from "@/components/form/TextInput";
import axios from "@/apis/axios";
import { toast } from "react-toastify";

export default function Page() {
  const { isLoggedIn, login: loginToApp } = useAuth();
  const router = useRouter();
  const { return: returnRoute } = router.query;

  useEffect(() => {
    if (!isLoggedIn) return;

    router.push(returnRoute?.toString() || "/");
  }, [isLoggedIn, router, returnRoute]);

  const form = useForm({
    initialValues: { email: "", password: "" },
  });

  const Submit = async (values: { email: string; password: string }) => {
    try {
      console.log(values.email, values.password);

      const response = await axios.post("/Auth/login/admin", {
        email: values.email,
        password: values.password,
      });

      console.log(response);

      // Assuming login is successful
      if (response.data?.token) {
        toast.success("Login successful!");
        loginToApp(response.data.token); // Update the auth context
        router.push(returnRoute?.toString() || "/");
      } else {
        toast.error(response.data?.message || "Login failed");
      }
    } catch (error: any) {
      console.error("Login Error:", error.response?.data?.message);
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  return (
    <>
      <Head>
        <title>Login - Nasmaakum</title>
      </Head>

      <div className="flex flex-1 items-center justify-center">
        <form
          className="flex max-w-lg flex-1 flex-col gap-2"
          onSubmit={form.onSubmit(Submit)}
        >
          <TextInput
            label="Email"
            type="email"
            required
            {...form.getInputProps("email")}
          />

          <TextInput
            label="Password"
            type="password"
            required
            {...form.getInputProps("password")}
          />

          <div className="mt-4 flex justify-end">
            <Button type="submit">Login</Button>
          </div>
        </form>
      </div>
    </>
  );
}
