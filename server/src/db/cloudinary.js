import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary.v2;

export const uploadImage = async (filesPath) => {
  return await cloudinary.uploader.upload(filesPath, {
    folder: "imagenProyect",
    resource_type: "image",
  });
};

export const uploadAudio = async (filesPath) => {
  return await cloudinary.uploader.upload(filesPath, {
    folder: "audioProyect",
    resource_type: "raw",
  });
};
