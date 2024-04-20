import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Box } from "@mantine/core";
import { useQuizzersQuery } from "../../hooks/useQuizzersQuery";
import { useEffect, useMemo, useState } from "react";
import { ActionIcon, Tooltip } from "@mantine/core";
import { TbRefresh } from "react-icons/tb";
import QuizzerAvatar from "../QuizzerAvatar";
import { MRT_Localization_EN } from "mantine-react-table/locales/en/index.cjs";
import { MRT_Localization_SV } from "mantine-react-table/locales/sv/index.cjs";
import { useTranslation } from "react-i18next";
import { QuizzerLoadingError } from "../LoadingErrors";

export default function QuizzerTable() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(MRT_Localization_EN);

  const {
    isLoading: isLoadingQuizzers,
    isFetching: isFetchingQuizzers,
    isError: isQuizzerError,
    data: quizzers = [],
    refetch,
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
    [t],
  );

  const table = useMantineReactTable({
    data: quizzers,
    columns,
    state: {
      isLoading: isLoadingQuizzers,
      showProgressBars: isFetchingQuizzers,
      showAlertBanner: isQuizzerError,
    },
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
    mantineToolbarAlertBannerProps: isQuizzerError
      ? {
          color: "red",
          children: <QuizzerLoadingError />,
        }
      : undefined,
    renderTopToolbarCustomActions: () => (
      <Tooltip label="Refresh Data">
        <ActionIcon variant="transparent" onClick={() => refetch()}>
          <TbRefresh />
        </ActionIcon>
      </Tooltip>
    ),
    localization: language,
  });

  /*
  if (isLoadingQuizzers) {
    return <QuizzersLoading />;
  }

  if (isQuizzerError) {
    return <QuizzerLoadingError />;
  }
  */

  useEffect(() => {
    const fullLanguageCode = i18n.resolvedLanguage;
    const shortLanguageCode = fullLanguageCode.split("-")[0];
    if (shortLanguageCode === "en") setLanguage(MRT_Localization_EN);
    if (shortLanguageCode === "sv") setLanguage(MRT_Localization_SV);
  }, [setLanguage, i18n.resolvedLanguage]);

  return <MantineReactTable table={table} />;
}
