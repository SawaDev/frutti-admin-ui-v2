import { Skeleton } from "@/components/ui/skeleton"
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import React, { useState } from "react"
import { getColumns } from "./columns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import useIngredients from "@/hooks/useIngredients"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface IngredientTableType { }

const IngredientTable: React.FC<IngredientTableType> = () => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [deleteModal, setDeleteModal] = useState<number>()

  const { getAllIngredientsQuery, deleteIngredientMutation } = useIngredients()

  const { data: ingredients, isLoading } = getAllIngredientsQuery()

  const deleteIngredient = deleteIngredientMutation(deleteModal)

  const handleDelete = async () => {
    await deleteIngredient.mutateAsync().then(() => {
      setDeleteModal(undefined)
    })
  }

  const table = useReactTable({
    data: ingredients?.data ?? [],
    columns: getColumns(setDeleteModal),
    filterFns: {},
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />
  }

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  <div className="flex items-center justify-between pr-2 border-r-2">
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
              colSpan={getColumns(setDeleteModal).length}
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
              Siyoni o'chirish
            </DialogTitle>
            <DialogDescription>
              Siryoni o'chirganingizdan so'ng uni qayta tiklab bo'lmaydi
            </DialogDescription>
            <DialogFooter>
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