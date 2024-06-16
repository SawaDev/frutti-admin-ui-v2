import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import React from "react"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChevronLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { GetSingleUserResponse, UserType } from "@/types/users"
import { userSchema } from "@/schema/users"
import useUsers from "@/hooks/useUsers"
import { permissionOptions } from "@/constants/options"
import MultiSelect from "@/components/ui/multi-select"
import { toast } from "@/components/ui/use-toast"
import { FormInput } from "@/components/form/FormInput"

interface UserDetailsProps {
  data: GetSingleUserResponse["data"]
}

export const UserDetails: React.FC<UserDetailsProps> = ({ data }) => {
  const params = useParams()
  const { updateUserMutation } = useUsers()

  const updateUser = updateUserMutation(params.id)
  const navigate = useNavigate()

  const formDefaults = {
    user_name: data.user_name || "",
    permissions: data.permissions || [],
    created_at: data.created_at ?? "",
  };

  const form = useForm<UserType>({
    resolver: zodResolver(userSchema),
    defaultValues: formDefaults
  })
  
  const onSubmit = async (values: UserType) => {
    if (values.password !== values.password_again) {
      return toast({
        variant: "destructive",
        description: "Parollar mos emas!",
      })
    }

    const { password_again, ...others } = values
    await updateUser.mutateAsync(others)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <Button onClick={() => navigate(-1)} variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Foydalanuvchi Ma'lumotlari
              </h1>
            </div>
            <Button
              disabled={form.formState.isLoading || !form.formState.isDirty || updateUser.isPending}
              type="submit"
              size="sm"
            >
              Saqlash
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Foydalanuvchi haqida</CardTitle>
                  <CardDescription>
                    Bu yerda siz ushbu foydalanuvchi haqidagi asosiy ma'lumotlarni o'zgartirishingiz mumkin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-5">
                    <FormField
                      control={form.control}
                      name={`user_name`}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                      <FormInput
                        type="password"
                        control={form.control}
                        name="password_again"
                        label="Parolni takrorlang"
                        className="mx-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
              <Card x-chunk="dashboard-07-chunk-3">
                <CardHeader>
                  <CardTitle>Ruxsatlar</CardTitle>
                  <CardDescription>
                    Bu yerda ushbu foydalanuvchining ruxsatlarini o'zgartirishingiz mumkin
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    <FormField
                      control={form.control}
                      name={`permissions`}
                      render={() => (
                        <FormItem className="mx-1 min-w-[260px]">
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
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </>
  )
}