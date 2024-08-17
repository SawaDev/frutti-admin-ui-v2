import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import useProductWarehouses from '@/hooks/useProductWarehouses'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { SheetType } from '@/types/other'
import { FormInput } from '@/components/form/FormInput'
import { CreateWarehouse } from '@/types/warehouses'
import { CreateProductWarehouse } from '@/types/product-warehouses'
import { createProductWarehouseSchema } from '@/schema/product-warehouses'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const AddProductWarehouseDialog: React.FC<SheetType> = ({ open, setOpen }) => {

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Yangi sklad yaratish</DialogTitle>
              <DialogDescription>
                Bu yerda siz yangi sklad qo'sha olasiz
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-2 py-4">
              <div className="grid grid-rows-1 gap-3 mt-3 ml-2 mr-3 items-center">
                <FormInput
                  control={form.control}
                  name='name'
                  label={"Nomi"}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                disabled={!form.formState.isDirty || form.formState.isLoading || createWarehouse.isPending}
                type="submit"
              >
                Saqlash
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default AddProductWarehouseDialog