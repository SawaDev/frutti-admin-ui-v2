import { Skeleton } from "@/components/ui/skeleton"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import React, { useState } from "react"
import { categoriesColumns } from "./columns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useIngredients from "@/hooks/useIngredients"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { formatNumberComma, getUnit } from "@/lib/utils"
import { MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface IngredientTableType { }

const IngredientTable: React.FC<IngredientTableType> = () => {
  const [deleteModal, setDeleteModal] = useState<number>()

  const {
    getAllIngredientCategoriesExpandedQuery,
    deleteIngredientMutation
  } = useIngredients()

  const { data: categories, isLoading: loadingCategories, isError: errorCategories } = getAllIngredientCategoriesExpandedQuery()


  const deleteIngredient = deleteIngredientMutation(deleteModal)

  const handleDelete = async () => {
    await deleteIngredient.mutateAsync().then(() => {
      setDeleteModal(undefined)
    })
  }

  const categoriesTable = useReactTable({
    data: categories?.data ?? [],
    columns: categoriesColumns(),
    getCoreRowModel: getCoreRowModel(),
  })

  if (loadingCategories) {
    return <Skeleton className="w-full h-[600px]" />
  }

  if (errorCategories) return <>Error</>

  return (
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
                      <TableCell className="p-0 pl-6" colSpan={99}>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>
                                <div className="w-full flex items-center justify-between pr-2 border-r-2">
                                  Nomi
                                </div>
                              </TableHead>
                              <TableHead>
                                <div className="w-full flex items-center justify-between pr-2 border-r-2">
                                  Miqdori
                                </div>
                              </TableHead>
                              <TableHead>
                                <div className="w-full flex items-center justify-between pr-2 border-r-2">
                                  Narxi
                                </div>
                              </TableHead>
                              <TableHead>
                                <div className="w-full flex items-center justify-between pr-2 border-r-2">
                                  Pochkada
                                </div>
                              </TableHead>
                              <TableHead className="sr-only">
                                Actions
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {categories?.data[row.index].ingredients.map((ingredient) => {
                              return (
                                <TableRow className="p-0" key={ingredient.id}>
                                  <TableCell className="p-2 px-4">{ingredient.name}</TableCell>
                                  <TableCell className="p-2 px-4">
                                    {formatNumberComma(ingredient.quantity)}&nbsp;
                                    {
                                      getUnit(ingredient.unit)
                                    }
                                  </TableCell>
                                  <TableCell className="p-2 px-4">{formatNumberComma(ingredient.cost)}</TableCell>
                                  <TableCell className="p-2 px-4">
                                    {formatNumberComma(ingredient.bags_count)} - {formatNumberComma(ingredient.bag_distribution ?? 0)} dan
                                  </TableCell>
                                  <TableCell className="w-16">
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button aria-haspopup="true" size="icon" variant="ghost">
                                          <MoreHorizontal className="h-4 w-4" />
                                          <span className="sr-only">Menu</span>
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
                                        <DropdownMenuItem
                                          className="focus:bg-red-100 focus:text-red-800"
                                          onClick={() => setDeleteModal(ingredient.id)}
                                        >
                                          O'chirish
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
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
      {deleteModal !== undefined && (
        <Dialog open={deleteModal ? true : false} onOpenChange={() => setDeleteModal(undefined)}>
          <DialogContent>
            <DialogTitle>
              Siryoni o'chirish
            </DialogTitle>
            <DialogDescription>
              Siryoni o'chirganingizdan so'ng uni qayta tiklab bo'lmaydi
            </DialogDescription>
            <DialogFooter>
              <Button variant={"outline"} onClick={() => setDeleteModal(undefined)}>
                Bekor qilish
              </Button>
              <Button variant={"destructive"} onClick={handleDelete}>
                O'chirish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Table>
  )
}

export default IngredientTable