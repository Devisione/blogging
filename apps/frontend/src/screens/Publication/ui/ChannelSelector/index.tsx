import {
  Card,
  Group,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from "@mantine/core";
import { useUnit } from "effector-react";
import { PLATFORM_CAPABILITIES } from "@entities/Channel/config/constants";
import { ChannelAvatar } from "@entities/Channel/ui/ChannelAvatar";
import { $userState } from "@entities/User/model/store";
import type {
  Channel,
  ContentType,
  Platform,
} from "@entities/Channel/model/types";

interface PublicationTarget {
  channelId: string;
  platform: Platform;
}

interface Publication {
  id: string;
  contentType: ContentType;
  targets: PublicationTarget[];
}

export const Channels = ({
  contentType,
  selectedChannels,
  onChannelToggle,
}: {
  contentType: ContentType;
  selectedChannels: string[];
  onChannelToggle: (channelId: string, platform: Platform) => void;
}) => {
  const userState = useUnit($userState);
  const channels = userState.data?.channels || [];

  // Filter channels based on content type compatibility and map to our Channel type
  const availableChannels = channels
    .map((channel) => ({
      ...channel,
      platform: channel.type.toLowerCase() as Platform,
    }))
    .filter((channel) => {
      const platformCapabilities = PLATFORM_CAPABILITIES[channel.platform];
      return platformCapabilities.has(contentType) || false;
    });

  // Group channels by platform for better organization
  const channelsByPlatform = availableChannels.reduce<
    Record<Platform, Channel[]>
  >(
    (acc, channel) => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- тут всё ок
      if (!acc[channel.platform]) {
        acc[channel.platform] = [];
      }
      acc[channel.platform].push(channel);
      return acc;
    },
    // eslint-disable-next-line -- всё ок
    {} as Record<Platform, Channel[]>,
  );

  return (
    <ScrollArea>
      <Stack gap="md">
        {(Object.entries(channelsByPlatform) as [Platform, Channel[]][]).map(
          ([platform, platformChannels]) => (
            <div key={platform}>
              <Text fw={500} mb="xs" size="sm">
                {platform}
              </Text>
              <Group gap="sm" wrap="nowrap">
                {platformChannels.map((channel) => {
                  const platformCapabilities =
                    PLATFORM_CAPABILITIES[channel.platform];
                  const isAvailable =
                    platformCapabilities.has(contentType) || false;

                  return (
                    <UnstyledButton
                      key={channel.id}
                      onClick={() => {
                        if (isAvailable) {
                          onChannelToggle(channel.id, channel.platform);
                        }
                      }}
                      style={() => ({
                        opacity: isAvailable ? 1 : 0.5,
                        cursor: isAvailable ? "pointer" : "not-allowed",
                        transition: "transform 150ms ease",
                        "&:hover": {
                          transform: isAvailable ? "scale(1.05)" : "none",
                        },
                      })}
                      title={
                        !isAvailable
                          ? `${contentType} недоступен для ${platform}`
                          : undefined
                      }
                    >
                      <ChannelAvatar
                        channel={channel}
                        selected={selectedChannels.includes(channel.id)}
                      />
                    </UnstyledButton>
                  );
                })}
              </Group>
            </div>
          ),
        )}
      </Stack>
    </ScrollArea>
  );
};

export const ChannelSelector = ({
  publication,
  onChannelToggle,
}: {
  publication: Publication;
  onChannelToggle: (channelId: string, platform: Platform) => void;
}) => {
  return (
    <Card mb="md" withBorder>
      <Stack gap="xs">
        <Text fw={500} size="sm">
          Выберите каналы для публикации
        </Text>
        <Channels
          contentType={publication.contentType}
          onChannelToggle={onChannelToggle}
          selectedChannels={publication.targets.map((t) => t.channelId)}
        />
      </Stack>
    </Card>
  );
};
