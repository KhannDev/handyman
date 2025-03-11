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
  const [deleteLoading, setDeleteLoading] = useState(false);

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

  const updateService = async (data: any) => {
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

  const handleDelete = () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this service?")) return;
    setDeleteLoading(true);
    axios
      .delete(`/allservices/${id}`)
      .then((response) => {
        toast.success("service deleted successfully");
        router.back();
      })
      .catch((error) => {
        console.error("Error deleting service:", error);
        toast.error("Failed to delete service");
      })
      .finally(() => setDeleteLoading(false));
  };

  // const handleApprove = () => {
  //   if (!id) return;
  //   axios
  //     .put(`/allservices/${id}`, { isVerified: true })
  //     .then(() => {})
  //     .catch((error) => {
  //       console.error("Failed to approve partner:", error);
  //     });
  // };

  return (
    <>
      <Head>
        <title>Edit Service - Nasmaakum</title>
      </Head>

      <main className="flex flex-1 flex-col gap-8">
        <PageHeader title="Edit Service" />
        {/* {!getInputProps("isVerified") && (
          <button
            onClick={handleApprove}
            className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          >
            Approve
          </button>
        )} */}

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
            label="Active"
            options={[
              { label: "Yes", value: "true" },
              { label: "No", value: "false" },
            ]}
            required
            {...getInputProps("isVerified")}
          />

          <div className="mt-4 flex justify-end space-x-4">
            {id && (
              <Button
                type="button"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </Button>
            )}
            <Button type="submit">Update</Button>
          </div>
        </form>
      </main>
    </>
  );
}
