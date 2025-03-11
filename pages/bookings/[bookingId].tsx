// pages/booking/[bookingId].js

import { useEffect, useState } from "react";
import axios from "@/apis/axios";
import Loading from "@/components/layout/Loading";
import dayjs from "dayjs";
import { useRouter } from "next/router";

const BookingDetails = () => {
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { bookingId } = router.query;

  useEffect(() => {
    if (bookingId) {
      const fetchBookingDetails = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/services/appointment/${bookingId}`
          );

          console.log(response.data);
          setBookingDetails(response.data);
        } catch (error) {
          console.error("Failed to fetch booking details:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchBookingDetails();
    }
  }, [bookingId]);

  if (!bookingDetails)
    return (
      <div className="mt-10 text-center text-xl text-red-600">
        Booking not found
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl p-5">
      <h1 className="mb-8 text-center text-3xl font-semibold">
        Booking Details
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Booking Information */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 border-b-2 pb-2 text-2xl font-semibold text-gray-800">
            Booking Information
          </h2>
          <p>
            <strong>Booking ID:</strong> {bookingDetails.bookingId}
          </p>
          <p>
            <strong>Status:</strong> {bookingDetails.status}
          </p>
          <p>
            <strong>Booked Date:</strong>{" "}
            {dayjs(bookingDetails.bookedTime).format("DD-MMM-YYYY")}
          </p>
          <p>
            <strong>Booked Time:</strong>{" "}
            {dayjs(bookingDetails.bookedTime).format("HH:mm")}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {dayjs(bookingDetails.createdAt).format("DD-MMM-YYYY")}
          </p>
        </div>

        {/* Customer Details */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 border-b-2 pb-2 text-2xl font-semibold text-gray-800">
            Customer Details
          </h2>
          <p>
            <strong>Name:</strong> {bookingDetails.customerId.name}
          </p>
          <p>
            <strong>Email:</strong> {bookingDetails.customerId.email}
          </p>
          <p>
            <strong>Phone:</strong> {bookingDetails.customerId.phone}
          </p>
          {/* Add more customer details as needed */}
        </div>

        {/* Partner Details */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 border-b-2 pb-2 text-2xl font-semibold text-gray-800">
            Partner Details
          </h2>
          <p>
            <strong>Name:</strong> {bookingDetails.partnerId.name}
          </p>
          <p>
            <strong>Email:</strong> {bookingDetails.partnerId.email}
          </p>
          <p>
            <strong>Phone:</strong> {bookingDetails.partnerId.phone}
          </p>
          {/* Add more partner details as needed */}
        </div>

        {/* Service Details */}
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 border-b-2 pb-2 text-2xl font-semibold text-gray-800">
            Service Details
          </h2>
          <p>
            <strong>Service:</strong> {bookingDetails.serviceId.name}
          </p>
          <p>
            <strong>Description:</strong> {bookingDetails.serviceId.description}
          </p>
          <p>
            <strong>Price:</strong> ${bookingDetails.serviceId.price}
          </p>
          {/* Add more service details as needed */}
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;
