import { PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { ColumnFiltersState, getCoreRowModel, useReactTable, getFilteredRowModel, flexRender } from "@tanstack/react-table"

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
import { IngredientPurchaseType } from "@/types/ingredients"
import { FormInput } from "@/components/form/FormInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { ingredientPurchaseSchema } from "@/schema/ingredients"
import { createPurchaseColumns, purchaseColumns } from "@/features/Ingredients/columns"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import PurchaseIngredientTable from "@/features/PurchaseIngredient/purchase-ingredient-table"

const IngredientsPurchase = () => {
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [addWarehouseSheet, setAddWarehouseSheet] = useState<boolean>(false)
  const [purchaseIndex, setPurchaseIndex] = useState<number | undefined>()
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const { getAllIngredientsQuery, createIngredientPurchaseMutation, getAllIngredientPurchasesQuery } = useIngredients()

  const { data: ingredients, isLoading: loadingIngredients, isError: errorIngredients } = getAllIngredientsQuery()
  const { data: purchases, isLoading: loadingPurchases, isError: errorPurchases } = getAllIngredientPurchasesQuery()

  const createPurchase = createIngredientPurchaseMutation()

  const form = useForm<IngredientPurchaseType>({
    resolver: zodResolver(ingredientPurchaseSchema),
    defaultValues: {
      total_cost: 0,
      ingredients: []
    }
  })

  useEffect(() => {
    if (ingredients) {
      form.setValue("ingredients", ingredients.data.map(i => ({
        id: i.id,
        quantity: 0,
        cost_per_unit: i.cost
      })))
    }
  }, [ingredients])

  const table = useReactTable({
    data: ingredients?.data ?? [],
    columns: createPurchaseColumns(form),
    filterFns: {},
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const purchaseTable = useReactTable({
    data: purchases?.data ?? [],
    columns: purchaseColumns(),
    filterFns: {},
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  const onSubmit = async (values: IngredientPurchaseType) => {
    const ingredients = values.ingredients.filter(i => i.quantity > 0)
    await createPurchase.mutateAsync({
      ...values,
      ingredients
    })
  }

  if (loadingIngredients || loadingPurchases) {
    return <>Loading...</>
  }

  if (errorIngredients || errorPurchases) {
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
                    <CardTitle>Siryo Haridlari</CardTitle>
                    <CardDescription>
                      Sotib olingan siryolarni bu yerdan boshqaring.
                    </CardDescription>
                  </div>
                  <div>
                    <Button type="button" onClick={() => setAddWarehouseSheet(true)} size="sm" variant="ghost" className="gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      Sklad qo'shish
                    </Button>
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
                <CardContent>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <FormInput
                      name="total_cost"
                      control={form.control}
                      label="Umumiy Narxi"
                    />
                    <FormInput
                      name="shipping_cost"
                      control={form.control}
                      label="Yetkaziz Berish Narxi"
                    />
                    <FormInput
                      name="fee"
                      control={form.control}
                      label="Soliq Narxi"
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      {table.getHeaderGroups().map((headerGroup) => (
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
                      {table.getRowModel().rows?.length ? (
                        table.getRowModel().rows.map((row) => (
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
                            colSpan={createPurchaseColumns(form).length}
                            className="h-24 text-center"
                          >
                            Hech narsa yo'q.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </form>
            </FormProvider>
          </Card>
          <Card className="mx-6 mb-10">
            <Table>
              <TableHeader>
                {purchaseTable.getHeaderGroups().map((headerGroup) => (
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
                {purchaseTable.getRowModel().rows?.length ? (
                  purchaseTable.getRowModel().rows.map((row) => {
                    // const ingredientLength = purchases?.data[row.index].ingredients.length ?? 0

                    return (
                      <TableRow key={row.index} onClick={() => setPurchaseIndex(row.index)}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        ))}
                        {/* <div
                          className={`relative w-full bg-green-200`}
                          // style={{ marginBottom: ingredientLength * 20 }}
                        >
                          <div className="absolute w-[800px] bg-red-400">gkfdjgkldgjldk</div>
                        </div> */}
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={createPurchaseColumns(form).length}
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
      {purchaseIndex !== undefined && (
        <Dialog open={true} onOpenChange={() => setPurchaseIndex(undefined)}>
          <DialogContent className="py-3 px-2">
            <PurchaseIngredientTable data={purchases?.data[purchaseIndex ?? 0].ingredients} />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default IngredientsPurchase