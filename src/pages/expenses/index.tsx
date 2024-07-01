import { MoreHorizontal, PlusCircle } from "lucide-react"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import NoItems from '@/features/NoItems'
import { format } from "date-fns"
import { formatNumberComma } from "@/lib/utils"
import useExpenses from "@/hooks/useExpenses"
import AddExpense from "@/features/Expenses/add-expense"

const Expenses = () => {
  const [open, setOpen] = useState<number | undefined>(undefined)
  const [openSheet, setOpenSheet] = useState<boolean>(false)

  const { getAllExpensesQuery, deleteExpenseMutation } = useExpenses()

  const { data, isLoading, isError } = getAllExpensesQuery()
  const deleteExpense = deleteExpenseMutation(open)

  const handleDelete = async () => {
    await deleteExpense.mutateAsync().then(() => {
      setOpen(undefined)
    })
  }

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
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Miqdori</TableHead>
                  <TableHead>Kategoriya</TableHead>
                  <TableHead className="hidden md:table-cell">Yaratilingan Sana</TableHead>
                  <TableHead>Hamyon</TableHead>
                  <TableHead className="w-[300px]">Kommentariya</TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((expense, index) => (
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
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <Dialog open={open ? true : false} onOpenChange={() => setOpen(undefined)}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Siz ushbu foydalanuvchini o'chirmoqchimisiz?</DialogTitle>
                <DialogDescription>
                  Foydalanuvchi o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
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