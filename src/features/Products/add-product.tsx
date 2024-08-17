import { zodResolver } from '@hookform/resolvers/zod'
import { FC, useState } from 'react'
import { useForm } from 'react-hook-form'

import useProductWarehouses from '@/hooks/useProductWarehouses'
import useProducts from '@/hooks/useProducts'
import AddProductWarehouseDialog from '../ProductWarehouses/add-warehouse-dialog'
import { FormInput } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SheetType } from '@/types/other'
import { FormSearchInput } from '@/components/form/FormSearchInput'
import { CreateProductType } from '@/types/products'
import { createProductSchema } from '@/schema/products'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'


const AddProduct: FC<SheetType> = ({ open, setOpen }) => {
  const [addWarehouse, setAddWarehouse] = useState(false)

  const { createProductMutation } = useProducts()
  const { getAllProductWarehousesQuery } = useProductWarehouses()

  const createProduct = createProductMutation()

  const { data: warehouses, isLoading: loadingWarehouses } = getAllProductWarehousesQuery()

  const form = useForm<CreateProductType>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {}
  })

  const onSubmit = (values: CreateProductType) => {
    const data = {
      ...values,
      warehouse_id: values.warehouse_id,
    }

    createProduct.mutateAsync(data).then(() => {
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
              <SheetTitle>Yangi mahsulotni yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi mahsulot qo'sha olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-190px)] mb-2">
                <div className="grid grid-rows-1 gap-3 mt-3 ml-2 mr-3 items-center">
                  <FormInput
                    control={form.control}
                    name='name'
                    label={"Nomi"}
                  />
                  {(!loadingWarehouses && warehouses?.data) && (
                    <FormSearchInput
                      control={form.control}
                      name='warehouse_id'
                      options={warehouses?.data.map(warehouse => ({ value: warehouse.id.toString(), label: warehouse.name }))}
                      label='Sklad'
                      handleNew={() => setAddWarehouse(true)}
                      handleChange={(value) => form.setValue('warehouse_id', value)}
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
                    name='price'
                    type='number'
                    label={"Narxi"}
                  />
                  <FormInput
                    control={form.control}
                    name='price_in_dollar'
                    type='number'
                    label={"Dollardagi narxi"}
                  />
                  <FormInput
                    control={form.control}
                    name='pure_price'
                    type='number'
                    label={"Tan narxi"}
                  />
                  <FormInput
                    control={form.control}
                    name='production_cost'
                    type='number'
                    label={"Ishlab chiqarish narxi"}
                  />
                  <FormInput
                    control={form.control}
                    name='bag_distribution'
                    type='number'
                    label='Hajmi'
                  />
                </div>
              </ScrollArea>
            </div>
            <SheetFooter>
              <Button
                disabled={!form.formState.isDirty || form.formState.isLoading || createProduct.isPending}
                type="submit"
              >
                Saqlash
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
      {addWarehouse && (
        <AddProductWarehouseDialog open={addWarehouse} setOpen={setAddWarehouse}/>
      )}
    </Sheet>
  )
}

export default AddProduct