// Page.tsx

import { toast } from "react-toastify";
import { useRouter } from "next/router";
import Button from "@/components/form/Button";
import Head from "next/head";
import UploadImage from "@/components/form/ImageInput"; // our new component
import PageHeader from "@/components/layout/PageHeader";
import TextInput from "@/components/form/TextInput";
import useForm from "@/hooks/useForm";
import axios from "@/apis/axios";

export default function Page() {
  const router = useRouter();

  const { onSubmit, getInputProps, allowNavigation } = useForm({
    initialValues: {
      imageUrl: "",
      name: "",
    },
  });

  const handleSubmit = (data) => {
    axios
      .post(`/categories`, { ...data })
      .then((response) => {
        console.log(response);
        router.back();
      })
      .catch((error) => {
        console.error("Failed to approve partner:", error);
      });
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
            {/* Use the new UploadImage component.
                getInputProps('image') passes the value and onChange needed for form binding */}
            <UploadImage {...getInputProps("imageUrl")} />

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
