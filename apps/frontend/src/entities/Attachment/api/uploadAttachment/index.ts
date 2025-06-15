import axios from "axios";
import type { UploadAttachmentInputDto } from "./input.dto";

const uploadAttachment = async (
  inputDto: UploadAttachmentInputDto,
): Promise<any> => {
  const formData = new FormData();
  formData.append("file", inputDto.file);

  const { status } = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/attachment/upload/${inputDto.publicationId}`,
    formData,
    {
      withCredentials: true,
    },
  );

  return status === 200;
};

export default uploadAttachment;
