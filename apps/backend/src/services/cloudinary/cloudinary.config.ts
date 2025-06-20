import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// Utility function to safely delete local files
const deleteLocalFile = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(`❌ Error deleting local file: ${filePath}`, error);
    }
  }
};

// Upload file to Cloudinary
export const uploadOnCloudinary = async (
  localFilePath: string
): Promise<UploadApiResponse | null> => {
  if (!localFilePath) return null;

  try {
    const response: UploadApiResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    console.log('✅ Uploaded to Cloudinary:', response.secure_url);
    return response;
  } catch (error) {
    console.error('❌ Cloudinary upload error:', error);
    return null;
  } finally {
    deleteLocalFile(localFilePath);
  }
};
