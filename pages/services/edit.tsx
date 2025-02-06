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

export default function EditServicePage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  const { onSubmit, getInputProps, setValues } = useForm({
    initialValues: {
      name: "",
      category: "",
      isVerified: "false",
    },
  });

  useEffect(() => {
    if (!id) return;

    const fetchService = async () => {
      try {
        const response = await axios.get(`/allservices/${id}`);
        const { name, category, isVerified } = response.data;
        setValues({
          name,
          category: category?._id || "",
          isVerified: isVerified ? "true" : "false",
        });
      } catch (error) {
        console.error("Failed to fetch service details:", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("/categories");
        setCategories(response.data.categories);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchService();
    fetchCategories();
  }, [id]);

  const updateService = async (data) => {
    setLoading(true);
    try {
      await axios.patch(`/allservices/${id}`, {
        ...data,
        isVerified: data.isVerified === "true",
      });
      toast.success("Service updated successfully!");
      router.push("/services");
    } catch (error) {
      console.error("Failed to update service:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Edit Service - Nasmaakum</title>
      </Head>

      <main className="flex flex-1 flex-col gap-8">
        <PageHeader title="Edit Service" />

        <form
          className="flex flex-1 flex-col gap-4"
          onSubmit={onSubmit(updateService)}
        >
          <TextInput
            disabled={loading}
            label="Name"
            required
            {...getInputProps("name")}
          />

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

          <Select
            disabled={loading}
            label="Verified"
            options={[
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ]}
            required
            {...getInputProps("isVerified")}
          />

          <div className="mt-4 flex justify-end">
            <Button type="submit">Update</Button>
          </div>
        </form>
      </main>
    </>
  );
}
