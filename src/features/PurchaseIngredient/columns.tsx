import { Badge } from "@/components/ui/badge"
import { formatNumberComma, getUnit } from "@/lib/utils"
import { ExtendedIngredient, GetAllIngredientPurchasesTypeResponse } from "@/types/ingredients"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
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
        accessorFn: row => `${formatNumberComma(row.purchase_cost_per_unit)} ${getUnit(row.unit)}`,
        id: 'purchase_quantity',
        header: "Miqdori"
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

export const purchaseColumns = () => {
  return useMemo<ColumnDef<GetAllIngredientPurchasesTypeResponse["data"][0], any>[]>(
    () => [
      {
        accessorFn: row => format(row.created_at, "dd-MM-yyyy HH:mm:ss"),
        id: 'created_at',
        header: () => 'Yaratilingan sana',
        cell: info => info.getValue(),
      },
      {
        accessorKey: 'totals.cost',
        id: 'totals.cost',
        header: "Umumiy summasi",
        cell: info => formatNumberComma(info.row.getValue("totals.cost")),
      },
      {
        accessorKey: 'totals.count',
        id: 'totals.count',
        header: "Dona hammasi",
        cell: info => formatNumberComma(info.row.getValue("totals.count")),
      },
      {
        accessorKey: 'totals.kg',
        id: 'totals.kg',
        header: "Kg hammasi",
        cell: info => formatNumberComma(info.row.getValue("totals.kg")),
      },
      {
        accessorKey: 'totals.gr',
        id: 'totals.gr',
        header: "Gr hammasi",
        cell: info => formatNumberComma(info.row.getValue("totals.gr")),
      },
      {
        accessorKey: 'status',
        id: 'status',
        header: "Status",
        cell: info => {
          switch (info.row.getValue("status")) {
            case 'finished':
              return <Badge variant={"success"}>Yetib kelgan</Badge>
            case 'waiting':
              return <Badge variant={"destructive"}>Kutilmoqda</Badge>
            case 'on_way':
              return <Badge variant={"secondary"}>Yo'lda</Badge>
            default:
              return <></>
          }
        },
      }
    ],
    []
  )
}