import { IFile } from "@repo/database/dist/models/communication/message.model";
import { uploadOnCloudinary } from "../../../services/cloudinary/cloudinary.config";
import ApiError from "../../../utils/apiError";
import { getMessageTypeFromMime } from "../../../utils/messageType";

export const getFilesPayload = async (files: IFile[]) => {
    return Promise.all(
      files?.map(async (file) => {
        //TODO: handle file size constaint bases on mimetype limit size for picture video documents and other format
        const uploadResponse = await uploadOnCloudinary(file?.path as string);
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