// Page.tsx

import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Button from "@/components/form/Button";
import Head from "next/head";
import UploadImage from "@/components/form/ImageInput";
import PageHeader from "@/components/layout/PageHeader";
import TextInput from "@/components/form/TextInput";
import useForm from "@/hooks/useForm";
import axios from "@/apis/axios";
import { docsUpload } from "@/apis/query";

export default function Page() {
  const router = useRouter();

  const { onSubmit, getInputProps, allowNavigation } = useForm({
    initialValues: {
      name: "",
    },
  });

  const handleSubmit = async (data: any) => {
    try {
      // First upload the image if it exists
      let imageUrl = "";
      if (data.image) {
        const fileName = data.image.name;
        const fileExtension = fileName.split(".").pop() || "";
        imageUrl = await docsUpload(
          "category",
          fileName,
          fileExtension,
          data.image
        );
      }

      console.log(imageUrl);

      // Then create the category with the image URL
      const response = await axios.post("/categories", {
        name: data.name,
        imageUrl: imageUrl,
        isActive: true,
      });

      toast.success("Category created successfully");
      router.back();
    } catch (error: any) {
      console.error("Failed to create category:", error);
      toast.error(error.response?.data?.message || "Failed to create category");
    }
  };

  return (
    <>
      <Head>
        <title>Create Category - Nasmaakum</title>
      </Head>

      <main className="flex flex-1 flex-col gap-8">
        <PageHeader title="Create Service Category" />

        <form
          className="flex flex-1 flex-col gap-4"
          onSubmit={onSubmit((data) => handleSubmit(data))}
        >
          <div className="flex gap-4">
            <UploadImage {...getInputProps("image")} />
            <div className="flex flex-1 flex-col gap-4">
              <TextInput label="Name" required {...getInputProps("name")} />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <Button type="submit">Create</Button>
          </div>
        </form>
      </main>
    </>
  );
}
