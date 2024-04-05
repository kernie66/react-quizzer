import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { Box } from "@mantine/core";
import i18next from "i18next";
import { useQuizzersQuery } from "../hooks/useQuizzersQuery.js";
import QuizzersLoading from "./QuizzersLoading.js";
import QuizzerLoadingError from "./QuizzerLoadingError.js";
import { useMemo } from "react";
import QuizzerAvatar from "./QuizzerAvatar.js";

//Import Mantine React Table Translations
import { MRT_Localization_SV } from "mantine-react-table/locales/sv";

export default function QuizzerTable() {
  const {
    isLoading: isLoadingQuizzers,
    isError: isQuizzerError,
    data: quizzers,
  } = useQuizzersQuery();

  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: i18next.t("name"),
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
        header: i18next.t("username"),
      },
      {
        accessorKey: "email",
        header: i18next.t("email"),
      },
    ],
    [],
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
    localization: MRT_Localization_SV,
  });

  if (isLoadingQuizzers) {
    return <QuizzersLoading />;
  }

  if (isQuizzerError) {
    return <QuizzerLoadingError />;
  }

  return <MantineReactTable table={table} />;
}
