const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    try{
        const options = {folder}
        options.resource_type = "auto";
        return await cloudinary.uploader.upload(file.tempFilePath, options);
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        throw error;
    }
};

