import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { toast } from "react-toastify";
import Button from "@/components/form/Button";
import Head from "next/head";
import PageHeader from "@/components/layout/PageHeader";
import TextInput from "@/components/form/TextInput";
import useForm from "@/hooks/useForm";
import Select from "@/components/form/Select";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

export default function Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const CreateService = async (data: any) => {
    setLoading(true);

    const axios = useAxiosPrivate();

    console.log(data);
    try {
      const response = await axios.post("admin/createAllService", {
        ...data,
        isVerified: true,
      });

      console.log(response.data);
      toast.success("Service Created Successfully");
    } catch (error: any) {
      console.error("Failed to Create Services:", error?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const { onSubmit, getInputProps } = useForm({
    initialValues: {
      name: "",
      category: "",
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
          onSubmit={onSubmit((data) => CreateService(data))}
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

          <Select
            disabled={loading}
            label="Category"
            options={categories.map(({ _id, name }) => ({
              label: name,
              value: _id,
            }))}
            required
            {...getInputProps("category")}
          />

          <div className="mt-4 flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </main>
    </>
  );
}
