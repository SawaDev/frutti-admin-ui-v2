import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import React from "react"
import { purchaseColumns } from "./columns"
import { GetAllIngredientPurchasesTypeResponse } from "@/types/ingredients"

interface PurchaseTableProps {
  data: GetAllIngredientPurchasesTypeResponse["data"]
  spanLength?: number
  setPurchaseIndex: (value: number) => void
}

const PurchaseTable: React.FC<PurchaseTableProps> = ({ data, setPurchaseIndex }) => {

  const table = useReactTable({
    data: data ?? [],
    columns: purchaseColumns(),
    getCoreRowModel: getCoreRowModel(),
  })

  return (
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
          table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.index} onClick={() => setPurchaseIndex(Number(row.id))}>
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
              colSpan={99}
              className="h-24 text-center"
            >
              Hech narsa yo'q.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default PurchaseTable