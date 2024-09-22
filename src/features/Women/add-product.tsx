import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import useWomen from '@/hooks/useWomen'
import useProducts from '@/hooks/useProducts'
import { FormInput } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { womanProductsSchema } from '@/schema/woman'
import { SheetType } from '@/types/other'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { z } from 'zod'


const AddProduct: React.FC<SheetType> = ({ open, setOpen }) => {
  const { createWomanProductsMutation, getAllWomenQuery } = useWomen()
  const { getAllProductsQuery } = useProducts()

  const { data: women, isLoading: loadingWomen } = getAllWomenQuery()
  const { data: products, isLoading: loadingProducts } = getAllProductsQuery()

  const createWomanProducts = createWomanProductsMutation()

  const form = useForm<z.infer<typeof womanProductsSchema>>({
    resolver: zodResolver(womanProductsSchema),
    defaultValues: {}
  })

  useEffect(() => {
    if (women && products) {
      const newWomen = []

      for (const woman of women.data) {
        const newProducts = []

        for (const product of products.data) {
          newProducts.push({
            product_id: product.id,
            quantity: undefined
          })
        }

        newWomen.push({
          woman_id: woman.id,
          products: newProducts
        })
      }

      form.reset({
        women: newWomen
      })
    }
  }, [women, products])

  const onSubmit = (values: z.infer<typeof womanProductsSchema>) => {
    const filteredWomen = []

    for (let i = 0; i < values.women.length; i++) {
      const newProducts = values.women[i].products.filter(product => product.quantity)

      if (newProducts.length > 0) {
        filteredWomen.push({
          woman_id: values.women[i].woman_id,
          products: newProducts
        })
      }
    }

    createWomanProducts
      .mutateAsync(filteredWomen)
      .then(() => {
        setOpen(false)
      })

  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='sm:max-w-[80vw]'>
        {loadingProducts || loadingWomen ? (
          <div className='flex flex-col'>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className='h-4 w-full' />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SheetHeader>
                <SheetTitle>Chiqarilgan mahsulotlarni kiritish</SheetTitle>
                <SheetDescription>
                  Bu yerda siz yangi chiqarilgan mahsulotlarni qo'sha olasiz
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-2 py-4">
                <ScrollArea className="h-[calc(100vh-200px)]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell className='max-w-[200px]'>
                          Ayollar
                        </TableCell>
                        {products?.data.map((product, index) => (
                          <TableCell className='font-semibold' key={index}>
                            {product.name} (<span className='text-[12px] text-green-500'>{product.quantity}</span>)
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {women?.data.map((woman, womanIndex) => (
                        <TableRow key={womanIndex} className=''>
                          <TableCell>
                            {woman.name}
                          </TableCell>
                          {products?.data.map((_, productIndex) => (
                            <TableCell>
                              <FormInput
                                key={productIndex}
                                control={form.control}
                                type='number'
                                name={`women.${womanIndex}.products.${productIndex}.quantity`}
                                className='w-full'
                              />
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
              <SheetFooter>
                <Button
                  disabled={!form.formState.isValid || !form.formState.isDirty || form.formState.isLoading}
                  type="submit"
                >
                  Saqlash
                </Button>
              </SheetFooter>
            </form>
          </Form>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default AddProduct