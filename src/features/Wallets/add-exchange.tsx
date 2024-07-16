import { FormInput } from '@/components/form/FormInput'
import { FormSelect } from '@/components/form/FormSelect'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import useExchanges from '@/hooks/useExchanges'
import useWallets from '@/hooks/useWallets'
import { createExchangeSchema } from '@/schema/wallets'
import { useCurrencyStore } from '@/store/currency'
import { SheetType } from '@/types/other'
import { ExchangeType } from '@/types/wallets'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'

const AddExpense: React.FC<SheetType> = ({ open, setOpen }) => {
  const { activeCurrency } = useCurrencyStore()

  const { createExchangeMutation } = useExchanges()
  const { getAllWalletsQuery } = useWallets()

  const createExchange = createExchangeMutation()

  const { data: wallets, isLoading: loadingWallets } = getAllWalletsQuery()

  useEffect(() => {
    form.setValue('distribution', activeCurrency?.distribution)
  }, [activeCurrency])

  const form = useForm<ExchangeType>({
    resolver: zodResolver(createExchangeSchema),
    defaultValues: {
      distribution: activeCurrency?.distribution
    }
  })

  const onSubmit = (values: ExchangeType) => {
    const data = {
      ...values,
      from_wallet_id: Number(values.from_wallet_id),
      to_wallet_id: Number(values.to_wallet_id)
    }

    createExchange.mutateAsync(data).then(() => {
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
              <SheetTitle>Yangi pul transferini yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi pul transferini qo'sha olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-rows-1 gap-3 mt-3 ml-2 mr-3 items-center">
                  {!loadingWallets && (
                    <FormSelect
                      control={form.control}
                      name='from_wallet_id'
                      options={
                        wallets?.data
                          .filter(wallet => wallet.id.toString() !== form.getValues("to_wallet_id"))
                          .map(wallet => ({ value: wallet.id.toString(), label: wallet.name }))
                      }
                      label='Qaysi Hamyondan'
                    />
                  )}
                  {!loadingWallets && (
                    <FormSelect
                      control={form.control}
                      name='to_wallet_id'
                      options={
                        wallets?.data
                          .filter(wallet => wallet.id.toString() !== form.getValues("from_wallet_id"))
                          .map(wallet => ({ value: wallet.id.toString(), label: wallet.name }))
                      }
                      label='Qaysi Hamyonga'
                    />
                  )}
                  <FormInput
                    control={form.control}
                    name="amount"
                    type='number'
                    label="Miqdor"
                  />
                  <FormInput
                    control={form.control}
                    name='distribution'
                    type='number'
                    label='Kurs'
                  />
                  <FormInput
                    control={form.control}
                    name='comment'
                    label={"Kommentariya"}
                  />
                </div>
              </ScrollArea>
            </div>
            <SheetFooter>
              <Button
                disabled={!form.formState.isDirty || form.formState.isLoading || createExchange.isPending}
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

export default AddExpense