import { Alert } from "@mantine/core";
import { TbInfoCircle } from "react-icons/tb";
import { useTranslation } from "react-i18next";

const errorIcon = <TbInfoCircle />;

export function QuizzerLoadingError() {
  const { t } = useTranslation();

  return (
    <Alert variant="light" color="red" title={t("quizzers")} icon={errorIcon}>
      {t("could-not-retrieve-quizzers")}
    </Alert>
  );
}

export function GamesLoadingError() {
  const { t } = useTranslation();

  return (
    <Alert variant="light" color="red" title={t("games")} icon={errorIcon}>
      {t("could-not-retrieve-games")}
    </Alert>
  );
}
