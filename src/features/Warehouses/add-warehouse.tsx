import { FormInput } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import useWarehouses from '@/hooks/useWarehouses'
import { createWarehouseSchema } from '@/schema/warehouses'
import { SheetType } from '@/types/other'
import { CreateWarehouse } from '@/types/warehouses'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

const AddWarehouse: React.FC<SheetType> = ({ open, setOpen }) => {

  const { createWarehouseMutation } = useWarehouses()

  const createWarehouse = createWarehouseMutation()

  const form = useForm<CreateWarehouse>({
    resolver: zodResolver(createWarehouseSchema),
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
              <SheetTitle>Yangi siroyni yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi siryo qo'sha olasiz
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

export default AddWarehouse