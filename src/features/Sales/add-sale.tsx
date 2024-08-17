import { FormInput } from '@/components/form/FormInput'
import { FormSelect } from '@/components/form/FormSelect'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import { Skeleton } from '@/components/ui/skeleton'
import { questionOptions } from '@/constants/options'
import useClients from '@/hooks/useClients'
import useIngredients from '@/hooks/useIngredients'
import useWallets from '@/hooks/useWallets'
import { createIngredientSchema } from '@/schema/ingredients'
import { CreateIngredient } from '@/types/ingredients'
import { zodResolver } from '@hookform/resolvers/zod'
import { FC } from 'react'
import { useForm } from 'react-hook-form'

const AddSale: FC = () => {

  const { createIngredientMutation } = useIngredients()
  const { getAllWalletsQuery } = useWallets()
  const { getAllClientsQuery } = useClients()

  const createIngredient = createIngredientMutation()

  const { data: wallets, isLoading: loadingWallets } = getAllWalletsQuery()
  const { data: clients, isLoading: loadingClients } = getAllClientsQuery()

  const form = useForm<CreateIngredient>({
    resolver: zodResolver(createIngredientSchema),
    defaultValues: {
      // is_free: "false"
    }
  })

  const onSubmit = (values: CreateIngredient) => {
    const data = {
      ...values,
      warehouse_id: values.warehouse_id,
    }

    createIngredient.mutateAsync(data).then(() => {
      form.reset()
    })
  }

  if (loadingWallets || loadingClients) {
    return <Skeleton className='w-full h-[360px]' />
  }

  return (
    <Card className='m-6 h-[400px]'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Yangi sotuvni kiritish</CardTitle>
              <CardDescription>
                Bu yerda siz yangi sotuv ma'lumotlarni kiritishingiz mumkin
              </CardDescription>
            </div>
            <div>
              <Button
                type="submit"
                size="sm"
                variant="default"
                className="ml-3"
                disabled={createIngredient.isPending}
              >
                Saqlash
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-5 gap-4'>
              <FormSelect
                control={form.control}
                name='client_id'
                label="Klientni tanlang"
                options={clients?.data.map(client => ({
                  label: client.name,
                  value: client.id.toString(),
                }))}
              />
              <FormSelect
                control={form.control}
                name='wallet_id'
                label="Kassani tanlang"
                options={wallets?.data.map(wallet => ({
                  label: wallet.name,
                  value: wallet.id.toString(),
                }))}
              />
              <FormInput
                control={form.control}
                name='payment_received'
                label="Qilingan to'lov"
                type='number'
              />
              <FormSelect
                control={form.control}
                name="is_free"
                label='Aksiyami?'
                options={questionOptions}
              />
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  )
}

export default AddSale