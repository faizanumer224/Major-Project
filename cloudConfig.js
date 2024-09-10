const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// for linking the cloudinary with our backend and all the names such as (cloud_name, api_key, api_secret) are defaulted we always use these names
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// for making/defining a folder on cloudinary where we store our data
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Wanderlust_DEV",
    allowedFormat: ["png", "jpg", "jpeg"], // supports promises as well
  },
});

module.exports = {
  cloudinary,
  storage,
};
