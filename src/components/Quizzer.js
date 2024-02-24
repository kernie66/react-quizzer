import { memo } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "./TimeAgo";
import { useTranslation } from "react-i18next";
import QuizzerAvatar from "./QuizzerAvatar.js";
import { Group, Indicator, Text } from "@mantine/core";

export default memo(function Quizzer({ quizzer }) {
  const { t } = useTranslation();

  return (
    <Group className="Quizzer" mb="xs">
      <Group pr="0.5rem">
        <Indicator offset={8} color="grey">
          <QuizzerAvatar user={quizzer} size={48} />
        </Indicator>
      </Group>
      <div>
        <Text>
          <Link to={"/user/" + quizzer.id} className="text-info-emphasis text-decoration-none">
            {quizzer.name}
          </Link>
          {quizzer.isAdmin && (
            <Text span c="red.7">
              &nbsp;({t("administrator")})
            </Text>
          )}
          &nbsp;&mdash;&nbsp;
          {quizzer.lastPlayed ? (
            <>
              <Text span>{t("last-played")} </Text>
              <TimeAgo isoDate={quizzer.lastPlayed} />
            </>
          ) : (
            <Text span>{t("never-played")}</Text>
          )}
        </Text>
        <Text c="blue">
          {t("email")}: {quizzer.email}
        </Text>
      </div>
    </Group>
  );
});
