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
import useBonuses from "@/hooks/useBonuses"
import AddBonus from "@/features/Bonus/add-bonus"
import EditBonus from "@/features/Bonus/edit-bonus"
import { Bonus } from '@/types/bonuses'

const Bonuses = () => {
  const [open, setOpen] = useState<number | undefined>(undefined)
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [editBonus, setEditBonus] = useState<Bonus | undefined>(undefined)

  const { getAllBonusesQuery, deleteBonusMutation } = useBonuses()

  const { data, isLoading, isError } = getAllBonusesQuery()
  const deleteBonus = deleteBonusMutation(open)

  const handleDelete = async () => {
    await deleteBonus.mutateAsync().then(() => {
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
              <CardTitle>Bonuslar</CardTitle>
              <CardDescription>
                Bonuslarni bu yerdan boshqaring.
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
                  <TableHead>Bonusdan oldingi balans</TableHead>
                  <TableHead>Bonusdan keyingi balans</TableHead>
                  <TableHead>To'lov turi</TableHead>
                  <TableHead className="hidden md:table-cell">Yaratilingan Sana</TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((bonus, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {bonus.man ? bonus.man.name : bonus.woman ? bonus.woman.name : ''}
                    </TableCell>
                    <TableCell>
                      {formatNumberComma(bonus.amount)}
                    </TableCell>
                    <TableCell>
                      {formatNumberComma(bonus.balance_before)}
                    </TableCell>
                    <TableCell>
                      {formatNumberComma(bonus.balance_after)}
                    </TableCell>
                    <TableCell>
                      {bonus.method === "cash" ? "Naqd pul" : bonus.method === "card" ? "Karta" : ""}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(bonus.created_at, "dd-MM-yyyy HH:mm")}
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
                            onClick={() => setEditBonus(bonus)}
                          >
                            O'zgartirish
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="focus:bg-red-100 focus:text-red-800" 
                            onClick={() => setOpen(bonus.id)}
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
                <DialogTitle>Siz ushbu bonusni o'chirmoqchimisiz?</DialogTitle>
                <DialogDescription>
                  Bonusni o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button disabled={deleteBonus.isPending} variant={"destructive"} onClick={handleDelete}>O'chirish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card >
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddBonus open={openSheet} setOpen={setOpenSheet} />
      <EditBonus 
        open={editBonus !== undefined} 
        setOpen={() => setEditBonus(undefined)} 
        bonus={editBonus} 
      />
    </>
  )
}

export default Bonuses