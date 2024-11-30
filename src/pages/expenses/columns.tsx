import { ColumnDef } from "@tanstack/react-table";

import { Expense } from "@/types/expenses";
import { format } from "date-fns";
import { formatNumberComma } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import useExpenses from "@/hooks/useExpenses";

export const getColumns = (
  setDeleteExpenseId: (value: number) => void,
  setEditExpenseId: (value: Expense) => void,
) => {
  const { getAllExpenseCategoriesQuery } = useExpenses();

  const { data: categories } = getAllExpenseCategoriesQuery();

  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "amount",
      header: "Miqdori",
      cell: ({ row }) => <>{formatNumberComma(row.getValue("amount"))}</>,
    },
    {
      accessorKey: "expense_category.name",
      header: () => <span className="hidden md:table-cell">Kategoriya</span>,
      cell: ({ row }) => {
        const category = categories?.data
          .map((c) => ({ value: c.id, label: c.name }))
          .find((c) => c.value === row.original.expense_category?.id);

        if (!category) {
          return null;
        }

        return (
          <div className="flex w-[100px] items-center">
            <span>{category.label}</span>
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "created_at",
      header: () => <span>Yaratilingan Sana</span>,
      cell: ({ row }) => (
        <>{format(row.getValue("created_at"), "dd-MM-yyyy hh:mm")}</>
      ),
    },
    {
      accessorKey: "wallet.name",
      header: () => <span>Kassa</span>,
    },
    {
      accessorKey: "comment",
      header: () => <span>Kommentariya</span>,
    },
    {
      accessorKey: "actions",
      header: () => <span className="sr-only">Harakatlar</span>,
      cell: ({ row }) => (
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
              className="focus:bg-blue-100 focus:text-blue-800"
              onClick={() => setEditExpenseId(row.original)}
            >
              O'zgartirish
            </DropdownMenuItem>
            <DropdownMenuItem
              className="focus:bg-red-100 focus:text-red-800"
              onClick={() => setDeleteExpenseId(Number(row.original.id))}
            >
              O'chirish
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return columns;
};
