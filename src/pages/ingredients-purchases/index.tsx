import { PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table"
import { FormProvider, useForm } from "react-hook-form"
import { endOfDay, endOfMonth, format, startOfDay, startOfMonth } from "date-fns"
import { DateRange } from "react-day-picker"

import NoItems from '@/features/NoItems'
import useIngredients from "@/hooks/useIngredients"
import AddIngredient from "@/features/Ingredients/add-ingredient"
import AddWarehouse from "@/features/Warehouses/add-warehouse"
import PurchaseIngredientTable from "@/features/PurchaseIngredient/purchase-ingredient-table"
import DatePickerWithRange from "@/components/filters/date-range"
import IngredientPurchaseTable from "@/features/Ingredients/ingredient-purchase-table"


import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { IngredientPurchaseType } from "@/types/ingredients"
import { FormInput } from "@/components/form/FormInput"
import { zodResolver } from "@hookform/resolvers/zod"
import { ingredientPurchaseSchema } from "@/schema/ingredients"
import { categoriesColumns, createPurchaseColumns } from "@/features/Ingredients/columns"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { purchaseCountryOptions, purchaseOptions } from "@/constants/options"
import { FormSelect } from "@/components/form/FormSelect"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const IngredientsPurchase = () => {
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());

  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [addWarehouseSheet, setAddWarehouseSheet] = useState<boolean>(false)
  const [purchaseIndex, setPurchaseIndex] = useState<number | undefined>()
  const [date, setDate] = useState<{ from_date: string, to_date: string }>({
    from_date: format(currentMonthStart, "yyyy-MM-dd HH:mm:ss"),
    to_date: format(currentMonthEnd, "yyyy-MM-dd HH:mm:ss")
  })

  const {
    getAllIngredientsQuery,
    createIngredientPurchaseMutation,
    getAllIngredientPurchasesQuery,
    getAllIngredientCategoriesExpandedQuery
  } = useIngredients()

  const { data: ingredients, isLoading: loadingIngredients, isError: errorIngredients } = getAllIngredientsQuery()
  const { data: categories, isLoading: loadingCategories, isError: errorCategories } = getAllIngredientCategoriesExpandedQuery()
  const { data: purchases, isLoading: loadingPurchases, isError: errorPurchases } = getAllIngredientPurchasesQuery({
    status: "finished",
    from_date: date.from_date,
    to_date: date.to_date
  })

  const createPurchase = createIngredientPurchaseMutation()

  const form = useForm<IngredientPurchaseType>({
    resolver: zodResolver(ingredientPurchaseSchema),
    defaultValues: {
      status: "finished",
      purchased_from: "uzbekistan",
      ingredients: []
    }
  })

  const categoriesTable = useReactTable({
    data: categories?.data ?? [],
    columns: categoriesColumns(),
    getCoreRowModel: getCoreRowModel(),
  })

  const table = useReactTable({
    data: [],
    columns: createPurchaseColumns(),
    getCoreRowModel: getCoreRowModel(),
  })

  useEffect(() => {
    if (categories?.data && categories?.data.length > 0) {
      categories.data.forEach((category, categoryIndex) => {
        if (category.ingredients.length > 0) {
          category.ingredients.forEach((ingredient, index) => {
            form.setValue(
              `ingredients.${categoryIndex}.${index}`,
              {
                id: ingredient.id,
                quantity: 0,
                cost_per_unit: ingredient.cost
              }
            )
          })
        } else {
          form.setValue(
            `ingredients.${categoryIndex}`, []
          )
        }
      })
    }
  }, [categories?.data])

  const onSubmit = async (values: IngredientPurchaseType) => {

    const { ingredients, ...others } = values
    const flattenedIngredients = ingredients.flat()

    await createPurchase.mutateAsync({ ingredients: flattenedIngredients, ...others })
  }

  const handleDateChange = (range: DateRange | undefined) => {
    setDate((prev) => ({
      ...prev,
      from_date: range?.from ? format(startOfDay(range.from), "yyyy-MM-dd HH:mm:ss") : "",
      to_date: range?.to ? format(endOfDay(range.to), "yyyy-MM-dd HH:mm:ss") : ""
    }))
  }

  if (loadingIngredients || loadingPurchases || loadingCategories) {
    return <>Loading...</>
  }

  if (errorIngredients || errorPurchases || errorCategories) {
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
                  <div className="grid grid-cols-5 gap-3 mb-3">
                    <FormInput
                      name="total_cost"
                      control={form.control}
                      label="Umumiy Narxi"
                      type="number"
                    />
                    <FormSelect
                      control={form.control}
                      name='status'
                      label='Status'
                      options={purchaseOptions}
                    />
                    <FormSelect
                      control={form.control}
                      name='purchased_from'
                      label='Qayerdan olindi'
                      options={purchaseCountryOptions}
                    />
                  </div>
                  <Table>
                    <TableHeader>
                      {categoriesTable.getHeaderGroups().map((headerGroup) => (
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
                      {categoriesTable.getRowModel().rows?.length ? (
                        categoriesTable.getRowModel().rows.map((row) => (
                          <Collapsible key={row.id} asChild>
                            <>
                              <CollapsibleTrigger asChild>
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
                              </CollapsibleTrigger>
                              <CollapsibleContent asChild>
                                {categories?.data[row.index].ingredients && categories?.data[row.index].ingredients.length && (
                                  <TableRow className="hover:bg-inherit">
                                    <TableCell className="p-0 pl-6" colSpan={6}>
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
                                          {categories?.data[row.index].ingredients.map((ingredient, index) => {
                                            return (
                                              <TableRow className="p-0" key={ingredient.id}>
                                                <TableCell className="p-2 px-4">{ingredient.name}</TableCell>
                                                <TableCell className="p-2 px-4">
                                                  {ingredient.quantity}&nbsp;
                                                  {
                                                    ingredient.unit === 'count'
                                                      ? 'dona'
                                                      : ingredient.unit
                                                  }
                                                </TableCell>
                                                <TableCell className="p-2 px-4">{ingredient.bags_count}</TableCell>
                                                <TableCell className="p-2 px-4">
                                                  <FormInput
                                                    name={`ingredients.${row.index}.${index}.quantity`}
                                                    type="number"
                                                    control={form.control}
                                                    step={0.01}
                                                  />
                                                </TableCell>
                                                <TableCell className="p-2 px-4">
                                                  <FormInput
                                                    name={`ingredients.${row.index}.${index}.cost_per_unit`}
                                                    type="number"
                                                    control={form.control}
                                                    step={0.01}
                                                  />
                                                </TableCell>
                                              </TableRow>
                                            )
                                          })}
                                        </TableBody>
                                      </Table>
                                    </TableCell>
                                  </TableRow>
                                )}
                              </CollapsibleContent>
                            </>
                          </Collapsible>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={99}
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
          <Card className="mx-6 mb-10 p-4">
            <Tabs defaultValue="finished" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-[500px] grid-cols-3">
                  <TabsTrigger value="finished">Tugatilgan</TabsTrigger>
                  <TabsTrigger value="waiting">Kutilayotgan</TabsTrigger>
                  <TabsTrigger value="on_way">Yo'lda</TabsTrigger>
                </TabsList>
                <div className="pr-4">
                  <DatePickerWithRange onChange={handleDateChange} />
                </div>
              </div>
              <TabsContent value="finished">
                <IngredientPurchaseTable status="finished" from_date={date.from_date} to_date={date.to_date} />
              </TabsContent>
              <TabsContent value="waiting">
                <IngredientPurchaseTable status="waiting" from_date={date.from_date} to_date={date.to_date} />
              </TabsContent>
              <TabsContent value="on_way">
                <IngredientPurchaseTable status="on_way" from_date={date.from_date} to_date={date.to_date} />
              </TabsContent>
            </Tabs>
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
            <PurchaseIngredientTable
              data={purchases?.data[purchaseIndex ?? 0].ingredients}
              purchaseId={purchaseIndex}
              handleClose={() => setPurchaseIndex(undefined)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default IngredientsPurchase