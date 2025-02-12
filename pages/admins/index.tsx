import { useEffect, useState } from "react";

import ActionIcon from "@/components/ActionIcon";
import Empty from "@/components/layout/Empty";
import Head from "next/head";
import Loading from "@/components/layout/Loading";
import PageHeader from "@/components/layout/PageHeader";
import Pagination from "@/components/Pagination";
import Table from "@/components/layout/Table";
import usePagination from "@/hooks/usePagination";
import dayjs from "dayjs";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useRouter } from "next/router";

export default function Page() {
  const [data, setData] = useState<{ customers: any[] }>({
    customers: [],
  });
  const [loading, setLoading] = useState(true);
  const { page, limit, setPage, setLimit } = usePagination(10);

  const axios = useAxiosPrivate();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/admin");
      console.log(response.data);

      setData({
        customers: response.data,
      });
    } catch (error: any) {
      console.error("Failed to fetch customers:", error?.data?.message);
      setData({ customers: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  console.log("Data", data);

  const items = data.customers.map((customer: any) => (
    <Table.Tr key={customer.id}>
      <Table.Td>{customer.name}</Table.Td>
      <Table.Td>{customer.email}</Table.Td>

      <Table.Td>{customer.adminRole?.name || "N/A"}</Table.Td>
      <Table.Td>
        {dayjs(customer.createdAt).format("DD-MMM-YYYY hh:mm A")}
      </Table.Td>
      <Table.Td>
        <ActionIcon href={`/admins/edit/?id=${customer._id}`}>
          <i className="fa-solid fa-pen" />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  const router = useRouter();

  return (
    <>
      <Head>
        <title>Admins</title>
      </Head>

      <main className="flex flex-1 flex-col gap-8">
        <PageHeader
          disabled={loading}
          refetch={fetchCustomers}
          title="Admins"
          create="/admins/create"
        />
        <button
          onClick={() => {
            router.push("/admins/access");
          }}
        >
          Manage Role Access
        </button>

        <Loading loading={loading}>
          <Table className="w-full">
            <Table.Head>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Email</Table.Th>
                <Table.Th>Role</Table.Th>

                <Table.Th>Created At</Table.Th>
                <Table.Th>Edit</Table.Th>
              </Table.Tr>
            </Table.Head>

            <Table.Body>{items}</Table.Body>
          </Table>
        </Loading>
      </main>
    </>
  );
}
