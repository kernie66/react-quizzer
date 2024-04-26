import { ActionIcon, Tooltip } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { MRT_Localization_EN } from "mantine-react-table/locales/en/index.cjs";
import { MRT_Localization_SV } from "mantine-react-table/locales/sv/index.cjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TbRefresh } from "react-icons/tb";
import { useGamesQuery } from "../../hooks/useGamesQuery";
import { GamesLoadingError } from "../LoadingErrors";

export default function GameTable() {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState(MRT_Localization_EN);

  const {
    isLoading: isLoadingGames,
    isFetching: isFetchingGames,
    isError: isGamesError,
    data: games = [],
    refetch,
  } = useGamesQuery();

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: t("id"),
      },
      {
        accessorKey: "gameMaster",
        header: t("quiz-master"),
      },
      {
        accessorFn: (originalRow) => t(originalRow.status),
        id: "status",
        header: t("quiz-status"),
        filterVariant: "multi-select",
      },
      {
        accessorKey: "quizDate",
        header: t("quiz-date"),
      },
    ],
    [t],
  );

  const table = useMantineReactTable({
    data: games,
    columns,
    enableFacetedValues: true,
    state: {
      isLoading: isLoadingGames,
      showProgressBars: isFetchingGames,
      showAlertBanner: isGamesError,
    },
    debugAll: false,
    mantineToolbarAlertBannerProps: isGamesError
      ? {
          color: "red",
          children: <GamesLoadingError />,
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
  if (isLoadingGames) {
    return <QuizzersLoading />;
  }

  if (isGamesError) {
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
