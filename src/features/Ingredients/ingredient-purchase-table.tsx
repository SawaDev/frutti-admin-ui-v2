import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import React, { useState } from "react"
import { purchaseColumns } from "../PurchaseIngredient/columns"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import PurchaseIngredientTable from "../PurchaseIngredient/purchase-ingredient-table"
import useIngredients from "@/hooks/useIngredients"
import { Skeleton } from "@/components/ui/skeleton"

interface IngredientPurchaseTableProps {
  status: "finished" | "waiting" | "on_way"
  from_date: string
  to_date: string
}

const IngredientPurchaseTable: React.FC<IngredientPurchaseTableProps> = ({ status, from_date, to_date }) => {
  const [purchaseIndex, setPurchaseIndex] = useState<number | undefined>()

  const { getAllIngredientPurchasesQuery } = useIngredients()

  const { data: purchases, isLoading: loadingPurchases, isError: errorPurchases } = getAllIngredientPurchasesQuery({ status, from_date, to_date })

  const table = useReactTable({
    data: purchases?.data ?? [],
    columns: purchaseColumns(),
    getCoreRowModel: getCoreRowModel(),
  })

  if (errorPurchases) {
    return <>Error</>
  }

  if (loadingPurchases) {
    return <Skeleton className="w-full h-[300px]" />
  }

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
              <TableRow key={row.index} onClick={() => setPurchaseIndex(row.original.id)}>
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
      {purchaseIndex !== undefined && (
        <Dialog open={true} onOpenChange={() => setPurchaseIndex(undefined)}>
          <DialogContent className="py-3 px-2">
            <PurchaseIngredientTable
              editable={status === "finished" ? false : true}
              purchaseId={purchaseIndex}
              data={purchases?.data.find(d => d.id === purchaseIndex)?.ingredients}
              handleClose={() => setPurchaseIndex(undefined)}
            />
          </DialogContent>
        </Dialog>
      )}
    </Table>
  )
}

export default IngredientPurchaseTable