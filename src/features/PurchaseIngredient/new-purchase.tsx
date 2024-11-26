import { Sheet, SheetContent } from '@/components/ui/sheet'
import { SheetType } from '@/types/other'
import React, { useEffect } from 'react'
import { FormProvider, useForm } from "react-hook-form"
import { getCoreRowModel, useReactTable, flexRender } from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FormInput } from "@/components/form/FormInput"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { purchaseCountryOptions, purchaseOptions } from "@/constants/options"
import { FormSelect } from "@/components/form/FormSelect"
import { IngredientPurchaseType } from '@/types/ingredients'
import { ingredientPurchaseSchema } from '@/schema/ingredients'
import { zodResolver } from '@hookform/resolvers/zod'
import useIngredients from '@/hooks/useIngredients'
import { categoriesColumns, createPurchaseColumns } from '../Ingredients/columns'
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import useProviders from '@/hooks/useProviders'

const NewPurchase: React.FC<SheetType> = ({ open, setOpen }) => {
  const { createIngredientPurchaseMutation, getAllIngredientCategoriesExpandedQuery } = useIngredients()
  const { getAllProvidersQuery } = useProviders()

  const { data: categories, isLoading: loadingCategories, isError: errorCategories } = getAllIngredientCategoriesExpandedQuery()
  const { data: providers, isLoading: loadingProviders, isError: errorProviders } = getAllProvidersQuery()

  const createPurchase = createIngredientPurchaseMutation()

  const form = useForm<IngredientPurchaseType>({
    resolver: zodResolver(ingredientPurchaseSchema),
    defaultValues: {
      total_cost: 0,
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
        if (category.ingredients?.length > 0) {
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

  if (loadingCategories || loadingProviders) {
    return <>Loading...</>
  }

  if (errorCategories || errorProviders) {
    return <>Error</>
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='sm:max-w-[80vw]'>
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
                <FormSelect
                  control={form.control}
                  name='provider_id'
                  label='Yetkazib beruvchi'
                  options={providers
                    ? providers?.data.map((provider) => ({ label: provider.name, value: provider.id.toString() }))
                    : []
                  }
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
                            {categories?.data[row.index].ingredients && categories?.data[row.index].ingredients?.length && (
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
      </SheetContent>
    </Sheet>
  )
}

export default NewPurchase