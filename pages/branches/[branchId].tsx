import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";

import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthContext";

export default function ServiceDetails() {
  const router = useRouter();
  const { branchId: id } = router.query;
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const axios = useAxiosPrivate();

  const { permissions } = useAuth();
  console.log("Permissions", permissions);

  // Function to check if the user has permission
  const hasPermission = (permissionName: string) => {
    return permissions?.some(
      (perm: any) => perm.name === permissionName && perm.isAllowed
    );
  };

  useEffect(() => {
    if (id) {
      axios
        .get(`/services/${id}`)
        .then((response) => {
          console.log(response.data);
          setService(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch service details:", error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleApprove = (status: string) => {
    if (!id) return;
    axios
      .post(`/admin/updateService/${id}`, { status: status })
      .then(() => {
        setService((prev: any) => ({ ...prev, status: status }));
        toast.success("Status Succesfully Updated");
      })
      .catch((error) => {
        console.error("Failed to approve service:", error);
      });
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!service)
    return <p className="text-center text-red-500">Service not found</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Service Details</h1>
        {hasPermission("edit:branches") && service.status === "Review" && (
          <div>
            <button
              onClick={() => handleApprove("Accepted")}
              className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              Approve
            </button>
            <button
              onClick={() => handleApprove("Rejected")}
              className="px-6 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-green-600 transition"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Image Centered */}
      <div className="flex justify-center mb-6">
        <div className="relative w-40 h-40">
          <div className="absolute top-0 left-0 w-40 h-40 border-2 border-gray-300 rounded-md overflow-hidden shadow-md">
            <Image
              src={service.imageUrl}
              alt={service.name}
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Service Info */}
      <div className="space-y-4">
        <p>
          <strong>Service Name:</strong> {service.name}
        </p>
        <p>
          <strong>Description:</strong> {service.description}
        </p>
        <p>
          <strong>Duration:</strong> {service.duration} mins
        </p>
        <p>
          <strong>Status:</strong> {service.status}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(service.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Partner Info */}
      {service.partnerId && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Partner Details</h2>
          <p>
            <strong>Name:</strong> {service.partnerId.name}
          </p>
          <p>
            <strong>Email:</strong> {service.partnerId.email}
          </p>
        </div>
      )}

      {/* Subservices */}
      {service.subServiceIds?.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-3">Subservices</h2>
          <ul className="list-disc pl-6">
            {service.subServiceIds.map((sub: any) => (
              <li key={sub._id}>
                <strong>{sub.subservice?.name || "Unknown Subservice"}</strong>{" "}
                - ${sub.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
