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
import partnerExportexcel from "@/components/excel/partners";

export default function Page() {
  const [data, setData] = useState<any>({ customers: [], count: 0 });
  const [loading, setLoading] = useState<any>(true);
  const { page, limit, setPage, setLimit } = usePagination(10);

  const router = useRouter();

  const axios = useAxiosPrivate();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/admin/partners", {
        params: {
          page,
          limit,
        },
      });

      console.log(response.data);
      setData({
        customers: response.data.partners || [],
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

  console.log(data);

  const items = data.customers.map((customer: any) => (
    <Table.Tr
      key={customer._id}
      onClick={() => router.push(`/partners/${customer._id}`)}
      className="cursor-pointer hover:bg-gray-100"
    >
      <Table.Td>{customer.name}</Table.Td>
      <Table.Td>{customer.email}</Table.Td>
      <Table.Td>{customer.mobileNumber}</Table.Td>
      <Table.Td>{customer.status}</Table.Td>

      <Table.Td>{dayjs(customer.createdAt).format("DD-MMM-YYYY")}</Table.Td>
      <Table.Td>{dayjs(customer.createdAt).format("hh:mm A")}</Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Head>
        <title>Partners</title>
      </Head>

      <main className="flex flex-1 flex-col gap-8">
        <PageHeader
          disabled={loading || !data.count}
          refetch={fetchCustomers}
          title={`Partners (${data.count})`}
          exportexcel={async () => {
            const response = await axios.get("/admin/partners", {
              params: {
                page: 1,
                limit: 1000,
              },
            });
            partnerExportexcel(response.data.partners);
          }}
        />

        <Loading loading={loading}>
          {data.count ? (
            <Table className="w-full">
              <Table.Head>
                <Table.Tr>
                  <Table.Th>Partner Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Mobile Number</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Created At(Date)</Table.Th>
                  <Table.Th>Time</Table.Th>
                </Table.Tr>
              </Table.Head>

              <Table.Body>{items}</Table.Body>
            </Table>
          ) : (
            <Empty name="Parnters" />
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
