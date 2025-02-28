
import axios from "axios";

const Upload = async (imageFile, onProgress, resourceType) => {
  console.log("shesjhshjshjsjhjsjsj");
  console.log("shehsej", resourceType);
  const url = `https://api.cloudinary.com/v1_1/ds1qogjpk/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", imageFile);
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
  }
};

export default Upload;

