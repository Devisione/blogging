import axios from "axios";
import type { UploadAttachmentInputDto } from "./input.dto";

const uploadAttachment = async (
  inputDto: UploadAttachmentInputDto,
): Promise<{
  filename: string;
  id: string;
  mimetype: string;
  size: number;
  url: string;
}> => {
  const formData = new FormData();
  formData.append("file", inputDto.file);
  formData.append("multiple", inputDto.multiple.toString());

  const { data } = await axios.post<{
    filename: string;
    id: string;
    mimetype: string;
    size: number;
    url: string;
  }>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/attachment/upload/${inputDto.publicationId}`,
    formData,
    {
      withCredentials: true,
    },
  );

  return data;
};

export default uploadAttachment;
