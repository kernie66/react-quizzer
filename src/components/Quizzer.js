import { memo } from "react";
import { Link } from "react-router-dom";
import TimeAgo from "./TimeAgo";
import { useTranslation } from "react-i18next";
import QuizzerAvatar from "./QuizzerAvatar.js";
import { Flex, Stack, Text } from "@mantine/core";

export default memo(function Quizzer({ quizzer }) {
  const { t } = useTranslation();

  return (
    <Flex justify="flex-start" className="Quizzer">
      <Text pr="1rem">
        <QuizzerAvatar user={quizzer} size={48} />
      </Text>
      <Stack gap={4} mb="sm">
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
      </Stack>
    </Flex>
  );
});
