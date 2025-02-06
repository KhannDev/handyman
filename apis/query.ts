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

export const docsUpload = async (name, fileName, fileExtension, file) => {
  try {
    // Step 1: Get the presigned URL from the backend
    const presignedResponse = await axios.post("/partners/uploadDocs", {
      name,
      fileName,
      fileExtension,
    });

    const presignedUrl = presignedResponse.data.signedUrl.url;

    console.log("Presigned URL:", presignedUrl);

    // Step 2: Upload the document to the presigned URL
    const uploadResponse = await axios.put(presignedUrl, file, {
      headers: {
        "Content-Type": file.type, // Use file.type from the File object
      },
    });

    // Extract the clean URL
    const parsedUrl = new URL(uploadResponse.config.url);
    const pathWithoutQuery = parsedUrl.origin + parsedUrl.pathname;

    console.log("File uploaded to:", pathWithoutQuery);

    return pathWithoutQuery;
  } catch (error) {
    console.error("Error uploading document:", error.message);
    throw error;
  }
};
