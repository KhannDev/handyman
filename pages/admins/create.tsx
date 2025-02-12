import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "@/apis/axios";
import { toast } from "react-toastify";
import Button from "@/components/form/Button";
import Head from "next/head";
import PageHeader from "@/components/layout/PageHeader";
import TextInput from "@/components/form/TextInput";
import useForm from "@/hooks/useForm";
import Select from "@/components/form/Select";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get("/adminRoles");
        setRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchRoles();
  }, []);

  const CreateAdmin = async (data: any) => {
    setLoading(true);

    console.log(data);
    try {
      const response = await axios.post("/admin/create", {
        ...data,
      });

      toast.success("User Successfully Created");

      router.back();

      console.log(response.data);
    } catch (error: any) {
      console.error("Failed to Create Services:", error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      adminRole: "",
    },
  });

  return (
    <>
      <Head>
        <title>Create Service Category - Nasmaakum</title>
      </Head>

      <main className="flex flex-1 flex-col gap-8">
        <PageHeader title="Create Service Category" />

        <form
          className="flex flex-1 flex-col gap-4"
          onSubmit={onSubmit((data) => CreateAdmin(data))}
        >
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-4">
              <TextInput
                disabled={loading}
                label="Name"
                required
                {...getInputProps("name")}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-4">
              <TextInput
                disabled={loading}
                label="Email"
                required
                {...getInputProps("email")}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-1 flex-col gap-4">
              <TextInput
                disabled={loading}
                label="Password"
                required
                {...getInputProps("password")}
              />
            </div>
          </div>

          <Select
            disabled={loading}
            label="Category"
            options={roles.map(({ _id, name }) => ({
              label: name,
              value: _id,
            }))}
            required
            {...getInputProps("adminRole")}
          />

          <div className="mt-4 flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </main>
    </>
  );
}
