import { PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { getCoreRowModel, useReactTable, getFilteredRowModel, flexRender } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import NoItems from '@/features/NoItems'
import useIngredients from "@/hooks/useIngredients"
import AddIngredient from "@/features/Ingredients/add-ingredient"
import AddWarehouse from "@/features/Warehouses/add-warehouse"

import { FormProvider, useForm } from "react-hook-form"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CreateIngredientTransaction } from "@/types/ingredients"
import { FormInput } from "@/components/form/FormInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { ingredientTransactionSchema } from "@/schema/ingredients"
import { createIngredientTransactionColumns, ingredientTransactionColumns } from "@/features/Ingredients/columns"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import IngredientTransactionsTable from "@/features/IngredientTransactions/ingredient-transactions-table"
import DatePickerWithRange from "@/components/filters/date-range"

const IngredientTransaction = () => {
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [addWarehouseSheet, setAddWarehouseSheet] = useState<boolean>(false)
  const [transactionIndex, setTransactionIndex] = useState<number | undefined>()

  const { getAllIngredientsQuery, getAllIngredientTransactionsQuery, createIngredientTransactionMutation } = useIngredients()

  const { data: ingredients, isLoading: loadingIngredients, isError: errorIngredients } = getAllIngredientsQuery()
  const { data: transactions, isLoading: loadingTransactions, isError: errorTransactions } = getAllIngredientTransactionsQuery()

  const createPurchase = createIngredientTransactionMutation()

  const form = useForm<CreateIngredientTransaction>({
    resolver: zodResolver(ingredientTransactionSchema),
    defaultValues: {
      ingredients: []
    }
  })

  useEffect(() => {
    if (ingredients) {
      form.setValue("ingredients", ingredients.data.map(i => ({
        id: i.id,
        quantity: 0,
      })))
    }
  }, [ingredients])

  const ingredientTransactionsTable = useReactTable({
    data: transactions?.data ?? [],
    columns: ingredientTransactionColumns(),
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const createIngredientTransactionTable = useReactTable({
    data: ingredients?.data ?? [],
    columns: createIngredientTransactionColumns(form),
    filterFns: {},
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const onSubmit = async (values: CreateIngredientTransaction) => {
    const ingredients = values.ingredients.filter(i => i.quantity > 0)
    await createPurchase.mutateAsync({
      ...values,
      ingredients
    })
  }

  if (loadingIngredients || loadingTransactions) {
    return <>Loading...</>
  }

  if (errorIngredients || errorTransactions) {
    return <>Error</>
  }

  return (
    <>
      {ingredients?.data.length ? (
        <>
          <Card className="my-4 mx-6">
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Ishlatilingan Siryolar</CardTitle>
                    <CardDescription>
                      Ishlatilingan siryolarni bu yerdan boshqaring.
                    </CardDescription>
                  </div>
                  <div>
                    <Button type="button" onClick={() => setOpenSheet(true)} size="sm" variant="ghost" className="gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      Siryo qo'shish
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      variant="default"
                      className="ml-3"
                      disabled={createPurchase.isPending}
                    >
                      Saqlash
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Table>
                      <TableHeader>
                        {createIngredientTransactionTable.getHeaderGroups().map((headerGroup) => (
                          <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                              return (
                                <TableHead key={header.id} colSpan={header.colSpan}>
                                  <div className="w-full flex items-center justify-between pr-2">
                                    {header.isPlaceholder
                                      ? null
                                      : flexRender(
                                        header.column.columnDef.header,
                                        header.getContext()
                                      )
                                    }
                                  </div>
                                </TableHead>
                              )
                            })}
                          </TableRow>
                        ))}
                      </TableHeader>
                      <TableBody>
                        {createIngredientTransactionTable.getRowModel().rows?.length ? (
                          createIngredientTransactionTable.getRowModel().rows.map((row) => (
                            <TableRow
                              key={row.id}
                              data-state={row.getIsSelected() && "selected"}
                            >
                              {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </TableCell>
                              ))}
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              className="h-24 text-center"
                            >
                              Hech narsa yo'q.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="col-span-1">
                    <FormInput
                      name="comment"
                      control={form.control}
                      label="Kommentariya"
                    />
                  </div>
                </CardContent>
              </form>
            </FormProvider>
          </Card>
          <Card className="mx-6 mb-10">
            <div className="flex flex-col pl-4 pt-4">
              <DatePickerWithRange /> 
            </div>
            <Table>
              <TableHeader>
                {ingredientTransactionsTable.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          <div className="w-full flex items-center justify-between pr-2 border-r-2">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
                            }
                          </div>
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {ingredientTransactionsTable.getRowModel().rows?.length ? (
                  ingredientTransactionsTable.getRowModel().rows.map((row) => {
                    return (
                      <TableRow key={row.index} onClick={() => setTransactionIndex(row.index)}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      className="h-24 text-center"
                    >
                      Hech narsa yo'q.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card >
        </>
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddIngredient open={openSheet} setOpen={setOpenSheet} />
      <AddWarehouse open={addWarehouseSheet} setOpen={setAddWarehouseSheet} />
      {transactionIndex !== undefined && (
        <Dialog open={true} onOpenChange={() => setTransactionIndex(undefined)}>
          <DialogContent className="py-3 px-2">
            <IngredientTransactionsTable data={transactions?.data[transactionIndex ?? 0].ingredients} />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default IngredientTransaction