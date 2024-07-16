import { ExtendedIngredient } from "@/types/ingredients"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import React from "react"
import { purchaseIngredientColumns } from "./columns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PurchaseIngredientTableType {
  data: ExtendedIngredient[] | undefined
}

const PurchaseIngredientTable: React.FC<PurchaseIngredientTableType> = ({ data }) => {

  const table = useReactTable({
    data: data ?? [],
    columns: purchaseIngredientColumns(),
    filterFns: {},
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
              <TableCell
                colSpan={purchaseIngredientColumns().length}
                className="h-24 text-center"
              >
                Hech narsa yo'q.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </ScrollArea>
    </Table>
  )
}

export default PurchaseIngredientTable