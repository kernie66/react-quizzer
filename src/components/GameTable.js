import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import i18next from "i18next";
import QuizzersLoading from "./QuizzersLoading.js";
import QuizzerLoadingError from "./QuizzerLoadingError.js";
import { useGamesQuery } from "../hooks/useGamesQuery.js";
import { useMemo } from "react";

export default function GameTable() {
  const { isLoading: isLoadingGames, isError: isGamesError, data: games = [] } = useGamesQuery();

  const columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: i18next.t("id"),
      },
      {
        accessorKey: "quizDate",
        header: i18next.t("quiz-date"),
      },
    ],
    [],
  );

  const table = useMantineReactTable({
    data: games,
    columns,
    state: { isLoading: isLoadingGames },
    debugAll: false,
  });

  if (isLoadingGames) {
    return <QuizzersLoading />;
  }

  if (isGamesError) {
    return <QuizzerLoadingError />;
  }

  return <MantineReactTable table={table} />;
}
