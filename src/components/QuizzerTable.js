import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Box } from "@mantine/core";
import { useQuizzersQuery } from "../hooks/useQuizzersQuery.js";
import QuizzersLoading from "./QuizzersLoading.js";
import QuizzerLoadingError from "./QuizzerLoadingError.js";
import { useEffect, useMemo, useState } from "react";
import QuizzerAvatar from "./QuizzerAvatar.js";
import { MRT_Localization_EN } from "mantine-react-table/locales/en";
import { MRT_Localization_SV } from "mantine-react-table/locales/sv";
import { useTranslation } from "react-i18next";

export default function QuizzerTable() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(MRT_Localization_EN);

  const {
    isLoading: isLoadingQuizzers,
    isError: isQuizzerError,
    data: quizzers,
  } = useQuizzersQuery();

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: t("name"),
        enableHiding: false,
        Cell: ({ renderedCellValue, row }) => (
          <Box display="flex">
            <QuizzerAvatar user={row.original} size={24} />
            <span>{renderedCellValue}</span>
          </Box>
        ),
      },
      {
        accessorKey: "username",
        header: t("username"),
      },
      {
        accessorKey: "email",
        header: t("email"),
      },
    ],
    [language],
  );

  const table = useMantineReactTable({
    data: quizzers,
    columns,
    debugAll: false,
    initialState: {
      density: "xs",
      columnVisibility: {
        username: false,
      },
    },
    mantinePaperProps: ({ table }) => ({
      style: {
        zIndex: table.getState().isFullScreen ? 400 : undefined,
      },
      shadow: "md",
      radius: "md",
      withBorder: table.getState().isFullScreen ? false : true,
    }),
    mantineTableProps: {
      striped: true,
    },
    mantineTopToolbarProps: {
      style: {
        minHeight: "2.4rem",
      },
    },
    localization: language,
  });

  if (isLoadingQuizzers) {
    return <QuizzersLoading />;
  }

  if (isQuizzerError) {
    return <QuizzerLoadingError />;
  }

  useEffect(() => {
    const fullLanguageCode = i18n.resolvedLanguage;
    const shortLanguageCode = fullLanguageCode.split("-")[0];
    if (shortLanguageCode === "en") setLanguage(MRT_Localization_EN);
    if (shortLanguageCode === "sv") setLanguage(MRT_Localization_SV);
  });

  return <MantineReactTable table={table} />;
}
