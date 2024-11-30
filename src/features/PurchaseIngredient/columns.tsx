import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatNumberComma, getUnit } from "@/lib/utils"
import { ExtendedIngredient, GetAllIngredientPurchasesTypeResponse } from "@/types/ingredients"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"
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

export const purchaseColumns = (setDelete: (id: number) => void) => {
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
      },
      {
        accessorFn: (row) => row.id,
        id: "actions",
        header: () => <span className="sr-only">Harakatlar</span>,
        cell: (info) => (
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
                onClick={(event) => {
                  event.stopPropagation()
                  setDelete(info.row.original.id)
                }}
              >
                O'chirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    []
  )
}