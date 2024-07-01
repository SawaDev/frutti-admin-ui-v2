import { PlusCircle } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import NoItems from '@/features/NoItems'
import useExpenses from "@/hooks/useExpenses"
import AddExpense from "@/features/Expenses/add-expense"
import { getColumns } from "./columns"
// import { Popover, PopoverTrigger } from "@/components/ui/popover"

const Expenses = () => {
  const [open, setOpen] = useState<number | undefined>(undefined)
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )

  const { getAllExpensesQuery, deleteExpenseMutation } = useExpenses()

  const { data, isLoading, isError } = getAllExpensesQuery()
  const deleteExpense = deleteExpenseMutation(open)

  const handleDelete = async () => {
    await deleteExpense.mutateAsync().then(() => {
      setOpen(undefined)
    })
  }

  const table = useReactTable({
    data: data?.data ?? [],
    columns: getColumns(setOpen),
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isLoading) {
    return <>Loading...</>
  }

  if (isError) {
    return <>Error</>
  }

  return (
    <>
      {data?.data.length ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Harajatlar</CardTitle>
              <CardDescription>
                Harajatlarni bu yerdan boshqaring.
              </CardDescription>
            </div>
            <div>
              <Button onClick={() => setOpenSheet(true)} size="sm" variant="ghost" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                Qo'shish
              </Button>
            </div>
          </CardHeader >
          <CardContent>
            {/* <div>
              <Popover>
                <PopoverTrigger>
                  <Button>
                    Kategoriya
                  </Button>
                </PopoverTrigger>

              </Popover>

            </div> */}
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
                {/* <TableRow>
                  <TableHead>Miqdori</TableHead>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead className="hidden md:table-cell">Yaratilingan Sana</TableHead>
                  <TableHead>Hamyon</TableHead>
                  <TableHead className="w-[300px]">Kommentariya</TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow> */}
              </TableHeader>
              <TableBody>
                {/* {data.data.map((expense, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {formatNumberComma(expense.amount)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {expense.expense_category?.name}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(expense.created_at, "dd-MM-yyyy hh:mm")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {expense.wallet.name}
                    </TableCell>
                    <TableCell>
                      {expense.comment}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
                          <DropdownMenuItem className="focus:bg-red-100 focus:text-red-800" onClick={() => setOpen(expense.id)}>O'chirish</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))} */}
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
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
                      colSpan={getColumns(setOpen).length}
                      className="h-24 text-center"
                    >
                      Hech narsa yo'q.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
          <Dialog open={open !== undefined ? true : false} onOpenChange={() => setOpen(undefined)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Siz ushbu harajatni o'chirmoqchimisiz?</DialogTitle>
                <DialogDescription>
                  Harajatni o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button disabled={deleteExpense.isPending} variant={"destructive"} onClick={handleDelete}>O'chirish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card >
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddExpense open={openSheet} setOpen={setOpenSheet} />
    </>
  )
}

export default Expenses