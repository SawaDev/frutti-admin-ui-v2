import { useMemo } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatNumberComma } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import {
  GetAllIngredientCategories,
  GetAllIngredienTransactionsResponse,
  Ingredient,
} from "@/types/ingredients";
import { Badge } from "@/components/ui/badge";
import { FormInput } from "@/components/form/FormInput";
import { UseFormReturn } from "react-hook-form";

export const getColumns = (setOpen: (value: number) => void) => {
  return useMemo<ColumnDef<Ingredient, any>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: "Kassa",
        meta: {
          filterVariant: "text",
        },
      },
      {
        accessorKey: "quantity",
        id: "quantity",
        header: "Soni",
        cell: (info) => formatNumberComma(info.row.getValue("quantity")),
      },
      {
        accessorKey: "cost",
        id: "cost",
        header: "Narxi",
        cell: (info) => formatNumberComma(info.row.getValue("cost")),
      },
      {
        accessorKey: "unit",
        id: "unit",
        header: "Birligi",
        cell: ({ row }) => {
          switch (row.getValue("unit")) {
            case "count":
              return <Badge variant={"success"}>Dona</Badge>;
            case "kg":
              return <Badge variant={"destructive"}>Kg</Badge>;
            case "gr":
              return <Badge variant={"secondary"}>Gr</Badge>;
            default:
              return <></>;
          }
        },
      },
      {
        accessorKey: "category.name",
        id: "category.name",
        header: "Kategoriya",
      },
      {
        accessorFn: (row) => format(row.created_at, "dd-MM-yyyy HH:mm:ss"),
        id: "created_at",
        header: () => "Yaratilingan sana",
        cell: (info) => info.getValue(),
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
                onClick={() => setOpen(info.getValue())}
              >
                O'chirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );
};

export const createPurchaseColumns = () => {
  return useMemo<ColumnDef<Ingredient, any>[]>(
    () => [
      {
        id: "name",
        header: "Nomi",
      },
      {
        id: "quantity",
        header: "Qancha bor",
      },
      {
        id: "quantity_input",
        header: "Miqdori",
      },
      {
        id: "space",
        header: "Место",
      },
      {
        id: "cost_per_unit",
        header: "Yangilangan Narx",
      },
      {
        id: "shipping_price",
        header: "Yetkazib berish narxi",
      },
    ],
    [],
  );
};

export const createIngredientTransactionColumns = (
  form: UseFormReturn<any>,
) => {
  return useMemo<ColumnDef<Ingredient, any>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: "Siryo",
      },
      {
        accessorKey: "quantity",
        id: "quantity",
        header: "Qolgan Miqdori",
      },
      {
        accessorFn: (row) => {
          if (row.unit === "count") {
            return "dona";
          } else {
            return row.unit;
          }
        },
        cell: (info) => <span className="capitalize">{info.getValue()}</span>,
        id: "unit",
        header: "Turi",
      },
      {
        id: "new_quantity",
        header: () => "Miqdori",
        cell: (info) => {
          return (
            <FormInput
              name={`ingredients.${info.row.index}.quantity`}
              type="number"
              control={form.control}
            />
          );
        },
      },
    ],
    [],
  );
};

export const ingredientTransactionColumns = (
  setOpen: (value: number) => void,
) => {
  return useMemo<
    ColumnDef<GetAllIngredienTransactionsResponse["data"]["0"], any>[]
  >(
    () => [
      {
        accessorFn: (row) => format(row.created_at, "dd-MM-yyyy HH:mm:ss"),
        id: "created_at",
        header: () => "Yaratilingan sana",
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: "totals.cost",
        id: "totals.cost",
        header: "Umumiy summasi",
        cell: (info) => formatNumberComma(info.row.getValue("totals.cost")),
      },
      {
        accessorKey: "totals.count",
        id: "totals.count",
        header: "Dona hammasi",
        cell: (info) => formatNumberComma(info.row.getValue("totals.count")),
      },
      {
        accessorKey: "totals.kg",
        id: "totals.kg",
        header: "Kg hammasi",
        cell: (info) => formatNumberComma(info.row.getValue("totals.kg")),
      },
      {
        accessorKey: "totals.gr",
        id: "totals.gr",
        header: "Gr hammasi",
        cell: (info) => formatNumberComma(info.row.getValue("totals.gr")),
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
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(info.getValue());
                }}
              >
                O'chirish
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [],
  );
};

export const categoriesColumns = () => {
  return useMemo<ColumnDef<GetAllIngredientCategories["data"][0], any>[]>(
    () => [
      {
        accessorKey: "name",
        id: "name",
        header: () => "Nomi",
      },
      {
        accessorFn: (row) => row.ingredients?.length,
        id: "count_of_ingredients",
        header: "Soni",
        cell: (info) => formatNumberComma(info.getValue()),
      },
      {
        accessorKey: "totals.cost",
        id: "totals.cost",
        header: "Umumiy summasi",
        cell: (info) => formatNumberComma(info.row.getValue("totals.cost")),
      },
      {
        accessorKey: "totals.count",
        id: "totals.count",
        header: "Dona hammasi",
        cell: (info) => formatNumberComma(info.row.getValue("totals.count")),
      },
      {
        accessorKey: "totals.kg",
        id: "totals.kg",
        header: "Kg hammasi",
        cell: (info) => formatNumberComma(info.row.getValue("totals.kg")),
      },
      {
        accessorKey: "totals.gr",
        id: "totals.gr",
        header: "Gr hammasi",
        cell: (info) => formatNumberComma(info.row.getValue("totals.gr")),
      },
    ],
    [],
  );
};
