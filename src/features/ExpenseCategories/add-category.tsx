import { FormInput } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import useExpenses from '@/hooks/useExpenses'
import { expenseCategorySchema } from '@/schema/expenses'
import { ExpenseCategoryDataType } from '@/types/expenses'
import { SheetType } from '@/types/other'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

interface AddCategoryProps extends SheetType {
  category?: ExpenseCategoryDataType
}

const AddCategory: React.FC<AddCategoryProps> = ({ open, setOpen, category }) => {
  const { createExpenseCategoryMutation, updateExpenseCategoryMutation } = useExpenses()

  const createCategory = createExpenseCategoryMutation()
  const updateCategory = updateExpenseCategoryMutation(category?.id)

  const form = useForm<ExpenseCategoryDataType>({
    resolver: zodResolver(expenseCategorySchema),
    defaultValues: category || {}
  })

  React.useEffect(() => {
    if (category) {
      form.reset(category)
    }
  }, [category, form])

  const onSubmit = (values: ExpenseCategoryDataType) => {
    const mutation = category
      ? updateCategory.mutateAsync(values)
      : createCategory.mutateAsync(values)

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
                {category ? "Kategoriyani tahrirlash" : "Yangi kategoriya yaratish"}
              </SheetTitle>
              <SheetDescription>
                {category
                  ? "Bu yerda siz kategoriyani tahrirlashingiz mumkin"
                  : "Bu yerda siz yangi kategoriya qo'sha olasiz"
                }
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <FormInput
                control={form.control}
                name="name"
                label="Nomi"
              />
            </div>
            <SheetFooter>
              <Button
                disabled={!form.formState.isDirty || form.formState.isLoading || createCategory.isPending || updateCategory.isPending}
                type="submit"
              >
                {category ? "Yangilash" : "Saqlash"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}

export default AddCategory