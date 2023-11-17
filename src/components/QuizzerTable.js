import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useApi } from "../contexts/ApiProvider.js";
import { alphabetical } from "radash";
import { useQuery } from "@tanstack/react-query";
import { Table } from "@mantine/core";
import i18next from "i18next";

export default function QuizzerTable() {
  const api = useApi();

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("name", {
      header: i18next.t("name"),
    }),
    columnHelper.accessor("email", {
      header: i18next.t("email"),
    }),
  ];

  const getQuizzers = async () => {
    const response = await api.get("/users");
    if (response.ok) {
      const quizzers = alphabetical(response.data, (item) => item.name);
      /*       if (currentId) {
          const [, otherQuizzers] = fork(quizzers, (q) => q.id === currentId);
          return otherQuizzers;
        } else { */
      return quizzers;
      // }
    } else {
      // setUser(null);
      throw new Error("No quizzers found");
    }
  };

  const { isLoading: isLoadingQuizzers, data: quizzers } = useQuery({
    queryKey: ["quizzers"],
    queryFn: () => getQuizzers(),
  });

  const table = useReactTable({
    data: quizzers,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugAll: true,
  });

  return (
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
  );
}
