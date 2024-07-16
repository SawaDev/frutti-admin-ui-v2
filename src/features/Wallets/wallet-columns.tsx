import { Badge } from "@/components/ui/badge";
import { Exchange } from "@/types/wallets";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import React from "react";

const columns = (id: number) => {
  return React.useMemo<ColumnDef<Exchange, any>[]>(
    () => [
      {
        accessorFn: row => {
          if (row.from_wallet?.id === id) {
            return row.to_wallet?.name
          } else {
            return row.from_wallet?.name
          }
        },
        id: 'name',
        header: "Kassa",
        meta: {
          filterVariant: 'text',
        },
      },
      {
        accessorFn: row => {
          if (row.from_wallet?.id === id) return "O'tkazilgan"
          else return "Olingan"
        },
        id: 'type',
        header: "Transfer",
        cell: info => {
          if (info.getValue() === "O'tkazilgan") {
            return (
              <Badge variant={"destructive"}>
                {info.getValue()}
              </Badge>
            )
          } else {
            return (
              <Badge variant={"success"}>
                Olingan
              </Badge>
            )
          }
        },
        meta: {
          filterVariant: 'select',
          options: [{ label: "O'tkazilgan", value: "o'tkazilgan" }, { label: "Olingan", value: "olingan" }]
        },
      },
      {
        accessorFn: row => {
          if (row.from_wallet?.type === "dollar") {
            return `$ ${row.amount}`
          } else {
            return row.amount
          }
        },
        id: 'amount',
        header: () => 'Summa',
        cell: info => info.getValue(),
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
        accessorKey: 'distribution',
        header: () => "Kurs",
        meta: {
          filterVariant: 'range',
        },
      },
      {
        accessorKey: 'comment',
        header: 'Komment',
        meta: {
          filterVariant: 'text',
        },
      },
    ],
    []
  )
}

export default columns