import { v2 as cloudinary } from "cloudinary";

// Cloudinary SDK automatically picks up CLOUDINARY_URL from process.env
cloudinary.config({
  cloudinary_url: process.env.CLOUDINARY_URL,
  secure: true,
});

export default cloudinary;
