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
import useProviders from "@/hooks/useProviders"
import { useNavigate } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import AddProvider from "@/features/Providers/add-provider"

const Providers = () => {
  const [open, setOpen] = useState<number | undefined>(undefined)
  const [openSheet, setOpenSheet] = useState<boolean>(false)

  const navigate = useNavigate()

  const { getAllProvidersQuery, deleteProviderMutation } = useProviders()

  const { data, isLoading, isError } = getAllProvidersQuery()
  const deleteProvider = deleteProviderMutation(open)

  const handleDelete = async () => {
    await deleteProvider.mutateAsync().then(() => {
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
              <CardTitle>Yetkazib beruvchilar</CardTitle>
              <CardDescription>
                Yetkazib beruvchilarni bu yerdan boshqaring.
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
                  <TableHead>Balans</TableHead>
                  <TableHead className="hidden md:table-cell">Yaratilingan Sana</TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((provider, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {provider.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          provider.balance > 0 ? "success"
                            : provider.balance == 0 ? "outline"
                              : "destructive"}
                      >
                        {formatNumberComma(provider.balance)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(provider.created_at, "dd-MM-yyyy HH:mm")}
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
                          <DropdownMenuItem onClick={() => navigate(`/providers/${provider.id}`)}>O'zgartirish</DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-red-100 focus:text-red-800" onClick={() => setOpen(provider.id)}>O'chirish</DropdownMenuItem>
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
                <DialogTitle>Siz ushbu yetkazib beruvchini o'chirmoqchimisiz?</DialogTitle>
                <DialogDescription>
                  Yetkazib beruvchi o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button disabled={deleteProvider.isPending} variant={"destructive"} onClick={handleDelete}>O'chirish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card >
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddProvider open={openSheet} setOpen={setOpenSheet} />
    </>
  )
}

export default Providers