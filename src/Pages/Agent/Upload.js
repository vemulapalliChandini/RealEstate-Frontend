
import axios from "axios";

const Upload = async (file, onProgress, resourceType) => {
  console.log("Uploading file of type:", resourceType);

  const url = `https://api.cloudinary.com/v1_1/ds1qogjpk/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  try {
    const response = await axios.post(url, formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      },
    });
    return response.data.secure_url;
  } catch (error) {
    console.log("Upload error:", error);
    return null;
  }
};


export default Upload;

