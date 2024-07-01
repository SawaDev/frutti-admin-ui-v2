import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import useExpenses from '@/hooks/useExpenses'
import { SheetType } from '@/types/other'
import React, { useState } from 'react'

const AddCategory: React.FC<SheetType> = ({ open, setOpen }) => {
  const [name, setName] = useState<undefined | string>()

  const { createExpenseCategoryMutation } = useExpenses()
  const createExpenseCategory = createExpenseCategoryMutation()

  const handleCreate = () => {
    if (name) {
      createExpenseCategory
        .mutateAsync({ name: name })
        .then(() => setOpen(false))
        .catch(() =>
          toast({
            title: "Error",
            variant: "destructive",
            description: "Something went wrong!"
          })
        )

    } else {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Kategoriya nomini kiriting!"
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>
          Yangi Kategoriya Yaratish
        </DialogTitle>
        <Input onChange={(e) => setName(e.target.value)} placeholder='Kategoriyani nomini kiriting...' />
        <div className='flex justify-end'>
          <Button type='submit' disabled={(name && name?.length >= 2) ? false : true} onClick={handleCreate} className='w-fit text-right'>
            Saqlash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default AddCategory