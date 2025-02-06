// UploadImage.tsx
import { useRef, useState, useEffect } from "react";
import axios from "@/apis/axios";
import { docsUpload } from "@/apis/query";

type UploadImageProps = {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

export default function UploadImage({
  value,
  onChange,
  disabled = false,
}: UploadImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(value || null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  // Trigger file selection when the upload area is clicked
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Handle file selection and upload using docsUpload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // reset input so the same file can be reselected if needed

    // Extract file details
    const fileName = file.name;
    const fileExtension = fileName.split(".").pop() || "";
    const name = "exampleName"; // Adjust as needed or pass as a prop

    try {
      setUploading(true);
      const url = await docsUpload(name, fileName, fileExtension, file);
      setUploadUrl(url);
      if (onChange) onChange(url);
    } catch (err: any) {
      setError(err.message || "Error uploading file");
    } finally {
      setUploading(false);
    }
  };

  // Update the internal state if parent's value changes
  useEffect(() => {
    if (value !== uploadUrl) {
      setUploadUrl(value || null);
    }
  }, [value]);

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Clickable upload area */}
      <div
        onClick={handleClick}
        className={`w-96 h-64 border-4 border-dashed border-gray-500 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition relative ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {uploadUrl ? (
          // Display the uploaded image
          <img
            src={uploadUrl}
            alt="Uploaded File"
            className="object-contain w-full h-full"
          />
        ) : (
          <p className="text-gray-700 text-lg">
            {uploading ? "Uploading..." : "Click here to upload a picture"}
          </p>
        )}
        {/* Optional overlay for hover feedback */}
        <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition" />
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
        disabled={disabled}
      />

      {/* Error message */}
      {error && (
        <div>
          <p className="text-red-600">Error: {error}</p>
        </div>
      )}
    </div>
  );
}
