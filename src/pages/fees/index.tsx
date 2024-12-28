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
import useFees from "@/hooks/useFees"
import AddFee from "@/features/Fees/add-fee"
import { Fee } from '@/types/fees'
import EditFee from "@/features/Fees/edit-fee"

const Fees = () => {
  const [open, setOpen] = useState<number | undefined>(undefined)
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [editFee, setEditFee] = useState<Fee | undefined>(undefined)

  const { getAllFeesQuery, deleteFeeMutation } = useFees()

  const { data, isLoading, isError } = getAllFeesQuery()
  const deleteFee = deleteFeeMutation(open)

  const handleDelete = async () => {
    await deleteFee.mutateAsync().then(() => {
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
              <CardTitle>Jarimalar</CardTitle>
              <CardDescription>
                Jarimalarni bu yerdan boshqaring.
              </CardDescription>
            </div>
            <div className="space-x-2">
              <Button
                onClick={() => setOpenSheet(true)}
                size="sm"
                variant="outline"
                className="gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Qo'shish
              </Button>
            </div>
          </CardHeader >
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ismi</TableHead>
                  <TableHead>Summa</TableHead>
                  <TableHead>Jarimadan oldingi balans</TableHead>
                  <TableHead>Jarimadan keyingi balans</TableHead>
                  <TableHead className="hidden md:table-cell">Yaratilingan Sana</TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((fee, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {fee.man ? fee.man.name : fee.woman ? fee.woman.name : ''}
                    </TableCell>
                    <TableCell>
                      {formatNumberComma(fee.amount)}
                    </TableCell>
                    <TableCell>
                      {formatNumberComma(fee.balance_before)}
                    </TableCell>
                    <TableCell>
                      {formatNumberComma(fee.balance_after)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(fee.created_at, "dd-MM-yyyy HH:mm")}
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
                          <DropdownMenuItem 
                            className="focus:bg-blue-100 focus:text-blue-800" 
                            onClick={() => setEditFee(fee)}
                          >
                            O'zgartirish
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="focus:bg-red-100 focus:text-red-800" 
                            onClick={() => setOpen(fee.id)}
                          >
                            O'chirish
                          </DropdownMenuItem>
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
                <DialogTitle>Siz ushbu jarimani o'chirmoqchimisiz?</DialogTitle>
                <DialogDescription>
                  Jarimani o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button disabled={deleteFee.isPending} variant={"destructive"} onClick={handleDelete}>O'chirish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card >
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddFee open={openSheet} setOpen={setOpenSheet} />
      <EditFee 
        open={editFee !== undefined} 
        setOpen={() => setEditFee(undefined)} 
        fee={editFee} 
      />
    </>
  )
}

export default Fees