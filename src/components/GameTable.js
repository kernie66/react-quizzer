import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Table } from "@mantine/core";
import i18next from "i18next";
import QuizzersLoading from "./QuizzersLoading.js";
import QuizzerLoadingError from "./QuizzerLoadingError.js";
import { useGamesQuery } from "../hooks/useGamesQuery.js";

export default function GameTable() {
  const { isLoading: isLoadingGames, isError: isGamesError, data: games } = useGamesQuery();

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("id", {
      header: i18next.t("id"),
    }),
    columnHelper.accessor("quizDate", {
      header: i18next.t("quiz-date"),
    }),
  ];

  const table = useReactTable({
    data: games,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugAll: false,
  });

  if (isLoadingGames) {
    return <QuizzersLoading />;
  }

  if (isGamesError) {
    return <QuizzerLoadingError />;
  }

  return (
    <Table striped highlightOnHover>
      <Table.Thead>
        {table.getHeaderGroups().map((headerGroup) => (
          <Table.Tr key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <Table.Th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </Table.Th>
            ))}
          </Table.Tr>
        ))}
      </Table.Thead>
      <Table.Tbody>
        {table.getRowModel().rows.map((row) => (
          <Table.Tr key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <Table.Td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}
