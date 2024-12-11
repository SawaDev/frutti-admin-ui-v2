import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { createFeeSchema } from '@/schema/fees'
import { SheetType } from '@/types/other'
import { CreateFeeType } from '@/types/fees'
import useWomen from '@/hooks/useWomen'
import useMen from '@/hooks/useMen'
import { FormSelect } from '@/components/form/FormSelect'
import { FormTextarea } from '@/components/form/FormTextarea'
import { FormInput } from '@/components/form/FormInput'
import useFees from '@/hooks/useFees'


const AddFee: React.FC<SheetType> = ({ open, setOpen }) => {
  const { createFeeMutation } = useFees()
  const { getAllWomenQuery } = useWomen()
  const { getAllMenQuery } = useMen()

  const { data: men, isLoading: loadingMen } = getAllMenQuery({})
  const { data: women, isLoading: loadingWomen } = getAllWomenQuery()

  const createFee = createFeeMutation()

  const form = useForm<CreateFeeType>({
    resolver: zodResolver(createFeeSchema),
    defaultValues: {}
  })

  const onSubmit = (values: CreateFeeType) => {
    createFee.mutateAsync(values).then(() => {
      form.reset()
      setOpen(false)
    })
  }

  if (loadingMen || loadingWomen) {
    return "Loading"
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Yangi jarimani yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi jarimani qo'sha olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-rows-1 gap-3 mt-3 ml-2 mr-3 items-center">
                  <FormSelect
                    control={form.control}
                    name='man_id'
                    label='Erkaklar'
                    placeholder='Erkaklar'
                    disabled={!!form.getValues("woman_id")}
                    options={men ? men?.data.map((item) => ({ label: item.name, value: item.id.toString() })) : []}
                  />
                  <FormSelect
                    control={form.control}
                    name='woman_id'
                    label='Ayollar'
                    placeholder='Ayollar'
                    disabled={!!form.getValues("man_id")}
                    options={women ? women?.data.map((item) => ({ label: item.name, value: item.id.toString() })) : []}
                  />
                  <FormInput
                    control={form.control}
                    name='amount'
                    label="Summa"
                    placeholder="Summa"
                    type='number'
                    className='mx-1'
                  />
                  <FormTextarea
                    control={form.control}
                    name='comment'
                    label="Kommentariya"
                    placeholder="Kommentariya"
                    className='mx-1'
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

export default AddFee