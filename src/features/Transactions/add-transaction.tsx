import { FormInput } from '@/components/form/FormInput'
import { FormSelect } from '@/components/form/FormSelect'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { transactionOptions } from '@/constants/options'
import useClients from '@/hooks/useClients'
import useTransactions from '@/hooks/useTransactions'
import useWallets from '@/hooks/useWallets'
import { transactionSchema } from '@/schema/transactions'
import { SheetType } from '@/types/other'
import { TransactionType } from '@/types/transactions'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

const AddTransaction: React.FC<SheetType> = ({ open, setOpen }) => {
  const { createTransactionMutation } = useTransactions()
  const { getAllWalletsQuery } = useWallets()
  const { getAllClientsQuery } = useClients()

  const createTransaction = createTransactionMutation()

  const { data: wallets, isLoading: loadingWallets } = getAllWalletsQuery()
  const { data: clients, isLoading: loadingClients } = getAllClientsQuery()

  const form = useForm<TransactionType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "cash"
    }
  })

  const onSubmit = (values: TransactionType) => {
    const data = {
      ...values,
      wallet_id: Number(values.wallet_id),
      ...(values.client_id ? { client_id: +values.client_id } : { client_id: null })
    }

    createTransaction.mutateAsync(data).then(() => {
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
              <SheetTitle>Yangi pul o'tkazmasini yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi pul o'tkazmasini qo'sha olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-rows-1 gap-3 mt-3 ml-2 mr-3 items-center">
                  {!loadingWallets && (
                    <FormSelect
                      control={form.control}
                      name='wallet_id'
                      options={wallets?.data.map(wallet => ({ value: wallet.id.toString(), label: wallet.name }))}
                      label='Kassa'
                    />
                  )}
                  {!loadingClients && (
                    <FormSelect
                      control={form.control}
                      name='client_id'
                      options={clients?.data.map(client => ({ value: client.id.toString(), label: client.name }))}
                      label='Haridor'
                    />
                  )}
                  <FormInput
                    control={form.control}
                    name="amount"
                    type='number'
                    label="Miqdor"
                  />
                  <FormSelect
                    control={form.control}
                    name='type'
                    options={transactionOptions}
                    label={"To'lov turi"}
                  />
                </div>
              </ScrollArea>
            </div>
            <SheetFooter>
              <Button
                disabled={!form.formState.isDirty || form.formState.isLoading}
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

export default AddTransaction