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
import type { PublicationWithId } from "../../model/types";

// eslint-disable-next-line @typescript-eslint/naming-convention -- всё ок
interface Props {
  publication: PublicationWithId;
  onChannelToggle: (channelId: string, platform: Platform) => void;
}

export const ChannelSelector = ({ publication, onChannelToggle }: Props) => {
  const userState = useUnit($userState);
  const userChannels = userState.data?.channels || [];

  const groupedChannels = userChannels.reduce<Record<Platform, Channel[]>>(
    (acc, channel) => {
      const platform = channel.type.toLowerCase() as Platform;
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- всё ок
      if (!acc[platform]) {
        acc[platform] = [];
      }
      acc[platform].push({
        ...channel,
        platform,
      });
      return acc;
    },
    // eslint-disable-next-line -- всё ок
    {} as Record<Platform, Channel[]>,
  );

  const isChannelSupported = (channel: Channel) => {
    const capabilities = PLATFORM_CAPABILITIES[channel.platform];
    return capabilities.has(publication.type as ContentType);
  };

  const isChannelSelected = (channel: Channel) =>
    publication.channels.includes(channel.id);

  return (
    <Stack gap="md">
      {Object.entries(groupedChannels).map(([platform, channels]) => (
        <Card key={platform} withBorder>
          <Stack gap="md">
            <Text fw={500} size="lg">
              {platform}
            </Text>
            <ScrollArea.Autosize mah={300} type="hover">
              <Stack gap="xs">
                {channels.map((channel) => {
                  const supported = isChannelSupported(channel);
                  const selected = isChannelSelected(channel);

                  return (
                    <UnstyledButton
                      key={channel.id}
                      onClick={() => {
                        if (supported) {
                          onChannelToggle(channel.id, channel.platform);
                        }
                      }}
                      style={(theme) => ({
                        opacity: supported ? 1 : 0.5,
                        cursor: supported ? "pointer" : "not-allowed",
                        borderRadius: theme.radius.sm,
                        padding: theme.spacing.xs,
                        backgroundColor: selected
                          ? theme.colors.blue[0]
                          : "transparent",
                        "&:hover": {
                          // eslint-disable-next-line no-nested-ternary -- тут ок
                          backgroundColor: supported
                            ? selected
                              ? theme.colors.blue[1]
                              : theme.colors.gray[0]
                            : "transparent",
                        },
                      })}
                    >
                      <Group gap="sm">
                        <ChannelAvatar channel={channel} selected={selected} />
                        <Stack gap={2}>
                          <Text size="sm">{channel.name}</Text>
                          {!supported && (
                            <Text c="dimmed" size="xs">
                              Этот тип контента не поддерживается
                            </Text>
                          )}
                        </Stack>
                      </Group>
                    </UnstyledButton>
                  );
                })}
              </Stack>
            </ScrollArea.Autosize>
          </Stack>
        </Card>
      ))}
    </Stack>
  );
};
