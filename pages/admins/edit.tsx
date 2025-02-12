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

export default function EditServicePage() {
  const router = useRouter();
  const { id } = router.query;
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const { onSubmit, getInputProps, setValues } = useForm({
    initialValues: {
      name: "",
      email: "",
      adminRole: "",
    },
  });

  const axios = useAxiosPrivate();

  useEffect(() => {
    if (!id) return;

    const fetchAdmin = async () => {
      try {
        const response = await axios.get(`/admin/${id}`);
        const { name, email, adminRole } = response.data;
        setValues({
          name,
          email,
          adminRole: adminRole?._id || "",
        });
      } catch (error) {
        console.error("Failed to fetch service details:", error);
      }
    };

    const fetchRoles = async () => {
      try {
        const response = await axios.get("/adminRoles");
        setRoles(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchAdmin();
    fetchRoles();
  }, [id]);

  const updateService = async (data: any) => {
    setLoading(true);

    console.log("DAAATAA", data);
    try {
      await axios.patch(`/admin/${id}`, data);
      toast.success("Service updated successfully!");
      router.push("/admins");
    } catch (error) {
      console.error("Failed to update service:", error);
    } finally {
      setLoading(false);
    }
  };

  // Delete admin function
  const deleteAdmin = async () => {
    if (confirm("Are you sure you want to delete this admin?")) {
      setLoading(true);
      try {
        await axios.delete(`/admin/${id}`);
        toast.success("Admin deleted successfully!");
        router.push("/admins"); // Redirect after deletion
      } catch (error) {
        console.error("Failed to delete admin:", error);
        toast.error("Failed to delete admin.");
      } finally {
        setLoading(false);
      }
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
          <TextInput
            disabled={loading}
            label="email"
            required
            {...getInputProps("email")}
          />

          <Select
            disabled={loading}
            label="Role"
            options={roles.map(({ _id, name }) => ({
              label: name,
              value: _id,
            }))}
            required
            {...getInputProps("adminRole")}
          />

          <div className="mt-4 flex justify-end gap-4">
            <Button type="submit">Update</Button>
            <Button
              type="button"
              onClick={deleteAdmin}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </Button>
          </div>
        </form>
      </main>
    </>
  );
}
