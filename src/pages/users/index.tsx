import { MoreHorizontal, PlusCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TAB_LANGUAGES } from "@/constants/tabs"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import usePosts from "@/hooks/usePosts"
import { Textarea } from "@/components/ui/textarea"
import { postSchema } from "@/schema/posts"
import { format } from "date-fns"
import { PostType } from "@/types/posts"

const Users = () => {
  const [open, setOpen] = useState<number | undefined>(undefined)
  const [openSheet, setOpenSheet] = useState<boolean>(false)

  const navigate = useNavigate()

  const { getAllPostsQuery, createPostMutation, deletePostMutation } = usePosts()

  const { data, isLoading, isError } = getAllPostsQuery()
  const createPost = createPostMutation()
  const deletePost = deletePostMutation(open)

  const form = useForm<PostType>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      published: true
    },
  })

  const onSubmit = (values: z.infer<typeof postSchema>) => {
    createPost.mutateAsync(values).then(() => {
      setOpenSheet(false)
      form.reset()
    })
  }

  const handleDelete = async () => {
    await deletePost.mutateAsync().then(() => {
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
              <CardTitle>Postlar</CardTitle>
              <CardDescription>
                Postlaringizni bu yerdan boshqaring.
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
                  <TableHead>Nomi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Ma'lumot</TableHead>
                  <TableHead className="hidden md:table-cell">Yaratilingan Sana</TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((post, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {post.name.uz}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{post.published ? "Published" : "Not Published"}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{post.description?.uz}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(post.created_at, "dd-MM-yyyy hh:mm")}
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
                          <DropdownMenuItem onClick={() => navigate(`/posts/${post.id}`)}>O'zgartirish</DropdownMenuItem>
                          <DropdownMenuItem className="focus:bg-red-100 focus:text-red-800" onClick={() => setOpen(post.id)}>O'chirish</DropdownMenuItem>
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
                <Button disabled={deletePost.isPending} variant={"destructive"} onClick={handleDelete}>Postni o'chirish</Button>
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
                <SheetTitle>Yangi mahsulot yaratish</SheetTitle>
                <SheetDescription>
                  Bu yerda siz yangi mahsulotni qo'sha olasiz
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-2 py-4">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <Tabs defaultValue="uz">
                    <TabsList className="grid w-[300px] grid-cols-3">
                      {TAB_LANGUAGES.map(language => (
                        <TabsTrigger key={language.suffix} value={language.suffix}>{language.name}</TabsTrigger>
                      ))}
                    </TabsList>
                    {TAB_LANGUAGES.map(language => (
                      <TabsContent key={language.suffix} value={language.suffix} className="grid">
                        <FormField
                          control={form.control}
                          name={`name.${language.suffix}`}
                          render={({ field }) => (
                            <FormItem className="mx-1">
                              <FormLabel>Nomi</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`description.${language.suffix}`}
                          render={({ field }) => (
                            <FormItem className="mx-1">
                              <FormLabel>Ma'lumot</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </TabsContent>
                    ))}
                  </Tabs>
                  <div className="grid grid-cols-4 grid-rows-2 mt-3 ml-2 mr-3 items-center">
                    <FormField
                      control={form.control}
                      name="published"
                      render={({ field }) => (
                        <FormItem className="col-span-3 flex items-center gap-4">
                          <FormLabel>E'lon qilish</FormLabel>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
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
                  Save changes
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