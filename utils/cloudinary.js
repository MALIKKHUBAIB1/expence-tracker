import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
const uploadonCloudinary = async (localurlPath) => {
  try {
    if (!localurlPath) return null;
    // Configuration
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUDNARY_API_KEY,
      api_secret: process.env.API_SECRET_KEY_CLOUDNARY, // Click 'View Credentials' below to copy your API secret
    });

    // Upload an image
    const uploadResult = await cloudinary.uploader.upload(localurlPath, {
      resource_type: "auto",
    });
    //file has been uploaded successfully
    console.log(uploadResult);
    fs.unlinkSync(localurlPath);
    return uploadResult;
  } catch (error) {
    fs.unlinkSync(localurlPath);
    return null;
  }
};
export default uploadonCloudinary;
