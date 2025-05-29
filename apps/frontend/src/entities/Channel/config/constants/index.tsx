import {
  IconBrandTelegram,
  IconBrandVk,
  IconBrandYoutube,
  IconMessage,
  IconPhotoVideo,
  IconVideo,
} from "@tabler/icons-react";
// eslint-disable-next-line no-restricted-imports -- всё ок
import { ContentType, Platform } from "@entities/Channel/model/types";
import { YoutubePostForm } from "@screens/Publication/ui/PlatformForms/Post";
import { YoutubeShortsForm } from "@screens/Publication/ui/PlatformForms/Shorts";
import { YoutubeStoriesForm } from "@screens/Publication/ui/PlatformForms/Stories";
import { YoutubeVideoForm } from "@screens/Publication/ui/PlatformForms/Video";
// eslint-disable-next-line no-restricted-imports -- всё ок
import type { ContentMap } from "@entities/Channel/model/types";

export const CONTENT_TYPE_LABELS: Record<ContentType, string> = {
  [ContentType.POST]: "Сообщение",
  [ContentType.SHORT]: "Shorts",
  [ContentType.STORIES]: "Stories",
  [ContentType.VIDEO]: "Видео",
};

export const PLATFORM_ICONS = {
  [Platform.YouTube]: IconBrandYoutube,
  [Platform.VK]: IconBrandVk,
  [Platform.Telegram]: IconBrandTelegram,
};

export const CONTENT_TYPE_ICONS = {
  [ContentType.POST]: IconMessage,
  [ContentType.SHORT]: IconPhotoVideo,
  [ContentType.STORIES]: IconPhotoVideo,
  [ContentType.VIDEO]: IconVideo,
};

// Определяем доступные типы контента для каждой платформы
export const PLATFORM_CAPABILITIES = {
  [Platform.YouTube]: new Set([
    ContentType.VIDEO,
    ContentType.SHORT,
    ContentType.POST,
    ContentType.STORIES,
  ]),
  [Platform.VK]: new Set([
    ContentType.POST,
    ContentType.VIDEO,
    ContentType.STORIES,
  ]),
  [Platform.Telegram]: new Set([ContentType.POST]),
} as const;

// Определяем компоненты для каждой платформы и типа контента
export const PLATFORM_CONTENT: ContentMap = {
  [ContentType.POST]: <YoutubePostForm />,
  [ContentType.SHORT]: <YoutubeShortsForm />,
  [ContentType.STORIES]: <YoutubeStoriesForm />,
  [ContentType.VIDEO]: <YoutubeVideoForm />,
};

// Remove MOCK_CHANNELS since we're using real data now
export const PLATFORM_COLORS = {
  [Platform.YouTube]: "#FF0000", // YouTube Red
  [Platform.VK]: "#0077FF", // VK Blue
  [Platform.Telegram]: "#229ED9", // Telegram Blue
} as const;
