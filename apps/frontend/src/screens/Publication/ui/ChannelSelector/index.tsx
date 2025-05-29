import { Flex, Group, ScrollArea, Text, UnstyledButton } from "@mantine/core";
import { useUnit } from "effector-react";
import {
  PLATFORM_CAPABILITIES,
  PLATFORM_COLORS,
} from "@entities/Channel/config/constants";
import { ChannelAvatar } from "@entities/Channel/ui/ChannelAvatar";
import { $userState } from "@entities/User/model/store";
import type {
  Channel,
  ContentType,
  Platform,
} from "@entities/Channel/model/types";
import type { Publication } from "../../model/types";

// eslint-disable-next-line @typescript-eslint/naming-convention -- всё ок
interface Props {
  publication: Publication;
  onChannelToggle: (channelId: string, platform: Platform) => void;
}

export const ChannelSelector = ({ publication, onChannelToggle }: Props) => {
  const userState = useUnit($userState);
  const userChannels = userState.data?.channels || [];

  const isChannelSupported = (channel: Channel) => {
    const capabilities = PLATFORM_CAPABILITIES[channel.type];
    return capabilities.has(publication.type as ContentType);
  };

  const isChannelSelected = (channel: Channel) =>
    publication.channels.includes(channel.id);

  return (
    <ScrollArea mb={12} offsetScrollbars scrollbarSize={6} type="hover">
      <Group align="flex-start" gap="sm" wrap="nowrap">
        {userChannels.filter(isChannelSupported).map((channel) => {
          const selected = isChannelSelected(channel);
          return (
            <UnstyledButton
              key={channel.id}
              onClick={() => {
                onChannelToggle(channel.id, channel.type);
              }}
              style={(theme) => ({
                cursor: "pointer",
                borderRadius: "50px",
                backgroundColor: selected
                  ? PLATFORM_COLORS[channel.type]
                  : "rgba(0,0,0,0.4)",
                color: "white",
                transition: "background 0.15s",
                "&:hover": {
                  backgroundColor: selected
                    ? theme.colors.blue[1]
                    : theme.colors.gray[0],
                },
              })}
            >
              <Flex align="center" direction="row" wrap="nowrap">
                <ChannelAvatar channel={channel} />
                <Text component="span" p={8} size="sm">
                  {channel.name}
                </Text>
              </Flex>
            </UnstyledButton>
          );
        })}
      </Group>
    </ScrollArea>
  );
};
