import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { TAB_LANGUAGES } from "@/constants/tabs"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { postSchema } from "@/schema/posts"
import { DetailType, GetSinglePostResponse, PostType } from "@/types/posts"
import { zodResolver } from "@hookform/resolvers/zod"
import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { MoreHorizontal, PlusCircle } from "lucide-react"
import usePosts from "@/hooks/usePosts"
import { useParams } from "react-router-dom"
import { AddDetail } from "./add-details"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { EditDetail } from "./edit-details"

interface PostDetailsProps {
  data: GetSinglePostResponse["data"]
}

export const PostDetails: React.FC<PostDetailsProps> = ({ data }) => {
  const [addSheetOpen, setAddSheetOpen] = useState(false)
  const [details, setDetails] = useState<DetailType | undefined>(undefined)
  const params = useParams()
  const { updatePostMutation } = usePosts()

  const updatePost = updatePostMutation(params.id)

  const formDefaults = {
    name: {
      uz: data.name.uz || "",
      ru: data.name.ru || "",
      en: data.name.en || "",
    },
    description: {
      uz: data.description.uz || "",
      ru: data.description.ru || "",
      en: data.description.en || "",
    },
    published: data.published ?? true,
  };

  const form = useForm<PostType>({
    resolver: zodResolver(postSchema),
    defaultValues: formDefaults
  })

  const onSubmit = async (values: PostType) => {
    await updatePost.mutateAsync(values)
  }

  return (
    <Tabs defaultValue="uz">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center ">
            <TabsList className="grid w-[400px] grid-cols-3">
              {TAB_LANGUAGES.map(language => (
                <TabsTrigger key={language.suffix} value={language.suffix}>{language.name}</TabsTrigger>
              ))}
            </TabsList>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <Button disabled={form.formState.isLoading || !form.formState.isDirty || updatePost.isPending} type="submit" size="sm">Saqlash</Button>
            </div>
          </div>
          {TAB_LANGUAGES.map(language => (
            <TabsContent key={language.suffix} value={language.suffix} className="grid gap-4 lg:gap-8">
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
                  <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                    <Card>
                      <CardHeader>
                        <CardTitle>Post haqida</CardTitle>
                        <CardDescription>
                          Bu yerda siz ushbu post haqidagi asosiy ma'lumotlarni o'zgartirishingiz mumkin
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <div className="grid gap-3">
                            <FormField
                              control={form.control}
                              name={`name.${language.suffix}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Nomi</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid gap-3">
                            <FormField
                              control={form.control}
                              name={`description.${language.suffix}`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Ma'lumot</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                    <Card x-chunk="dashboard-07-chunk-3">
                      <CardHeader>
                        <CardTitle>Post Holati</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-6">
                          <FormField
                            control={form.control}
                            name="published"
                            render={({ field }) => (
                              <FormItem className="flex items-center gap-4">
                                <FormLabel>E'lon qilinganmi</FormLabel>
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
                      </CardContent>
                    </Card>
                  </div>
                </div>
                <Card x-chunk="dashboard-07-chunk-1">
                  <CardHeader>
                    <CardTitle>To'ldiruvchi Postlar</CardTitle>
                    <CardDescription>
                      Bu yerda siz to'ldiruvchi postlarni ko'rishingiz va o'zgartirishingiz mumkin
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-20">Rasm</TableHead>
                          <TableHead className="w-[160px]">Nomi</TableHead>
                          <TableHead className="w-[140px]">Og'irligi</TableHead>
                          <TableHead className="w-[140px]">Sof Og'irligi</TableHead>
                          <TableHead className="w-[140px]">Umumiy Og'irligi</TableHead>
                          <TableHead className="w-[140px]">Saqlash Muddati</TableHead>
                          <TableHead className="w-[140px]">Hajmi</TableHead>
                          <TableHead className="w-[100px]">E'lon qilinganmi</TableHead>
                          <TableHead>
                            <span className="sr-only">Harakatlar</span>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.details.map((detail, index) => (
                          <TableRow key={index}>
                            <TableCell className="font-semibold">
                              {detail.image ? (
                                <div className="w-8 h-8">
                                  <img className="w-full h-full object-contain rounded-full bg-gray-100" src={detail.image} alt="img" />
                                </div>
                              ) : '-'}
                            </TableCell>
                            <TableCell>
                              {detail.name ? detail.name[language.suffix] : '-'}
                            </TableCell>
                            <TableCell>
                              {detail.mass ?? '-'}
                            </TableCell>
                            <TableCell>
                              {detail.pure_mass ?? '-'}
                            </TableCell>
                            <TableCell>
                              {detail.total_mass ?? '-'}
                            </TableCell>
                            <TableCell>
                              {detail.expiration_date ? `${detail.expiration_date / 12} oy` : '-'}
                            </TableCell>
                            <TableCell>
                              {detail.volume ?? '-'}
                            </TableCell>
                            <TableCell>
                              <Switch checked={detail.published} />
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
                                  <DropdownMenuItem onClick={() => setDetails(detail)}>O'zgartirish</DropdownMenuItem>
                                  <DropdownMenuItem className="focus:bg-red-100 focus:text-red-800">O'chirish</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                  <CardFooter className="justify-center border-t p-4">
                    <Button onClick={(e) => {
                      e.preventDefault();
                      setAddSheetOpen(true)
                    }} size="sm" variant="ghost" className="gap-1">
                      <PlusCircle className="h-3.5 w-3.5" />
                      Qo'shish
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          ))}
        </form>
      </Form>
      <Sheet onOpenChange={setAddSheetOpen} open={addSheetOpen}>
        <SheetContent>
          <AddDetail setOpen={setAddSheetOpen} id={params.id} />
        </SheetContent>
      </Sheet>
      {details && (
        <Sheet onOpenChange={() => setDetails(undefined)} open={details ? true : false}>
          <SheetContent>
            <EditDetail setOpen={setDetails} id={params.id} details={details} />
          </SheetContent>
        </Sheet>
      )}
    </Tabs>
  )
}