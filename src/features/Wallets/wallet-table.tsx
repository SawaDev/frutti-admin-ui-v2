import { Skeleton } from "@/components/ui/skeleton"
import useExchanges from "@/hooks/useExchanges"
import { ColumnFiltersState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table"
import React, { useState } from "react"
import columns from "./wallet-columns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Filter from "../../components/tableFilter/table-filter"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { SearchIcon } from "lucide-react"

interface WalletTableType {
  id: string
}

const WalletTable: React.FC<WalletTableType> = ({ id }) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const { getExchangesByWalletIdQuery } = useExchanges()

  const { data: exchanges, isLoading } = getExchangesByWalletIdQuery(id)

  const table = useReactTable({
    data: exchanges?.data ?? [],
    columns: columns(Number(id)),
    filterFns: {},
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: false,
  })

  if (isLoading) {
    return <Skeleton className="w-full h-[600px]" />
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
                    {header.column.getCanFilter() ? (
                      <Popover>
                        <PopoverTrigger>
                          <SearchIcon className="w-4 h-4" />
                        </PopoverTrigger>
                        <PopoverContent>
                          <Filter column={header.column} />
                        </PopoverContent>
                      </Popover>
                    ) : null}
                  </div>
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="h-24 text-center"
            >
              Hech narsa yo'q.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  )
}

export default WalletTable