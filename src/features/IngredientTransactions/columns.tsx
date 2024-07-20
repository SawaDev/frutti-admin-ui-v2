import { formatNumberComma } from "@/lib/utils"
import { ExtendedTransactionIngredient } from "@/types/ingredients"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const ingredientTransactionsColumns = () => {
  return useMemo<ColumnDef<ExtendedTransactionIngredient, any>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: "Nomi"
      },
      {
        accessorKey: 'transaction_quantity',
        id: 'transaction_quantity',
        header: "Miqdori",
        cell: info => formatNumberComma(info.row.getValue("transaction_quantity")),
      },
      {
        accessorFn: row => {
          if (row.unit === 'count') {
            return 'dona'
          } else {
            return row.unit
          }
        },
        cell: info => <span className="capitalize">{info.getValue()}</span>,
        id: 'unit',
        header: "Turi",
      },
      {
        accessorKey: 'transaction_cost',
        id: 'transaction_cost',
        header: "Narxi",
        cell: info => formatNumberComma(info.row.getValue("transaction_cost")),
      },
    ],
    []
  )
}