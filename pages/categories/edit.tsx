// Page.tsx
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Button from "@/components/form/Button";
import Head from "next/head";
import UploadImage from "@/components/form/ImageInput"; // our UploadImage component
import PageHeader from "@/components/layout/PageHeader";
import TextInput from "@/components/form/TextInput";
import useForm from "@/hooks/useForm";
import axios from "@/apis/axios";

export default function Page() {
  const router = useRouter();
  const { id } = router.query; // category id for edit mode
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Initialize the form. Make sure useForm exposes a setValues method.
  const { onSubmit, getInputProps, setValues, allowNavigation } = useForm({
    initialValues: {
      imageUrl: "",
      name: "",
    },
  });

  // Fetch category data if we are in edit mode (i.e. id exists)
  useEffect(() => {
    if (id) {
      axios
        .get(`/categories/${id}`)
        .then((response) => {
          // Assuming your response data is an object { imageUrl, name }
          const { imageUrl, name } = response.data;

          console.log("response data", response.data);
          setValues({ imageUrl, name });
        })
        .catch((error) => {
          console.error("Error fetching category:", error);
          toast.error("Failed to load category details");
        });
    }
  }, [id, setValues]);

  // Submit handler: use PUT for editing, POST for creating
  const handleSubmit = (data) => {
    setLoading(true);

    console.log;

    // Edit mode: update the category
    axios
      .put(`/categories/${id}`, { ...data, isActive: true })
      .then((response) => {
        toast.success("Category updated successfully");
        router.back();
      })
      .catch((error) => {
        console.error("Error updating category:", error);
        toast.error("Failed to update category");
      })
      .finally(() => setLoading(false));
  };

  // Delete handler: only available in edit mode
  const handleDelete = () => {
    if (!id) return;
    if (!confirm("Are you sure you want to delete this category?")) return;
    setDeleteLoading(true);
    axios
      .delete(`/categories/${id}`)
      .then((response) => {
        toast.success("Category deleted successfully");
        router.back();
      })
      .catch((error) => {
        console.error("Error deleting category:", error);
        toast.error("Failed to delete category");
      })
      .finally(() => setDeleteLoading(false));
  };

  return (
    <>
      <Head>
        <title>
          {id ? "Edit Category - Nasmaakum" : "Create Category - Nasmaakum"}
        </title>
      </Head>

      <main className="flex flex-1 flex-col gap-8">
        <PageHeader
          title={id ? "Edit Service Category" : "Create Service Category"}
        />

        <form
          className="flex flex-1 flex-col gap-4"
          onSubmit={onSubmit((data) => handleSubmit(data))}
        >
          <div className="flex gap-4">
            {/* The UploadImage component is bound to the "imageUrl" form field */}
            <UploadImage disabled={loading} {...getInputProps("imageUrl")} />

            <div className="flex flex-1 flex-col gap-4">
              <TextInput label="Name" required {...getInputProps("name")} />
            </div>
          </div>

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
            <Button loading={loading} type="submit">
              {id ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
