import { PlusCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import NoItems from "@/features/NoItems";
import useExpenses from "@/hooks/useExpenses";
import AddExpense from "@/features/Expenses/add-expense";
import { getColumns } from "./columns";
import DeleteExpense from "@/features/Expenses/delete-expense";
import { Expense } from "@/types/expenses";

const Expenses = () => {
  const [deleteExpenseId, setDeleteExpenseId] = useState<number | undefined>(
    undefined,
  );
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [editExpense, setEditExpense] = useState<Expense | undefined>(
    undefined,
  );

  const { getAllExpensesQuery } = useExpenses();
  const { data, isLoading, isError } = getAllExpensesQuery();

  const table = useReactTable({
    data: data?.data ?? [],
    columns: getColumns(setDeleteExpenseId, setEditExpense),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>Error</>;
  }

  return (
    <>
      {data?.data.length ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Harajatlar</CardTitle>
              <CardDescription>
                Harajatlarni bu yerdan boshqaring.
              </CardDescription>
            </div>
            <div>
              <Button
                onClick={() => setOpenSheet(true)}
                size="sm"
                variant="ghost"
                className="gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Qo'shish
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={99} className="h-24 text-center">
                      Hech narsa yo'q.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <DeleteExpense
            expenseId={deleteExpenseId}
            setExpenseId={setDeleteExpenseId}
          />
        </Card>
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddExpense open={openSheet} setOpen={setOpenSheet} />
      <AddExpense
        expense={editExpense}
        open={!!editExpense}
        setOpen={() => setEditExpense(undefined)}
      />
    </>
  );
};

export default Expenses;
