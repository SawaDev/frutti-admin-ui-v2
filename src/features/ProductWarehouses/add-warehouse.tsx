import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import useProductWarehouses from '@/hooks/useProductWarehouses'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { FormInput } from '@/components/form/FormInput'
import { SheetType } from '@/types/other'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CreateWarehouse } from '@/types/warehouses'
import { CreateProductWarehouse } from '@/types/product-warehouses'
import { createProductWarehouseSchema } from '@/schema/product-warehouses'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'

const AddProductWarehouse: React.FC<SheetType> = ({ open, setOpen }) => {

  const { createProductWarehouseMutation } = useProductWarehouses()

  const createWarehouse = createProductWarehouseMutation()

  const form = useForm<CreateProductWarehouse>({
    resolver: zodResolver(createProductWarehouseSchema),
    defaultValues: {}
  })

  const onSubmit = (values: CreateWarehouse) => {
    createWarehouse.mutateAsync(values).then(() => {
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
              <SheetTitle>Yangi sklad yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi sklad qo'sha olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="grid grid-rows-1 gap-3 mt-3 ml-2 mr-3 items-center">
                  <FormInput
                    control={form.control}
                    name='name'
                    label={"Nomi"}
                  />
                </div>
              </ScrollArea>
            </div>
            <SheetFooter>
              <Button
                disabled={!form.formState.isDirty || form.formState.isLoading || createWarehouse.isPending}
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

export default AddProductWarehouse