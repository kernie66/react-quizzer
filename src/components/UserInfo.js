import { useTranslation } from "react-i18next";
import TimeAgo from "./TimeAgo.js";
import { useInterval } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { List, ThemeIcon, rem } from "@mantine/core";
import { IconAt, IconClockHour2, IconGhost, IconPacman } from "@tabler/icons-react";

export default function UserInfo({ user }) {
  const { t } = useTranslation();
  const [update, setUpdate] = useState(0);
  const interval = useInterval(() => setUpdate((u) => u + 1), 5 * 1000);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [update]);

  return (
    <List
      spacing="xs"
      icon={
        <ThemeIcon color="teal" size={24} radius="xl">
          <IconClockHour2 style={{ width: rem(16), height: rem(16) }} />
        </ThemeIcon>
      }
    >
      <List.Item>
        {t("quizzer-since")}: <TimeAgo isoDate={user.createdAt} />
      </List.Item>
      <List.Item>
        {t("last-login")}: <TimeAgo isoDate={user.lastSeen} />
      </List.Item>
      <List.Item
        icon={
          <ThemeIcon color="teal" size={24} radius="xl">
            <IconPacman style={{ width: rem(16), height: rem(16) }} />
          </ThemeIcon>
        }
      >
        {user.lastPlayed ? (
          <span>
            {t("last-played")}: <TimeAgo isoDate={user.lastPlayed} />
          </span>
        ) : (
          <span>{t("never-played")}</span>
        )}
      </List.Item>
      <List.Item
        icon={
          <ThemeIcon color="teal" size={24} radius="xl">
            <IconGhost style={{ width: rem(16), height: rem(16) }} />
          </ThemeIcon>
        }
      >
        {user.lastHosted ? (
          <span>
            {t("last-hosted")}: <TimeAgo isoDate={user.lastHosted} />
          </span>
        ) : (
          <span>{t("never-hosted")}</span>
        )}
      </List.Item>
      <List.Item
        c="blue.6"
        icon={
          <ThemeIcon size={24} radius="xl">
            <IconAt style={{ width: rem(16), height: rem(16) }} />
          </ThemeIcon>
        }
      >
        {t("email")}: {user.email}
      </List.Item>
    </List>
  );
}
