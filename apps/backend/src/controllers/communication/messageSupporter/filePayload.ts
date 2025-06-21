import { IFile } from "@repo/database/dist/models/communication/message.model";
import { uploadOnCloudinary } from "../../../services/cloudinary/cloudinary.config";
import ApiError from "../../../utils/apiError";
import { getMessageTypeFromMime } from "../../../utils/messageType";

export const getFilesPayload = async (files: IFile[]) => {
    return Promise.all(
      files?.map(async (file) => {
        //TODO: handle file size constaint bases on mimetype limit size for picture video documents and other format
        
        if(file.size > 52428800) {
          throw new ApiError(403, `${file.originalname} is too large, please upload file with size less than 50MB`)
        }

        const uploadResponse = await uploadOnCloudinary(file?.path as string);
        console.log("uploadresposne", uploadResponse)
        if (!uploadResponse) {
          throw new ApiError(500, "Failed to upload attachment.");
        }

        const payload = {
          messageType: getMessageTypeFromMime(file.mimetype as string),
          mediaUrl: uploadResponse.url,
          fileDetail: file,
        };

        return payload;
      })
    );
}