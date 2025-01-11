import { useState } from "react";
import {
  getCoreRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NoItems from "@/features/NoItems";
import useIngredients from "@/hooks/useIngredients";
import AddIngredient from "@/features/Ingredients/add-ingredient";
import AddWarehouse from "@/features/Warehouses/add-warehouse";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ingredientTransactionColumns } from "@/features/Ingredients/columns";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import IngredientTransactionsTable from "@/features/IngredientTransactions/ingredient-transactions-table";
import DatePickerWithRange from "@/components/filters/date-range";
import AddIngredientTransaction from "@/features/IngredientTransactions/add-ingredient-transaction";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import DeleteIngredientTransaction from "@/features/IngredientTransactions/delete-ingredient-transaction";

const IngredientTransaction = () => {
  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [addWarehouseSheet, setAddWarehouseSheet] = useState<boolean>(false);
  const [addTransactionSheet, setAddTransactionSheet] =
    useState<boolean>(false);
  const [transactionIndex, setTransactionIndex] = useState<
    number | undefined
  >();
  const [deleteTransactionIndex, setDeleteTransactionIndex] = useState<
    number | undefined
  >();

  const { getAllIngredientsQuery, getAllIngredientTransactionsQuery } =
    useIngredients();

  const {
    data: ingredients,
    isLoading: loadingIngredients,
    isError: errorIngredients,
  } = getAllIngredientsQuery();
  const {
    data: transactions,
    isLoading: loadingTransactions,
    isError: errorTransactions,
  } = getAllIngredientTransactionsQuery();

  const ingredientTransactionsTable = useReactTable({
    data: transactions?.data ?? [],
    columns: ingredientTransactionColumns(setDeleteTransactionIndex),
    getCoreRowModel: getCoreRowModel(),
  });

  if (loadingIngredients || loadingTransactions) {
    return <>Loading...</>;
  }

  if (errorIngredients || errorTransactions) {
    return <>Error</>;
  }

  return (
    <>
      {ingredients?.data.length ? (
        <>
          <Card className="mx-6 my-10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex flex-col">
                <CardTitle>Ishlatilgan siryolar</CardTitle>
                <CardDescription>
                  Ishlatilgan siryolar ro'yhati
                </CardDescription>
              </div>
              <div className="flex flex-row items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setAddTransactionSheet(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />Ishlatilgan siryoni
                  qo'shish
                </Button>
                <DatePickerWithRange />
              </div>
            </CardHeader>
            <Table>
              <TableHeader>
                {ingredientTransactionsTable
                  .getHeaderGroups()
                  .map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            <div className="flex w-full items-center justify-between border-r-2 pr-2">
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext(),
                                  )}
                            </div>
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
              </TableHeader>
              <TableBody>
                {ingredientTransactionsTable.getRowModel().rows?.length ? (
                  ingredientTransactionsTable.getRowModel().rows.map((row) => {
                    return (
                      <TableRow
                        key={row.index}
                        onClick={() => setTransactionIndex(row.index)}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell className="h-24 text-center">
                      Hech narsa yo'q.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>
          <AddIngredientTransaction
            open={addTransactionSheet}
            setOpen={setAddTransactionSheet}
          />
        </>
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddIngredient open={openSheet} setOpen={setOpenSheet} />
      <AddWarehouse open={addWarehouseSheet} setOpen={setAddWarehouseSheet} />
      {transactionIndex !== undefined && (
        <Dialog open={true} onOpenChange={() => setTransactionIndex(undefined)}>
          <DialogContent className="px-2 py-3">
            <IngredientTransactionsTable
              data={transactions?.data[transactionIndex ?? 0].ingredients}
            />
          </DialogContent>
        </Dialog>
      )}
      <DeleteIngredientTransaction
        open={deleteTransactionIndex}
        onOpenChange={(open) => !open && setDeleteTransactionIndex(undefined)}
      />
    </>
  );
};

export default IngredientTransaction;
