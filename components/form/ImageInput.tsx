// UploadImage.tsx
import { useRef, useState, useEffect } from "react";

type UploadImageProps = {
  value?: File | string | null;
  onChange?: (value: File | null) => void;
  disabled?: boolean;
};

export default function UploadImage({
  value,
  onChange,
  disabled = false,
}: UploadImageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Trigger file selection when the upload area is clicked
  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ""; // reset input so the same file can be reselected if needed

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // Pass the file to the parent
    if (onChange) onChange(file);
  };

  // Update the preview if value changes
  useEffect(() => {
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof value === "string") {
      setPreviewUrl(value);
    } else {
      setPreviewUrl(null);
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
        {previewUrl ? (
          // Display the preview image
          <img
            src={previewUrl}
            alt="Preview"
            className="object-contain w-full h-full"
          />
        ) : (
          <p className="text-gray-700 text-lg">
            Click here to upload a picture
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
