import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useApi } from "../contexts/ApiProvider.js";
import { alphabetical } from "radash";
import { useQuery } from "@tanstack/react-query";
import { Table } from "reactstrap";

const columnHelper = createColumnHelper();
const columns = [
  columnHelper.accessor("name", {
    header: "Name",
  }),
  columnHelper.accessor("email", {
    header: "Email",
  }),
];

export default function QuizzerTable() {
  const api = useApi();

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
          <Table striped bordered hover>
            <table>
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Table>
        </>
      )}
    </>
  );
}
