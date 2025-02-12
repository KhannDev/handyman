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
import branchesExportExcel from "@/components/excel/branches";
import { useAuth } from "@/contexts/AuthContext";

export default function Page() {
  const [data, setData] = useState<any>({ categories: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const { page, limit, setPage, setLimit } = usePagination(10);

  const { permissions } = useAuth();
  console.log("Permissions", permissions);

  // Function to check if the user has permission
  const hasPermission = (permissionName: string) => {
    return permissions?.some(
      (perm: any) => perm.name === permissionName && perm.isAllowed
    );
  };

  const axios = useAxiosPrivate();

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/services", {
        params: {
          page,
          limit,
        },
      });

      console.log(response.data);
      setData({
        categories: response.data.services || [],
        count: response.data.total || 0,
      });
    } catch (error: any) {
      console.error("Failed to fetch customers:", error?.data?.message);
      setData({ customers: [], count: 0 });
    } finally {
      setLoading(false);
    }
  };

  const router = useRouter();

  useEffect(() => {
    fetchCustomers();
  }, [page, limit]);

  const items = data.categories.map((customer: any) => (
    <Table.Tr
      key={customer.id}
      onClick={() => router.push(`/branches/${customer._id}`)}
      className="cursor-pointer hover:bg-gray-100"
    >
      <Table.Td>{customer.name}</Table.Td>
      <Table.Td>{customer.status}</Table.Td>
      <Table.Td>{customer.partnerId.name}</Table.Td>
      <Table.Td>{customer.category.name}</Table.Td>
      <Table.Td>{dayjs(customer.createdAt).format("DD-MMM-YYYY")}</Table.Td>
      <Table.Td>{dayjs(customer.createdAt).format("hh:mm A")}</Table.Td>
      <Table.Td>{customer.approvedBy?.name}</Table.Td>
      <Table.Td>
        {customer.approvedDate
          ? dayjs(customer.approvedDate).format("DD-MMM-YYYY")
          : ""}
      </Table.Td>
      <Table.Td>
        {customer.approvedDate
          ? dayjs(customer.approvedDate).format("hh:mm A")
          : ""}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <Head>
        <title>branches</title>
      </Head>

      <main className="flex flex-1 flex-col gap-8">
        <PageHeader
          disabled={loading || !data.count}
          refetch={fetchCustomers}
          title={`Branches (${data.count})`}
          exportexcel={async () => {
            const response = await axios.get("/services", {
              params: {
                page: 1,
                limit: 1000,
              },
            });

            console.log("Im here", response.data);
            branchesExportExcel(response.data.services);
          }}
        />

        <Loading loading={loading}>
          {data.count ? (
            <Table className="w-full">
              <Table.Head>
                <Table.Tr>
                  <Table.Th>Branch Name</Table.Th>

                  <Table.Th>Status</Table.Th>
                  <Table.Th>Partner Name</Table.Th>
                  <Table.Th>Category</Table.Th>
                  <Table.Th>Created At(Date)</Table.Th>
                  <Table.Th>Time</Table.Th>
                  <Table.Th>Approved By</Table.Th>
                  <Table.Th>Approval Date</Table.Th>
                  <Table.Th>Time</Table.Th>
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
