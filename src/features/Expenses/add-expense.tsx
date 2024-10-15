import { FormInput } from '@/components/form/FormInput'
import { FormSelect } from '@/components/form/FormSelect'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import useExpenses from '@/hooks/useExpenses'
import useWallets from '@/hooks/useWallets'
import { expenseSchema } from '@/schema/expenses'
import { ExpenseDataType } from '@/types/expenses'
import { SheetType } from '@/types/other'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import AddCategory from './add-category'

const AddExpense: React.FC<SheetType> = ({ open, setOpen }) => {
  const [newCategory, setNewCategory] = useState(false)

  const { createExpenseMutation, getAllExpenseCategoriesQuery } = useExpenses()
  const { getAllWalletsQuery } = useWallets()

  const createExpense = createExpenseMutation()

  const { data: wallets, isLoading: loadingWallets } = getAllWalletsQuery()
  const { data: categories, isLoading: loadingCategories } = getAllExpenseCategoriesQuery()

  const form = useForm<ExpenseDataType>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {}
  })

  const onSubmit = (values: ExpenseDataType) => {
    const data = {
      ...values,
      wallet_id: Number(values.wallet_id),
      ...(values.category_id ? { category_id: Number(values.category_id) } : { category_id: null })
    }

    createExpense.mutateAsync(data).then(() => {
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
              <SheetTitle>Yangi harajatni yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi harajatni qo'sha olasiz
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
                  {!loadingCategories && categories?.data && (
                    <FormSelect
                      control={form.control}
                      name='category_id'
                      options={categories?.data.map(categories => ({ value: categories.id.toString(), label: categories.name }))}
                      label='Kategoriya'
                      handleNew={() => setNewCategory(true)}
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
                    name='comment'
                    label={"Kommentariya"}
                  />
                </div>
              </ScrollArea>
            </div>
            <SheetFooter>
              <Button
                disabled={!form.formState.isDirty || form.formState.isLoading || createExpense.isPending}
                type="submit"
              >
                Saqlash
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
      <AddCategory open={newCategory} setOpen={setNewCategory} />
    </Sheet>
  )
}

export default AddExpense