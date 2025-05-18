export interface GetUserInfoOutputDto {
  id: string;
  name: string;
  email: string;
  channels: {
    channelId: string;
    createdAt: string;
    description: null;
    id: string;
    isActive: true;
    name: string;
    type: string;
    updatedAt: string;
  }[];
}
