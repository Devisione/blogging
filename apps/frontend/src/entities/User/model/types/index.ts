export interface Channel {
  channelId: string;
  createdAt: string;
  description: null;
  id: string;
  isActive: true;
  name: string;
  type: string;
  updatedAt: string;
  avatarUrl: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  channels: Channel[];
}
