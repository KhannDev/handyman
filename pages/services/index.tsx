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
import { useAuth } from "@/contexts/AuthContext";

import servicesExportexcel from "@/components/excel/services";

export default function Page() {
  const [data, setData] = useState<any>({ customers: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const { page, limit, setPage, setLimit } = usePagination(10);

  const { permissions } = useAuth();

  // Function to check if the user has permission
  const hasPermission = (permissionName: string) => {
    return permissions?.some(
      (perm: any) => perm.name === permissionName && perm.isAllowed
    );
  };

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await axios.get("allservices", {
        params: {
          page,
          limit,
        },
      });

      console.log(response.data);
      setData({
        customers: response.data.data || [],
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
    fetchServices();
  }, [page, limit]);

  const items = data.customers.map((customer: any) => (
    <Table.Tr key={customer.id}>
      <Table.Td>{customer.name}</Table.Td>
      <Table.Td>{customer.category.name}</Table.Td>
      <Table.Td>{customer?.createdBy?.name}</Table.Td>
      <Table.Td>{customer.isVerified ? "Yes" : "No"}</Table.Td>

      <Table.Td>
        {dayjs(customer.createdAt).format("DD-MMM-YYYY hh:mm A")}
      </Table.Td>
      {hasPermission("edit:services") && (
        <Table.Td>
          <ActionIcon href={`/services/edit/?id=${customer._id}`}>
            <i className="fa-solid fa-pen" />
          </ActionIcon>
        </Table.Td>
      )}
    </Table.Tr>
  ));

  return (
    <>
      <Head>
        <title>Services </title>
      </Head>

      <main className="flex flex-1 flex-col gap-8">
        <PageHeader
          disabled={loading || !data.count}
          refetch={fetchServices}
          title={`Services (${data.count})`}
          create={
            hasPermission("edit:services") ? "/services/create" : undefined
          }
          exportexcel={async () => {
            const response = await axios.get("/allservices", {
              params: {
                page: 1,
                limit: 1000,
              },
            });
            servicesExportexcel(response.data);
          }}
        />

        <Loading loading={loading}>
          {data.count ? (
            <Table className="w-full">
              <Table.Head>
                <Table.Tr>
                  <Table.Th>Name</Table.Th>

                  <Table.Th>Category</Table.Th>
                  <Table.Th>Created By</Table.Th>
                  <Table.Th>Active</Table.Th>
                  <Table.Th>Created At</Table.Th>
                  {hasPermission("edit:services") && <Table.Th>Edit</Table.Th>}
                </Table.Tr>
              </Table.Head>

              <Table.Body>{items}</Table.Body>
            </Table>
          ) : (
            <Empty name="customer" />
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
