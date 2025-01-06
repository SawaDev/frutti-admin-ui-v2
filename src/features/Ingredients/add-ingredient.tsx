import { FormInput } from '@/components/form/FormInput'
import { FormSearchInput } from '@/components/form/FormSearchInput'
import { FormSelect } from '@/components/form/FormSelect'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { unitOptions } from '@/constants/options'
import useIngredients from '@/hooks/useIngredients'
import useWarehouses from '@/hooks/useWarehouses'
import { createIngredientSchema } from '@/schema/ingredients'
import { CreateIngredient } from '@/types/ingredients'
import { SheetType } from '@/types/other'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import AddCategory from './add-category'

const AddIngredient: React.FC<SheetType> = ({ open, setOpen }) => {
  const [newCategory, setNewCategory] = useState(false)

  const { createIngredientMutation, getAllIngredientCategoriesQuery } = useIngredients()
  const { getAllWarehousesQuery } = useWarehouses()

  const createIngredient = createIngredientMutation()

  const { data: warehouses, isLoading: loadingWarehouses } = getAllWarehousesQuery()
  const { data: ingredientCategories, isLoading: loadingIngredientCategories } = getAllIngredientCategoriesQuery()

  const form = useForm<CreateIngredient>({
    resolver: zodResolver(createIngredientSchema),
    defaultValues: {}
  })

  const onSubmit = (values: CreateIngredient) => {
    const data = {
      ...values,
      warehouse_id: values.warehouse_id,
    }

    createIngredient.mutateAsync(data).then(() => {
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
              <SheetTitle>Yangi siroyni yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi siryo qo'sha olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-190px)] mb-2">
                <div className="grid grid-rows-1 gap-3 my-3 ml-2 mr-3 items-center">
                  <FormInput
                    control={form.control}
                    name='name'
                    label={"Nomi"}
                  />
                  {!loadingWarehouses && (
                    <FormSelect
                      control={form.control}
                      name='warehouse_id'
                      options={
                        warehouses?.data
                          .map(warehouse => ({ value: warehouse.id.toString(), label: warehouse.name }))
                      }
                      label='Qaysi Skladdan'
                    />
                  )}
                  <FormSelect
                    control={form.control}
                    name='unit'
                    label='Birligi'
                    options={unitOptions}
                  />
                  {(!loadingIngredientCategories && ingredientCategories?.data) && (
                    <FormSearchInput
                      control={form.control}
                      name='category_id'
                      options={ingredientCategories?.data.map(categories => ({ value: categories.id.toString(), label: categories.name }))}
                      label='Kategoriya'
                      handleNew={() => setNewCategory(true)}
                      handleChange={(value) => form.setValue('category_id', value)}
                    />
                  )}
                  <FormInput
                    control={form.control}
                    name="quantity"
                    type='number'
                    label="Miqdori"
                  />
                  <FormInput
                    control={form.control}
                    name='cost'
                    type='number'
                    label={"Narxi"}
                    step={0.000000001}
                  />
                </div>
              </ScrollArea>
            </div>
            <SheetFooter>
              <Button
                disabled={!form.formState.isDirty || form.formState.isLoading || createIngredient.isPending}
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

export default AddIngredient