export interface ChannelDto {
  channelId: string;
  createdAt: string;
  description: null;
  id: string;
  isActive: true;
  name: string;
  type: Platform;
  updatedAt: string;
  avatarUrl: string;
}

export enum Platform {
  YouTube = "youtube",
  VK = "vk",
  Telegram = "telegram",
}

export enum ContentType {
  POST = "post",
  SHORT = "short",
  STORIES = "stories",
  VIDEO = "video",
}

export type ContentMap = Record<ContentType, JSX.Element>;

export interface Channel extends Omit<ChannelDto, "channelId"> {
  platform: Platform;
}
