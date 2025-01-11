import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table"
import { zodResolver } from "@hookform/resolvers/zod"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { CreateIngredientTransaction } from "@/types/ingredients"
import { ingredientTransactionSchema } from "@/schema/ingredients"
import { createIngredientTransactionColumns } from "@/features/Ingredients/columns"
import useIngredients from "@/hooks/useIngredients"
import { FormDatePicker } from "@/components/form/FormDatePicker"
import { format } from "date-fns"

interface AddIngredientTransactionProps {
  open: boolean
  setOpen: (open: boolean) => void
}

const AddIngredientTransaction: React.FC<AddIngredientTransactionProps> = ({ open, setOpen }) => {
  const { getAllIngredientsQuery, createIngredientTransactionMutation } = useIngredients()
  const { data: ingredients } = getAllIngredientsQuery()
  const createPurchase = createIngredientTransactionMutation()

  const form = useForm<CreateIngredientTransaction>({
    resolver: zodResolver(ingredientTransactionSchema),
    defaultValues: {
      ingredients: [],
      date: format(new Date(), "yyyy-MM-dd")
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

  const createIngredientTransactionTable = useReactTable({
    data: ingredients?.data ?? [],
    columns: createIngredientTransactionColumns(form),
    getCoreRowModel: getCoreRowModel(),
  })

  const onSubmit = async (values: CreateIngredientTransaction) => {
    const ingredients = values.ingredients.filter(i => i.quantity > 0)
    await createPurchase.mutateAsync({
      ...values,
      ingredients
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-full sm:min-w-[80vw] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ishlatilingan Siryolar</SheetTitle>
        </SheetHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="space-y-4 py-4">
              <FormDatePicker
                name="date"
                className="max-w-[300px]"
                label="Ishlatilingan sana"
                control={form.control}
              />
              <Table>
                <TableHeader>
                  {createIngredientTransactionTable.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
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
                      ))}
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
                      <TableCell className="h-24 text-center">
                        Hech narsa yo'q.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={createPurchase.isPending}
                >
                  Saqlash
                </Button>
              </div>
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  )
}

export default AddIngredientTransaction 