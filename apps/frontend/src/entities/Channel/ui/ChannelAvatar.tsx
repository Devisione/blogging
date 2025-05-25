import { Avatar, Box } from "@mantine/core";
// eslint-disable-next-line no-restricted-imports -- всё ок
import {
  PLATFORM_COLORS,
  PLATFORM_ICONS,
} from "@entities/Channel/config/constants";
// eslint-disable-next-line no-restricted-imports -- всё ок
import type { Channel } from "@entities/Channel/model/types";

export const ChannelAvatar = ({
  channel,
  selected = false,
}: {
  channel: Channel;
  selected?: boolean;
}) => {
  const PlatformIcon = PLATFORM_ICONS[channel.platform];
  return (
    <Box p={4} pos="relative">
      <Avatar
        radius="xl"
        size="md"
        src={channel.avatarUrl}
        style={{
          border: selected ? "2px solid var(--mantine-color-blue-6)" : "none",
          opacity: selected ? 1 : 0.7,
        }}
        title={channel.name}
      />
      <Box
        pos="absolute"
        right={0}
        style={{
          background: PLATFORM_COLORS[channel.platform],
          borderRadius: "50%",
          width: "16px",
          height: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 4px rgba(0,0,0,0.1)",
        }}
        top={0}
      >
        <PlatformIcon size={12} style={{ flexShrink: 0, color: "white" }} />
      </Box>
    </Box>
  );
};
