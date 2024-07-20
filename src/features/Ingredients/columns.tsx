import { useMemo } from "react"

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ingredientCategoryOptions, unitOptions } from "@/constants/options"
import { formatNumberComma } from "@/lib/utils"
import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { GetAllIngredientPurchasesTypeResponse, GetAllIngredienTransactionsResponse, Ingredient } from "@/types/ingredients"
import { Badge } from "@/components/ui/badge"
import { FormInput } from "@/components/form/FormInput"
import { UseFormReturn } from "react-hook-form"

export const getColumns = (setOpen: (value: number) => void) => {
  return useMemo<ColumnDef<Ingredient, any>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: "Kassa",
        meta: {
          filterVariant: 'text',
        },
      },
      {
        accessorKey: 'quantity',
        id: 'quantity',
        header: "Soni",
        cell: info => formatNumberComma(info.row.getValue("quantity")),
        meta: {
          filterVariant: 'range',
        },
      },
      {
        accessorKey: 'cost',
        id: 'cost',
        header: "Narxi",
        cell: info => formatNumberComma(info.row.getValue("cost")),
        meta: {
          filterVariant: 'range',
        },
      },
      {
        accessorKey: 'unit',
        id: 'unit',
        header: "Birligi",
        cell: ({ row }) => {
          switch (row.getValue("unit")) {
            case 'count':
              return <Badge variant={"success"}>Dona</Badge>
            case 'kg':
              return <Badge variant={"destructive"}>Kg</Badge>
            case 'gr':
              return <Badge variant={"secondary"}>Gr</Badge>
            default:
              return <></>
          }
        },
        meta: {
          filterVariant: 'select',
          options: unitOptions
        },
      },
      {
        accessorKey: 'category',
        id: 'category',
        header: "Kategoriya",
        meta: {
          filterVariant: 'select',
          options: ingredientCategoryOptions
        },
      },
      {
        accessorFn: row => format(row.created_at, "dd-MM-yyyy HH:mm:ss"),
        id: 'created_at',
        header: () => 'Yaratilingan sana',
        cell: info => info.getValue(),
        meta: {
          filterVariant: 'date_range',
        },
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

export const createPurchaseColumns = (form: UseFormReturn<any>) => {
  return useMemo<ColumnDef<Ingredient, any>[]>(
    () => [
      {
        accessorFn: row => row.name,
        id: 'name',
        header: "Siryo",
        meta: {
          filterVariant: 'text',
        },
      },
      {
        id: 'quantity',
        header: () => 'Miqdori',
        cell: info => {
          return (
            <FormInput
              name={`ingredients.${info.row.index}.quantity`}
              type="number"
              control={form.control}
            />
          )
        },
      },
      {
        id: 'cost_per_unit',
        header: () => 'Narxi',
        cell: info => {
          return (
            <FormInput
              name={`ingredients.${info.row.index}.cost_per_unit`}
              type="number"
              control={form.control}
            />
          )
        },
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
        accessorKey: 'total_cost',
        id: 'total_cost',
        header: "Narxi",
        cell: info => formatNumberComma(info.row.getValue("total_cost")),
      },
    ],
    []
  )
}

export const createIngredientTransactionColumns = (form: UseFormReturn<any>) => {
  return useMemo<ColumnDef<Ingredient, any>[]>(
    () => [
      {
        accessorKey: 'name',
        id: 'name',
        header: "Siryo",
      },
      {
        accessorKey: 'quantity',
        id: 'quantity',
        header: "Qolgan Miqdori",
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
        id: 'new_quantity',
        header: () => 'Miqdori',
        cell: info => {
          return (
            <FormInput
              name={`ingredients.${info.row.index}.quantity`}
              type="number"
              control={form.control}
            />
          )
        },
      },
    ],
    []
  )
}

export const ingredientTransactionColumns = () => {
  return useMemo<ColumnDef<GetAllIngredienTransactionsResponse["data"]["0"], any>[]>(
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
      }
    ],
    []
  )
}