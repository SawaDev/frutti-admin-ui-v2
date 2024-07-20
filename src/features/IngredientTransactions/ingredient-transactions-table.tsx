import { ExtendedTransactionIngredient } from "@/types/ingredients"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ingredientTransactionsColumns } from "./columns"

interface IngredientTransactionsTableType {
  data: ExtendedTransactionIngredient[] | undefined
}

const IngredientTransactionsTable: React.FC<IngredientTransactionsTableType> = ({ data }) => {

  const table = useReactTable({
    data: data ?? [],
    columns: ingredientTransactionsColumns(),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <Table>
      <ScrollArea className="max-h-[800px]">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id} colSpan={header.colSpan} className="border-r-2 last:border-none">
                    <div className="flex items-center justify-between pr-2">
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
              <TableCell className="h-24 text-center">
                Hech narsa yo'q.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ScrollArea>
    </Table>
  )
}

export default IngredientTransactionsTable