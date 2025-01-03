import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { FormInput } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { createProviderSchema } from '@/schema/providers'
import { SheetType } from '@/types/other'
import { CreateProviderType } from '@/types/providers'
import useProviders from '@/hooks/useProviders'
import { FormSelect } from '@/components/form/FormSelect'
import { currencyOptions } from '@/constants/options'
import { Provider } from '@/types/providers'

interface AddProviderProps extends SheetType {
  provider?: Provider
}

const AddProvider: React.FC<AddProviderProps> = ({ open, setOpen, provider }) => {
  const { createProviderMutation, updateProviderMutation } = useProviders()

  const createProvider = createProviderMutation()
  const updateProvider = updateProviderMutation(provider?.id)

  const form = useForm<CreateProviderType>({
    resolver: zodResolver(createProviderSchema),
    defaultValues: {
      name: provider?.name || '',
      balance: provider?.balance || 0,
      currency: provider?.currency || "SUM"
    }
  })

  // Reset form when provider prop changes
  React.useEffect(() => {
    if (provider) {
      form.reset({
        name: provider.name,
        balance: provider.balance,
        currency: provider.currency ?? "SUM"
      })
    }
  }, [provider, form])

  const onSubmit = (values: CreateProviderType) => {
    const mutation = provider 
      ? updateProvider.mutateAsync(values)
      : createProvider.mutateAsync(values)

    mutation.then(() => {
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
              <SheetTitle>
                {provider ? "Yetkazib beruvchini tahrirlash" : "Yangi yetkazib beruvchini yaratish"}
              </SheetTitle>
              <SheetDescription>
                {provider 
                  ? "Bu yerda siz yetkazib beruvchini tahrirlashingiz mumkin"
                  : "Bu yerda siz yangi yetkazib beruvchini qo'sha olasiz"
                }
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-rows-1 gap-3 mt-3 ml-2 mr-3 items-center">
                  <FormInput
                    control={form.control}
                    name='name'
                    label='Ismi'
                    placeholder='Ismi'
                    className='mx-1'
                  />
                  <FormInput
                    control={form.control}
                    name='balance'
                    label='Balans'
                    placeholder='Balans'
                    className='mx-1'
                    type='number'
                    step={0.01}
                  />
                  <FormSelect
                    control={form.control}
                    name='currency'
                    label='Pul birligi'
                    placeholder='Pul birligi'
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

export default AddProvider