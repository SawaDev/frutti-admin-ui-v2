import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
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
import useUsers from "@/hooks/useUsers"
import { format } from "date-fns"
import AddUser from "@/features/Users/add-user"
import { permissionOptions } from "@/constants/options"

const Users = () => {
  const [open, setOpen] = useState<number | undefined>(undefined)
  const [openSheet, setOpenSheet] = useState<boolean>(false)

  const navigate = useNavigate()

  const { getAllUsersQuery, deleteUserMutation } = useUsers()

  const { data, isLoading, isError } = getAllUsersQuery()
  const deleteUser = deleteUserMutation(open)

  const handleDelete = async () => {
    await deleteUser.mutateAsync().then(() => {
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
              <CardTitle>Foydalanuvchilar</CardTitle>
              <CardDescription>
                Foydalanuchilarni bu yerdan boshqaring.
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
                  <TableHead>Username</TableHead>
                  <TableHead>Ruxsatlar</TableHead>
                  <TableHead className="hidden md:table-cell">Yaratilingan Sana</TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((user, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {user.user_name}
                    </TableCell>
                    <TableCell>
                      {user.permissions.map(permission => (
                        <Badge key={permission} variant="outline">
                          {permissionOptions.find(p => p.value === permission)?.label}
                        </Badge>
                      ))}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(user.created_at, "dd-MM-yyyy HH:mm")}
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
                          <DropdownMenuItem onClick={() => navigate(`/users/${user.id}`)}>O'zgartirish</DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-red-100 focus:text-red-800" onClick={() => setOpen(user.id)}>O'chirish</DropdownMenuItem>
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
                <Button disabled={deleteUser.isPending} variant={"destructive"} onClick={handleDelete}>O'chirish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card >
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddUser open={openSheet} setOpen={setOpenSheet} />
    </>
  )
}

export default Users