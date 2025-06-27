import axios from "axios";
import type { ConnectTelegramInputDto } from "./input.dto";

const connectTelegram = async (
  inputDto: ConnectTelegramInputDto,
): Promise<boolean> => {
  const { status } = await axios.post(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/channels/telegram`,
    { token: inputDto.token, url: inputDto.url },
    {
      withCredentials: true,
    },
  );

  return status === 200;
};

export default connectTelegram;
