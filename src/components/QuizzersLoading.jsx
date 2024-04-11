import { Group, Loader, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

const BASE_API_URL = import.meta.env.VITE_BASE_API_URL;

export default function QuizzersLoading() {
  const { t } = useTranslation();

  return (
    <Group>
      <Loader color="blue" />
      <Text span>
        {t("getting-data-from")} {BASE_API_URL}
      </Text>
    </Group>
  );
}
