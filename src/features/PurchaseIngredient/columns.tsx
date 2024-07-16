import { formatNumberComma } from "@/lib/utils"
import { ExtendedIngredient } from "@/types/ingredients"
import { ColumnDef } from "@tanstack/react-table"
import { useMemo } from "react"

export const purchaseIngredientColumns = () => {
  return useMemo<ColumnDef<ExtendedIngredient, any>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: "Nomi"
      },
      {
        accessorKey: 'purchase_quantity',
        id: 'purchase_quantity',
        header: "Miqdori",
        cell: info => formatNumberComma(info.row.getValue("purchase_quantity")),
      },
      {
        accessorKey: 'purchase_cost_per_unit',
        id: 'purchase_cost_per_unit',
        header: "Narxi",
        cell: info => formatNumberComma(info.row.getValue("purchase_cost_per_unit")),
      },
    ],
    []
  )
}