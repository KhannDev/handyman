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
// import axios from "axios";
import axios from "@/apis/axios";

export default function Page() {
  const [data, setData] = useState<any>({ categories: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const { page, limit, setPage, setLimit } = usePagination(10);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/categories", {
        params: {
          page,
          limit,
        },
      });

      console.log(response.data);
      setData({
        categories: response.data.categories || [],
        count: response.data.total || 0,
      });
    } catch (error: any) {
      console.error("Failed to fetch customers:", error?.data?.message);
      setData({ customers: [], count: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [page, limit]);

  const items = data.categories.map((customer: any) => (
    <Table.Tr key={customer.id}>
      <Table.Td>{customer.name}</Table.Td>

      <Table.Td>{dayjs(customer.createdAt).format("DD-MMM-YYYY")}</Table.Td>
      <Table.Td>
        <ActionIcon href={`/categories/edit/?id=${customer._id}`}>
          <i className="fa-solid fa-pen" />
        </ActionIcon>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Head>
        <title>Customers - Nasmaakum</title>
      </Head>

      <main className="flex flex-1 flex-col gap-8">
        <PageHeader
          disabled={loading || !data.count}
          create="/categories/create"
          refetch={fetchCustomers}
          title={`Categories (${data.count})`}
        />

        <Loading loading={loading}>
          {data.count ? (
            <Table className="w-full">
              <Table.Head>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>

                  <Table.Th>Created At</Table.Th>
                  <Table.Th>Edit</Table.Th>
                </Table.Tr>
              </Table.Head>

              <Table.Body>{items}</Table.Body>
            </Table>
          ) : (
            <Empty name="Categories" />
          )}
        </Loading>

        <Pagination
          count={data.count}
          page={page}
          limit={limit}
          onPageChange={setPage}
          onLimitChange={setLimit}
        />
      </main>
    </>
  );
}
