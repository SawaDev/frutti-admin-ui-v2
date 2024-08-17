import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import useWomen from '@/hooks/useWomen'
import { FormInput } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { createWomanSchema } from '@/schema/woman'
import { SheetType } from '@/types/other'
import { CreateWomanType } from '@/types/woman'


const AddWoman: React.FC<SheetType> = ({ open, setOpen }) => {
  const { createWomanMutation } = useWomen()

  const createWoman = createWomanMutation()

  const form = useForm<CreateWomanType>({
    resolver: zodResolver(createWomanSchema),
    defaultValues: {}
  })

  const onSubmit = (values: CreateWomanType) => {
    createWoman.mutateAsync(values).then(() => {
      setOpen(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Yangi ayolni yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi ayolni qo'sha olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-rows-1 gap-3 mt-3 ml-2 mr-3 items-center">
                  <FormInput
                    control={form.control}
                    name='name'
                    label='Ismi'
                    className='mx-1'
                  />
                  <FormInput
                    control={form.control}
                    name='balance'
                    label='Balans'
                    className='mx-1'
                    type='number'
                    step={0.01}
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

export default AddWoman