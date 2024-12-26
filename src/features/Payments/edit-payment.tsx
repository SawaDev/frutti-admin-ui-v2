import { FormInput } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { EditPaymentType, Payment } from './payments.type'
import usePayments from './usePayments'
import { SheetType } from '@/types/other'
import { updatePaymentSchema } from './payments.schema'

const EditPayment: React.FC<SheetType & { payment: Payment | undefined}> = ({ open, setOpen, payment }) => {
console.log(payment)
  const { updatePaymentMutation } = usePayments()

  const updatePayment = updatePaymentMutation(payment?.id)

  const form = useForm({
    resolver: zodResolver(updatePaymentSchema),
    defaultValues: {}
  })

  useEffect(() => {
    if (payment) {
      form.reset({
        amount_paid: payment.amount_paid,
      })
    }
  }, [payment])

  const onSubmit = (values: EditPaymentType) => {
    updatePayment.mutateAsync(values).then(() => {
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
              <SheetTitle>To'lov ma'lumotlarini o'zgartirish</SheetTitle>
              <SheetDescription>
                Bu yerda siz to'lov ma'lumotlarini o'zgartira olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-190px)] mb-2">
                <div className="grid grid-rows-1 gap-3 mt-3 ml-2 mr-3 items-center">
                  <FormInput
                    control={form.control}
                    name='amount_paid'
                    type='number'
                    label="To'lov miqdori"
                  />
                </div>
              </ScrollArea>
            </div>
            <SheetFooter>
              <Button
                disabled={!form.formState.isDirty || form.formState.isLoading || updatePayment.isPending}
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

export default EditPayment