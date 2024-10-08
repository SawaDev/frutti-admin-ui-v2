import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import useClients from '@/hooks/useClients'
import { FormInput } from '@/components/form/FormInput'
import { FormSelect } from '@/components/form/FormSelect'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { currencyOptions } from '@/constants/options'
import { createClientSchema } from '@/schema/clients'
import { ClientType } from '@/types/clients'

interface AddClientProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const AddClient: React.FC<AddClientProps> = ({ open, setOpen }) => {
  const { createClientMutation } = useClients()

  const createClient = createClientMutation()

  const form = useForm<ClientType>({
    resolver: zodResolver(createClientSchema),
    defaultValues: {
      currency: "SUM"
    }
  })

  const onSubmit = (values: ClientType) => {
    createClient.mutateAsync(values).then(() => {
      setOpen(false)
    })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Yangi klientni yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi klientni qo'sha olasiz
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
                  <FormSelect
                    control={form.control}
                    name='currency'
                    label='Pul birligi'
                    className='mx-1'
                    options={currencyOptions}
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

export default AddClient