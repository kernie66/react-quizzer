import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Alert, Table } from "@mantine/core";
import i18next from "i18next";
import useQuizzersQuery from "../hooks/useQuizzersQuery.js";
import { TbInfoCircle } from "react-icons/tb";
import { useTranslation } from "react-i18next";

export default function QuizzerTable() {
  const { t } = useTranslation();
  const icon = <TbInfoCircle />;

  const {
    isLoading: isLoadingQuizzers,
    isError: quizzerError,
    data: quizzers,
  } = useQuizzersQuery();

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", {
      header: i18next.t("name"),
    }),
    columnHelper.accessor("email", {
      header: i18next.t("email"),
    }),
  ];

  const table = useReactTable({
    data: quizzers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugAll: true,
  });

  return (
    <>
      {quizzerError ? (
        <Alert variant="light" color="red" title="Quizzers" icon={icon}>
          {t("could-not-retrieve-quizzers")}
        </Alert>
      ) : (
        <>
          {isLoadingQuizzers ? (
            <>Loading</>
          ) : (
            <>
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
            </>
          )}
        </>
      )}
    </>
  );
}
