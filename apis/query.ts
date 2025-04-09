import axios from "./axios";
import { Buffer } from "buffer";

export const auth = async (
  email: string,
  password: string,
  type: "login" | "signup"
) => {
  const response = await axios.post("/auth/" + type, {
    email,
    password,
    deviceToken: "no-token",
  });
  return response.data;
};

export const logout = async () => {
  const response = await axios.get("/auth/logout");
  return response.data;
};

export const docsUpload = async (
  name: string,
  fileName: string,
  fileExtension: string,
  file: File
) => {
  try {
    // Step 1: Get the presigned URL from the backend
    const presignedResponse = await axios.post("/partners/uploadDocs", {
      name,
      fileName,
      fileExtension,
    });

    if (!presignedResponse.data?.signedUrl?.url) {
      throw new Error("Failed to get presigned URL");
    }

    // Extract the presigned URL from the response
    const presignedUrl = presignedResponse.data.signedUrl.url;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size exceeds 5MB limit");
    }

    // Step 2: Upload the document to the presigned URL with proper headers
    const uploadResponse = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type || "image/jpeg",
        "Content-Length": file.size,
      },
      timeout: 30000, // 30 second timeout
      withCredentials: false, // Important: Don't send credentials to S3
    });

    if (!uploadResponse?.config?.url) {
      throw new Error("Failed to upload file to S3");
    }

    const parsedUrl = new URL(uploadResponse.config.url);
    const pathWithoutQuery = parsedUrl.origin + parsedUrl.pathname;

    return pathWithoutQuery;
  } catch (error: any) {
    console.error("Error uploading document:", error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error("Error response:", error.response.data);
      throw new Error(
        `Upload failed: ${error.response.data.message || "Server error"}`
      );
    } else if (error.request) {
      // The request was made but no response was received
      console.error("No response received:", error.request);
      throw new Error("Network error: No response from server");
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error("Error setting up request:", error.message);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }
};
