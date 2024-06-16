import { FormInput } from '@/components/form/FormInput'
import { FormMultiSelect } from '@/components/form/FormMultiSelect'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { toast } from '@/components/ui/use-toast'
import { permissionOptions } from '@/constants/options'
import useUsers from '@/hooks/useUsers'
import { userSchema } from '@/schema/users'
import { UserType } from '@/types/users'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

interface AddUserProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const AddUser: React.FC<AddUserProps> = ({ open, setOpen }) => {
  const { createUserMutation } = useUsers()

  const createUser = createUserMutation()

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
      setOpen(false)
      form.reset()
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
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
                  <FormInput
                    control={form.control}
                    name='user_name'
                    label='Username'
                    className='mx-1'
                  />
                  <FormInput
                    control={form.control}
                    name='password'
                    label='Parol'
                    className='mx-1'
                    type='password'
                  />
                  <FormInput
                    control={form.control}
                    name='password_again'
                    label='Parolni takrorlang'
                    className='mx-1'
                    type='password'
                  />
                  <FormMultiSelect
                    name='permissions'
                    label='Ruxsatlar'
                    className='mx-1'
                    control={form.control}
                    options={permissionOptions}
                    defaultValues={form.getValues().permissions}
                    handleChange={(value: string[]) => form.setValue('permissions', value)}
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
  )
}

export default AddUser