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
import { TelegramPostForm } from "@screens/Publication/ui/PlatformForms/Telegram/Post";
import { TelegramStoriesForm } from "@screens/Publication/ui/PlatformForms/Telegram/Stories";
import { VKPostForm } from "@screens/Publication/ui/PlatformForms/VK/Post";
import { VKShortForm } from "@screens/Publication/ui/PlatformForms/VK/Short";
import { VKStoriesForm } from "@screens/Publication/ui/PlatformForms/VK/Stories";
import { VKVideoForm } from "@screens/Publication/ui/PlatformForms/VK/Video";
import { YoutubePostForm } from "@screens/Publication/ui/PlatformForms/YouTube/Post";
import { YoutubeShortsForm } from "@screens/Publication/ui/PlatformForms/YouTube/Shorts";
import { YoutubeStoriesForm } from "@screens/Publication/ui/PlatformForms/YouTube/Stories";
import { YoutubeVideoForm } from "@screens/Publication/ui/PlatformForms/YouTube/Video";
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
  [Platform.VK]: {
    [ContentType.POST]: <VKPostForm />,
    [ContentType.SHORT]: <VKShortForm />,
    [ContentType.STORIES]: <VKStoriesForm />,
    [ContentType.VIDEO]: <VKVideoForm />,
  },
  [Platform.Telegram]: {
    [ContentType.POST]: <TelegramPostForm />,
    [ContentType.STORIES]: <TelegramStoriesForm />,
  },
  [Platform.YouTube]: {
    [ContentType.POST]: <YoutubePostForm />,
    [ContentType.SHORT]: <YoutubeShortsForm />,
    [ContentType.STORIES]: <YoutubeStoriesForm />,
    [ContentType.VIDEO]: <YoutubeVideoForm />,
  },
};

// Remove MOCK_CHANNELS since we're using real data now
export const PLATFORM_COLORS = {
  [Platform.YouTube]: "#FF0000", // YouTube Red
  [Platform.VK]: "#0077FF", // VK Blue
  [Platform.Telegram]: "#229ED9", // Telegram Blue
} as const;
