import { useRouter } from "next/router";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "@/apis/axios";

export default function PartnerDetails() {
  const router = useRouter();
  const { partnerId: id } = router.query;
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      axios
        .get(`/partners/${id}`)
        .then((response) => {
          setPartner(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Failed to fetch partner details:", error);
          setLoading(false);
        });
    }
  }, [id]);

  const handleApprove = () => {
    if (!id) return;
    axios
      .put(`/partners/${id}`, { isVerified: true })
      .then(() => {
        setPartner((prev) => ({ ...prev, isVerified: true }));
      })
      .catch((error) => {
        console.error("Failed to approve partner:", error);
      });
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (!partner)
    return <p className="text-center text-red-500">Partner not found</p>;

  return (
    <div className="container mx-auto p-6 bg-white shadow-lg rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">Partner Details</h1>
        {!partner.isVerified && (
          <button
            onClick={handleApprove}
            className="px-6 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
          >
            Approve
          </button>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-40 h-40 relative border-2 border-gray-300 rounded-full overflow-hidden shadow-md">
          <Image
            src={partner.profilePicture}
            alt={partner.name}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="space-y-2">
          <p>
            <strong>Name:</strong> {partner.name}
          </p>
          <p>
            <strong>Email:</strong> {partner.email}
          </p>
          <p>
            <strong>Mobile:</strong> {partner.mobileNumber}
          </p>
          <p>
            <strong>City:</strong> {partner.city}
          </p>
          <p>
            <strong>Experience:</strong> {partner.experience}
          </p>
          <p>
            <strong>Age Range:</strong> {partner.ageRange}
          </p>
          <p>
            <strong>Gender:</strong> {partner.gender}
          </p>
          <p>
            <strong>Current Address:</strong> {partner.currentAddress}
          </p>
          <p>
            <strong>Previous Workplace:</strong> {partner.previousWorkplace}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(partner.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Document Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partner.passportFront && (
            <a
              href={partner.passportFront}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-center"
            >
              Download Passport Front
            </a>
          )}
          {partner.passportBack && (
            <a
              href={partner.passportBack}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-center"
            >
              Download Passport Back
            </a>
          )}
          {partner.cpr && (
            <a
              href={partner.cpr}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-center"
            >
              Download CPR
            </a>
          )}
          {partner.iban && (
            <a
              href={partner.iban}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-center"
            >
              Download IBAN
            </a>
          )}
          {partner.flexiVisa && (
            <a
              href={partner.flexiVisa}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition text-center"
            >
              Download Flexi Visa
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
