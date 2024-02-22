import { Alert } from "@mantine/core";
import { TbInfoCircle } from "react-icons/tb";
import { useTranslation } from "react-i18next";

export default function QuizzerLoadingError() {
  const { t } = useTranslation();
  const icon = <TbInfoCircle />;

  return (
    <Alert variant="light" color="red" title="Quizzers" icon={icon}>
      {t("could-not-retrieve-quizzers")}
    </Alert>
  );
}
