import { useCallback, useState } from "react";
import {
  Anchor,
  Avatar,
  Button,
  Card,
  Container,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconBrandTelegram,
  IconBrandVk,
  IconBrandYoutube,
  IconExternalLink,
  IconTrash,
} from "@tabler/icons-react";
import { useUnit } from "effector-react";
import { ChannelApi } from "@entities/Channel/api";
import { Platform } from "@entities/Channel/model/types";
import { $userState } from "@entities/User/model/store";
import type { Channel } from "@entities/Channel/model/types";

interface TelegramModalProps {
  opened: boolean;
  onClose: () => void;
}

const PLATFORM_ICONS = {
  youtube: IconBrandYoutube,
  vk: IconBrandVk,
  telegram: IconBrandTelegram,
};

const TelegramModal = ({ opened, onClose }: TelegramModalProps) => {
  const [apiToken, setApiToken] = useState("");
  const [channelUrl, setChannelUrl] = useState("");

  const handleSubmit = () => {
    // TODO: Implement Telegram channel connection logic
    console.log("Connecting Telegram channel:", { apiToken, channelUrl });
    onClose();
  };

  return (
    <Modal onClose={onClose} opened={opened} title="Подключить Telegram канал">
      <Stack>
        <Text fw={300}>
          Для подключения Telegram, вам необходимо: создать бота через
          @BotFather, после создания вам будет выдан токен бота - ключ доступа.
          Добавьте своего бота в канал или группу.
        </Text>
        <TextInput
          label="API Token"
          onChange={(e) => {
            setApiToken(e.target.value);
          }}
          placeholder="Введите API token"
          value={apiToken}
        />
        <TextInput
          label="URL канала"
          onChange={(e) => {
            setChannelUrl(e.target.value);
          }}
          placeholder="Введите название канала"
          value={channelUrl}
        />
        <Button onClick={handleSubmit}>Подключить</Button>
      </Stack>
    </Modal>
  );
};

const ChannelCard = ({ channel }: { channel: Channel }) => {
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ок
  const PlatformIcon = PLATFORM_ICONS[channel.type] || null;

  const userState = useUnit($userState);

  const remove = useCallback(async () => {
    await ChannelApi.removeChannel({ id: channel.id });
    userState.start();
  }, [channel.id, userState]);

  return (
    <Card p="md" radius="md" shadow="sm" withBorder>
      <Group>
        <Avatar radius="xl" size="lg" src={channel.avatarUrl}>
          {/* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- ок */}
          {PlatformIcon ? <PlatformIcon size={24} /> : null}
        </Avatar>
        <div style={{ flex: 1 }}>
          <Text fw={500} size="lg">
            {channel.name}
          </Text>
          <Text c="dimmed" size="sm">
            {channel.type}
          </Text>
        </div>
        <div>
          <Button
            color="red"
            onClick={() => {
              void remove();
            }}
            variant="outline"
          >
            <IconTrash size={24} />
          </Button>
        </div>
      </Group>
    </Card>
  );
};

const ProfileScreen = () => {
  const { data: user } = useUnit($userState);
  const [telegramOpened, { open: openTelegram, close: closeTelegram }] =
    useDisclosure(false);

  if (!user) return null;

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  return (
    <Container py="xl" size="md">
      <Paper p="xl" radius="md" shadow="xs">
        <Stack>
          <Group>
            <Avatar alt={user.name} radius="xl" size="xl" />
            <div>
              <Title order={2}>{user.name}</Title>
              <Text c="dimmed">{user.email}</Text>
            </div>
          </Group>

          <div>
            <Title mb="md" order={3}>
              Подключенные каналы
            </Title>
            <Stack>
              <Group>
                <Anchor href={`${backendUrl}/channels/google`} target="_blank">
                  <Button
                    leftSection={<IconBrandYoutube size={20} />}
                    rightSection={<IconExternalLink size={16} />}
                    variant={
                      user.channels.some((ch) => ch.type === Platform.YouTube)
                        ? "light"
                        : "filled"
                    }
                  >
                    {user.channels.some((ch) => ch.type === Platform.YouTube)
                      ? "YouTube подключен"
                      : "Подключить YouTube"}
                  </Button>
                </Anchor>
                <Anchor href={`${backendUrl}/channels/vk`} target="_blank">
                  <Button
                    leftSection={<IconBrandVk size={20} />}
                    rightSection={<IconExternalLink size={16} />}
                    variant={
                      user.channels.some((ch) => ch.type === Platform.VK)
                        ? "light"
                        : "filled"
                    }
                  >
                    {user.channels.some((ch) => ch.type === Platform.VK)
                      ? "VK подключен"
                      : "Подключить VK"}
                  </Button>
                </Anchor>
                <Button
                  leftSection={<IconBrandTelegram size={20} />}
                  onClick={openTelegram}
                  variant={
                    user.channels.some((ch) => ch.type === Platform.Telegram)
                      ? "light"
                      : "filled"
                  }
                >
                  {user.channels.some((ch) => ch.type === Platform.Telegram)
                    ? "Telegram подключен"
                    : "Подключить Telegram"}
                </Button>
              </Group>

              {user.channels.length > 0 && (
                <Stack>
                  <Text fw={500}>Активные каналы:</Text>
                  {user.channels.map((channel) => (
                    <ChannelCard channel={channel} key={channel.id} />
                  ))}
                </Stack>
              )}
            </Stack>
          </div>
        </Stack>
      </Paper>

      <TelegramModal onClose={closeTelegram} opened={telegramOpened} />
    </Container>
  );
};

export default ProfileScreen;
