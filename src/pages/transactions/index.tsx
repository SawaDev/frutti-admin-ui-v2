import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
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
import useTransactions from "@/hooks/useTransactions"
import { formatNumberComma } from "@/lib/utils"
import AddTransaction from "@/features/Transactions/add-transaction"

const Transactions = () => {
  const [open, setOpen] = useState<number | undefined>(undefined)
  const [openSheet, setOpenSheet] = useState<boolean>(false)

  const { getAllTransactionsQuery, deleteTransactionMutation } = useTransactions()

  const { data, isLoading, isError } = getAllTransactionsQuery()
  const deleteTransaction = deleteTransactionMutation(open)

  const handleDelete = async () => {
    await deleteTransaction.mutateAsync().then(() => {
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
              <CardTitle>Pul o'tkazmalari</CardTitle>
              <CardDescription>
                Pul o'tkazmalarini bu yerdan boshqaring.
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
                  <TableHead>Haridor</TableHead>
                  <TableHead>Turi</TableHead>
                  <TableHead className="hidden md:table-cell">Yaratilingan Sana</TableHead>
                  <TableHead>Hamyon</TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {formatNumberComma(transaction.amount)}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.client?.name}
                    </TableCell>
                    <TableCell>
                      <Badge variant={transaction.type === "cash" ? "success" : "secondary"}>
                        {transaction.type === "cash" ? "Naqd" : "Karta"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(transaction.created_at, "dd-MM-yyyy hh:mm")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {transaction.wallet.name}
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
                          {/* <DropdownMenuItem onClick={() => navigate(`/transactions/${transaction.id}`)}>O'zgartirish</DropdownMenuItem> */}
                          <DropdownMenuItem className="focus:bg-red-100 focus:text-red-800" onClick={() => setOpen(transaction.id)}>O'chirish</DropdownMenuItem>
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
                <Button disabled={deleteTransaction.isPending} variant={"destructive"} onClick={handleDelete}>O'chirish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card >
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddTransaction open={openSheet} setOpen={setOpenSheet} />
    </>
  )
}

export default Transactions