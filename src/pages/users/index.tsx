import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet"

import NoItems from '@/features/NoItems'
import useUsers from "@/hooks/useUsers"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { format } from "date-fns"
import { UserType } from "@/types/users"
import { userSchema } from "@/schema/users"
import MultiSelect from "@/components/ui/multi-select"
import { permissionOptions } from "@/constants/options"
import { toast } from "@/components/ui/use-toast"

const Users = () => {
  const [open, setOpen] = useState<number | undefined>(undefined)
  const [openSheet, setOpenSheet] = useState<boolean>(false)

  const navigate = useNavigate()

  const { getAllUsersQuery, createUserMutation, deleteUserMutation } = useUsers()

  const { data, isLoading, isError } = getAllUsersQuery()
  const createUser = createUserMutation()
  const deleteUser = deleteUserMutation(open)

  const form = useForm<UserType>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      permissions: []
    }
  })

  const onSubmit = (values: UserType) => {
    if (values.password !== values.password_again) {
      return toast({
        variant: "destructive",
        description: "Parollar mos emas!",
      })
    }

    const { password_again, ...others } = values

    createUser.mutateAsync(others).then(() => {
      setOpenSheet(false)
      form.reset()
    })
  }

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
                        <Badge key={permission} variant="outline">{permission}</Badge>
                      ))}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(user.created_at, "dd-MM-yyyy hh:mm")}
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
                          <DropdownMenuItem onClick={() => navigate(`/posts/${user.id}`)}>O'zgartirish</DropdownMenuItem>
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
                <DialogTitle>Siz ushbu postni o'chirmoqchimisiz?</DialogTitle>
                <DialogDescription>
                  Post o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button disabled={deleteUser.isPending} variant={"destructive"} onClick={handleDelete}>Postni o'chirish</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card >
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SheetHeader>
                <SheetTitle>Yangi foydalanuvchini yaratish</SheetTitle>
                <SheetDescription>
                  Bu yerda siz yangi foydalanuvchini qo'sha olasiz
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-2 py-4">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <div className="grid grid-rows-1 gap-3 mt-3 ml-2 mr-3 items-center">
                    <FormField
                      control={form.control}
                      name={`user_name`}
                      render={({ field }) => (
                        <FormItem className="mx-1">
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`password`}
                      render={({ field }) => (
                        <FormItem className="mx-1">
                          <FormLabel>Parol</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`password_again`}
                      render={({ field }) => (
                        <FormItem className="mx-1">
                          <FormLabel>Parolni takrorlang</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`permissions`}
                      render={() => (
                        <FormItem className="mx-1">
                          <FormLabel>Ruxsatlar</FormLabel>
                          <FormControl>
                            <MultiSelect
                              options={permissionOptions}
                              onChange={(value: string[]) => form.setValue('permissions', value)}
                              defaultValue={form.getValues().permissions}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </ScrollArea>
              </div>
              <SheetFooter>
                <Button
                  disabled={!form.formState.isValid || !form.formState.isDirty || form.formState.isLoading}
                  type="submit"
                >
                  Saqlash
                </Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Users