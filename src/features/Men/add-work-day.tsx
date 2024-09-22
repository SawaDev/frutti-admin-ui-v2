import React, { useEffect } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import useMen from '@/hooks/useMen'
import useWorkDays from '@/hooks/useWorkDays'
import { FormInput } from '@/components/form/FormInput'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { SheetType } from '@/types/other'
import { Skeleton } from '@/components/ui/skeleton'
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table'
import { createWorkDaySchema } from '@/schema/work-days'
import { CreateWorkDay } from '@/types/work-days'
import { FormDatePicker } from '@/components/form/FormDatePicker'

const AddWorkDay: React.FC<SheetType> = ({ open, setOpen }) => {
  const { getAllMenQuery } = useMen()
  const { createWorkDayMutation } = useWorkDays()

  const { data: men, isLoading: loadingMen } = getAllMenQuery()

  const createWorkDay = createWorkDayMutation()

  const form = useForm<CreateWorkDay>({
    resolver: zodResolver(createWorkDaySchema),
    defaultValues: {}
  })

  useEffect(() => {
    if (men) {
      const newMen = []

      for (const man of men.data) {

        newMen.push({
          man_id: man.id,
          extra_hours: undefined,
          checked: false
        })
      }

      form.reset({
        data: newMen
      })
    }
  }, [men])

  const handleCheckAll = () => {
    men?.data.forEach((_, index) => {
      form.setValue(`data.${index}.checked`, true);
    });
  };

  const onSubmit = (values: CreateWorkDay) => {
    const filteredMen = []

    for (let i = 0; i < values.data.length; i++) {
      if (values.data[i].checked) {
        filteredMen.push({
          man_id: values.data[i].man_id,
          extra_hours: values.data[i].extra_hours
        })
      }
    }

    createWorkDay
      .mutateAsync({ ...values, data: filteredMen })
      .then(() => {
        setOpen(false)
      })
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className='sm:max-w-[80vw]'>
        {loadingMen ? (
          <div className='flex flex-col'>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className='h-4 w-full' />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SheetHeader>
                <SheetTitle>Ish kunini kiritish</SheetTitle>
                <SheetDescription>
                  Bu yerda siz yangi ish kunini qo'sha olasiz
                </SheetDescription>
              </SheetHeader>
              <div className='flex mt-3 gap-3'>
                <Button onClick={handleCheckAll} variant={'outline'}>
                  Barchasini tanlash
                </Button>
                <FormDatePicker
                  control={form.control}
                  name='date'
                  className='w-[300px]'
                />
              </div>
              <div className="grid gap-2 py-4">
                <ScrollArea className="h-[calc(100vh-250px)]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell className='max-w-[200px]'>
                          Erkaklar
                        </TableCell>
                        <TableCell>
                          Ishga keldimi
                        </TableCell>
                        <TableCell>
                          Qo'shimcha soatlar
                        </TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {men?.data.map((man, manIndex) => (
                        <TableRow key={manIndex} className=''>
                          <TableCell>
                            {man.name}
                          </TableCell>
                          <TableCell>
                            <FormInput
                              control={form.control}
                              type='checkbox'
                              name={`data.${manIndex}.checked`}
                              className=''
                            />
                          </TableCell>
                          <TableCell>
                            <FormInput
                              control={form.control}
                              type='number'
                              name={`data.${manIndex}.extra_hours`}
                            />
                          </TableCell>
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

export default AddWorkDay