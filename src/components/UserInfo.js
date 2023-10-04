import { useTranslation } from "react-i18next";
import TimeAgo from "./TimeAgo.js";
import { useInterval } from "@mantine/hooks";
import { useEffect, useState } from "react";

export default function UserInfo({ user }) {
  const { t } = useTranslation();
  const [update, setUpdate] = useState(0);
  const interval = useInterval(() => setUpdate((u) => u + 1), 5 * 1000);

  useEffect(() => {
    interval.start();
    return interval.stop;
  }, [update]);

  return (
    <ul className="list-unstyled">
      <li>
        {t("quizzer-since")}: <TimeAgo isoDate={user.createdAt} />
      </li>
      <li>
        {t("last-login")}: <TimeAgo isoDate={user.lastSeen} />
      </li>
      <li>
        {user.lastPlayed ? (
          <span>
            {t("last-played")}: <TimeAgo isoDate={user.lastPlayed} />
          </span>
        ) : (
          <span>{t("never-played")}</span>
        )}
      </li>
      <li>
        {user.lastHosted ? (
          <span>
            {t("last-hosted")}: <TimeAgo isoDate={user.lastHosted} />
          </span>
        ) : (
          <span>{t("never-hosted")}</span>
        )}
      </li>
      <li className="pt-1 text-info">
        {t("email")}: {user.email}
      </li>
    </ul>
  );
}
