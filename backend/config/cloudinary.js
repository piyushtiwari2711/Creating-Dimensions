const cloudinary = require("cloudinary").v2;
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.cloudname,
  api_key: process.env.cloudapikey,
  api_secret: process.env.cloudAPIsecret,
  secure: true,    
});

module.exports = cloudinary;
