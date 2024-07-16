import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { toast } from '@/components/ui/use-toast'
import useCurrencies from '@/hooks/useCurrencies'
import { Currency } from '@/types/currencies'
import { SheetType } from '@/types/other'
import React, { useState } from 'react'

type UpdateCurrencyType = SheetType & {
  defaultCurrency: Currency | null
}

const UpdateCurrency: React.FC<UpdateCurrencyType> = ({ open, setOpen, defaultCurrency }) => {
  const [distribution, setDistribution] = useState<undefined | number>()

  const { updateCurrencyMutation } = useCurrencies()

  const updateCurrency = updateCurrencyMutation(defaultCurrency?.id)

  const handleUpdate = () => {
    if (distribution) {
      updateCurrency
        .mutateAsync({ distribution: distribution })
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
          Kursni O'zgartirish
        </DialogTitle>
        <Input
          onChange={(e) => setDistribution(+e.target.value)}
          placeholder='Yangi kurs...'
          defaultValue={defaultCurrency?.distribution}
        />
        <div className='flex justify-end'>
          <Button type='submit' disabled={distribution ? false : true} onClick={handleUpdate} className='w-fit text-right'>
            Saqlash
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateCurrency