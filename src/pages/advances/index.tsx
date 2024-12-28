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
import useAdvances from "@/hooks/useAdvances"
import AddAdvance from "@/features/Advance/add-advance"
import EditAdvance from "@/features/Advance/edit-advance"
import { Advance } from '@/types/advances'

const Advances = () => {
  const [open, setOpen] = useState<number | undefined>(undefined)
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [editAdvance, setEditAdvance] = useState<Advance | undefined>(undefined)

  const { getAllAdvancesQuery, deleteAdvanceMutation } = useAdvances()

  const { data, isLoading, isError } = getAllAdvancesQuery()
  const deleteAdvance = deleteAdvanceMutation(open)

  const handleDelete = async () => {
    await deleteAdvance.mutateAsync().then(() => {
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
              <CardTitle>Avanslar</CardTitle>
              <CardDescription>
                Avanslarni bu yerdan boshqaring.
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
                  <TableHead>Avansdan oldingi balans</TableHead>
                  <TableHead>Avansdan keyingi balans</TableHead>
                  <TableHead>To'lov turi</TableHead>
                  <TableHead className="hidden md:table-cell">Yaratilingan Sana</TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((advance, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {advance.man ? advance.man.name : advance.woman ? advance.woman.name : ''}
                    </TableCell>
                    <TableCell>
                      {formatNumberComma(advance.amount)}
                    </TableCell>
                    <TableCell>
                      {formatNumberComma(advance.balance_before)}
                    </TableCell>
                    <TableCell>
                      {formatNumberComma(advance.balance_after)}
                    </TableCell>
                    <TableCell>
                      {advance.method === "cash" ? "Naqd pul" : advance.method === "card" ? "Karta" : ""}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(advance.created_at, "dd-MM-yyyy HH:mm")}
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
                            onClick={() => setEditAdvance(advance)}
                          >
                            O'zgartirish
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="focus:bg-red-100 focus:text-red-800" 
                            onClick={() => setOpen(advance.id)}
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
                <DialogTitle>Siz ushbu avansni o'chirmoqchimisiz?</DialogTitle>
                <DialogDescription>
                  Avansni o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button disabled={deleteAdvance.isPending} variant={"destructive"} onClick={handleDelete}>O'chirish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card >
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddAdvance open={openSheet} setOpen={setOpenSheet} />
      <EditAdvance 
        open={editAdvance !== undefined} 
        setOpen={() => setEditAdvance(undefined)} 
        advance={editAdvance} 
      />
    </>
  )
}

export default Advances