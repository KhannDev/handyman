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
import axios from "@/apis/axios";
import { useRouter } from "next/router";

export default function Page() {
  const [data, setData] = useState<any>({ customers: [], count: 0 });
  const [loading, setLoading] = useState<any>(true);
  const [customerList, setCustomerList] = useState<any>([]);
  const [partnerList, setPartnerList] = useState<any>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>("");
  const [selectedPartner, setSelectedPartner] = useState<any>("");
  const [status, setStatus] = useState<any>("");
  const [startDate, setStartDate] = useState<any>("");
  const [endDate, setEndDate] = useState<any>("");
  const { page, limit, setPage, setLimit } = usePagination(10);
  const router = useRouter();

  const fetchLists = async () => {
    try {
      const customerResponse = await axios.get("/admin/customers/");
      const partnerResponse = await axios.get("/admin/partners/");

      setCustomerList(customerResponse.data.users || []);
      setPartnerList(partnerResponse.data.partners || []);
    } catch (error: any) {
      console.error("Failed to fetch dropdown lists:", error?.message);
    }
  };

  const fetchCustomers = async () => {
    setLoading(true);

    try {
      const response = await axios.get("/admin/bookings", {
        params: {
          page,
          limit,
          customerId: selectedCustomer || undefined,
          partnerId: selectedPartner || undefined,
          status: status || undefined,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        },
      });

      setData({
        customers: response.data.bookings || [],
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
    fetchLists();
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [page, limit]);

  const handleSearch = () => {
    fetchCustomers();
  };

  const handleRowClick = (bookingId: any) => {
    router.push(`/bookings/${bookingId}`);
  };

  const handleStartDateChange = (e: any) => {
    setStartDate(e.target.value); // Ensures the date is updated
  };

  const handleEndDateChange = (e: any) => {
    setEndDate(e.target.value); // Ensures the date is updated
  };

  const items = data.customers.map((customer: any) => (
    <Table.Tr key={customer._id} onClick={() => handleRowClick(customer._id)}>
      <Table.Td>{customer.bookingId}</Table.Td>
      <Table.Td>{dayjs(customer.bookedTime).format("DD-MMM-YYYY")}</Table.Td>
      <Table.Td>{dayjs(customer.bookedTime).format("HH:mm")}</Table.Td>
      <Table.Td>{customer.customerId.name}</Table.Td>
      <Table.Td>{customer.partnerId.name}</Table.Td>
      <Table.Td>{customer.status}</Table.Td>
      <Table.Td>{dayjs(customer.createdAt).format("DD-MMM-YYYY")}</Table.Td>
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
          refetch={fetchCustomers}
          title={`Bookings (${data.count})`}
        />

        <div className="flex flex-wrap gap-4">
          {/* Customer Dropdown */}
          <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="rounded border p-2"
          >
            <option value="">Select Customer</option>
            {customerList.map((customer: any) => (
              <option key={customer._id} value={customer._id}>
                {customer.name}
              </option>
            ))}
          </select>

          {/* Partner Dropdown */}
          <select
            value={selectedPartner}
            onChange={(e) => setSelectedPartner(e.target.value)}
            className="rounded border p-2"
          >
            <option value="">Select Partner</option>
            {partnerList.map((partner: any) => (
              <option key={partner._id} value={partner._id}>
                {partner.name}
              </option>
            ))}
          </select>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded border p-2"
          >
            <option value="">Select Status</option>
            {AllStatus.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          {/* Start Date */}
          <div className="flex gap-4">
            <div>
              <label htmlFor="start-date" className="mb-2 block">
                Start Date
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                className="rounded border p-2"
              />
            </div>
            <div>
              <label htmlFor="end-date" className="mb-2 block">
                End Date
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                className="rounded border p-2"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSearch}
            className="h-8 rounded bg-blue-500 px-2 py-0 text-white"
            disabled={loading}
          >
            Search
          </button>
        </div>

        <Loading loading={loading}>
          {data.count ? (
            <Table className="w-full">
              <Table.Head>
                <Table.Tr>
                  <Table.Th>Booking ID</Table.Th>
                  <Table.Th>Date</Table.Th>
                  <Table.Th>Time</Table.Th>
                  <Table.Th>Customer Name</Table.Th>
                  <Table.Th>Partner Name</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Created At</Table.Th>
                </Table.Tr>
              </Table.Head>

              <Table.Body>{items}</Table.Body>
            </Table>
          ) : (
            <Empty name="Bookings" />
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

const AllStatus = ["Completed", "Cancelled", "Accepted", "Pending", "Rejected"];
