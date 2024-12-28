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
import { format } from "date-fns"
import AddClient from "@/features/Clients/add-client"
import useClients from "@/hooks/useClients"
import { formatNumberComma } from "@/lib/utils"

const Clients = () => {
  const [open, setOpen] = useState<number | undefined>(undefined)
  const [openSheet, setOpenSheet] = useState<boolean>(false)

  const navigate = useNavigate()

  const { getAllClientsQuery, deleteClientMutation } = useClients()

  const { data, isLoading, isError } = getAllClientsQuery()
  const deleteClient = deleteClientMutation(open)

  const handleDelete = async () => {
    await deleteClient.mutateAsync().then(() => {
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
              <CardTitle>Klientlar</CardTitle>
              <CardDescription>
                Klientlarni bu yerdan boshqaring.
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
                  <TableHead>Ismi</TableHead>
                  <TableHead>Balans</TableHead>
                  <TableHead>Pul birligi</TableHead>
                  <TableHead className="hidden md:table-cell">Yaratilingan Sana</TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((client, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {client.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          client.balance > 0 ? "success"
                            : client.balance == 0 ? "outline"
                              : "destructive"}
                      >
                        {formatNumberComma(client.balance)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          client.currency === "SUM" ? "outline"
                            : client.currency === "USD" ? "default"
                              : "destructive"
                        }
                      >
                        {client.currency === "SUM" ? "So'm"
                          : client.currency === "USD" ? "Dollar"
                            : ""
                        }
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(client.created_at, "dd-MM-yyyy HH:mm")}
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
                          <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>O'zgartirish</DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-red-100 focus:text-red-800" onClick={() => setOpen(client.id)}>O'chirish</DropdownMenuItem>
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
                <DialogTitle>Siz ushbu klientni o'chirmoqchimisiz?</DialogTitle>
                <DialogDescription>
                  Klient o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button disabled={deleteClient.isPending} variant={"destructive"} onClick={handleDelete}>O'chirish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card >
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddClient open={openSheet} setOpen={setOpenSheet} />
    </>
  )
}

export default Clients