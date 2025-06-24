import axios from "axios";
import type { DeleteAttachmentInputDto } from "./input.dto";

const deleteAttachment = async (
  inputDto: DeleteAttachmentInputDto,
): Promise<boolean> => {
  const { status } = await axios.delete<{
    filename: string;
    id: string;
    mimetype: string;
    size: number;
    url: string;
  }>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/attachment/by-url?url=${inputDto.fileUrl}`,
  );

  return status === 200;
};

export default deleteAttachment;
