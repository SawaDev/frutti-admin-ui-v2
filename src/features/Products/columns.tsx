import { useMemo } from "react"
import { MoreHorizontal } from "lucide-react"
import { ColumnDef } from "@tanstack/react-table"

import { formatNumberComma } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Product } from "@/types/products"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export const productColumns = (setOpen: (value: number) => void) => {
  return useMemo<ColumnDef<Product, any>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: "Nomi",
      },
      {
        accessorKey: 'quantity',
        id: 'quantity',
        header: "Soni",
        cell: info => formatNumberComma(info.row.getValue("quantity")),
      },
      {
        accessorKey: 'price',
        id: 'price',
        header: "Narxi",
        cell: info => formatNumberComma(info.getValue()),
      },
      {
        accessorKey: 'price_in_dollar',
        id: 'price_in_dollar',
        header: "Narxi ($)",
        cell: info => formatNumberComma(info.getValue()),
      },
      {
        accessorKey: 'pure_price',
        id: 'pure_price',
        header: "Sof narxi",
        cell: info => formatNumberComma(info.getValue()),
      },
      {
        accessorKey: 'production_cost',
        id: 'production_cost',
        header: "Ishlab chiqarish narxi",
        cell: info => formatNumberComma(info.getValue()),
      },
      {
        accessorKey: 'warehouse.name',
        id: 'warehouse.name',
        header: "Sklad"
      },
      {
        accessorFn: row => row.id,
        id: "actions",
        header: () => (<span className="sr-only">Harakatlar</span>),
        cell: info => (
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
                onClick={() => setOpen(info.getValue())}
              >
                O'chirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      }
    ],
    []
  )
}