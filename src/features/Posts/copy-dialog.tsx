import { Button } from '@/components/ui/button'
import { DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import usePosts from '@/hooks/usePosts'
import { copySchema } from '@/schema/posts'
import { CopyType } from '@/types/posts'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'

interface CopyDialogProps {
  postId: string | undefined
  detailId: string | undefined
  setCopy: (value: string | undefined) => void
}

const CopyDialog: React.FC<CopyDialogProps> = ({ postId, detailId, setCopy }) => {
  const { copyDetailMutation } = usePosts()
  const copyDetail = copyDetailMutation(postId, detailId)
  const copyForm = useForm<CopyType>({
    resolver: zodResolver(copySchema),
    defaultValues: {
      count: 1
    }
  })

  const onCopySubmit = (values: CopyType) => {
    copyDetail.mutateAsync(values)
      .then(() => setCopy(undefined))

  }

  return (
    <Form {...copyForm}>
      <form>
        <DialogContent>
          <DialogHeader>
            Bu yerda nechta nusxa yaratmoqchiligingizni kiriting:
          </DialogHeader>
          <FormField
            control={copyForm.control}
            name={"count"}
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Nusxalar Soni</FormLabel>
                <FormControl>
                  <Input {...fieldProps} placeholder="Nusxalar soni" onChange={event => onChange(+event.target.value)} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button disabled={false} type="submit" onClick={copyForm.handleSubmit(onCopySubmit)}>
              Yaratish
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Form>
  )
}

export default CopyDialog