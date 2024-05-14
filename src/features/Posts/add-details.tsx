import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TAB_LANGUAGES } from '@/constants/tabs'
import usePosts from '@/hooks/usePosts'
import { api } from '@/lib/api'
import { getImageData } from '@/lib/utils'
import { detailSchema } from '@/schema/posts'
import { DetailType } from '@/types/posts'

import { zodResolver } from '@hookform/resolvers/zod'
import React, { ChangeEvent, useState } from 'react'
import { useForm } from 'react-hook-form'

interface AddDetailProps {
  setOpen: (value: boolean) => void
  id: string | undefined
}

export const AddDetail: React.FC<AddDetailProps> = ({ setOpen, id }) => {
  const [preview, setPreview] = useState<string | undefined>();

  const { createDetailMutation } = usePosts()
  const createDetail = createDetailMutation(id)

  const formDefaults = {
    published: true
  };

  const form = useForm<DetailType>({
    resolver: zodResolver(detailSchema),
    defaultValues: formDefaults
  })

  const handleUpload = async (file: File) => {
    let formData = new FormData();
    formData.append("picture", file)

    const response = await api.post("/upload", formData)

    return response.data
  }

  const handleImage = async (event: ChangeEvent<HTMLInputElement>, callbackFunction: (...event: any[]) => void) => {
    const { files, displayUrl } = getImageData(event)

    if (files) {
      const data = await handleUpload(files[0])

      if (data.success) {
        callbackFunction(data.data)
      }
    }
    setPreview(displayUrl);
  }

  const onSubmit = async (values: DetailType) => {
    await createDetail.mutateAsync(values)
    setOpen(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <SheetHeader>
          <SheetTitle>Yangi To'ldiruvchi Post</SheetTitle>
          <SheetDescription>
            Bu yerda siz yangi to'ldiruvchi post qo'shishingiz mumkin
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-2 py-4">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <Tabs defaultValue="uz">
              <TabsList className="grid w-[300px] grid-cols-3">
                {TAB_LANGUAGES.map(language => (
                  <TabsTrigger key={language.suffix} value={language.suffix}>{language.name}</TabsTrigger>
                ))}
              </TabsList>
              {TAB_LANGUAGES.map(language => (
                <TabsContent key={language.suffix} value={language.suffix} className="grid">
                  <div className="grid grid-cols-4 ml-2 mr-3 items-center">
                    <FormField
                      control={form.control}
                      name={`name.${language.suffix}`}
                      render={({ field }) => (
                        <FormItem className='col-span-4'>
                          <FormLabel>Nomi</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-4 ml-2 mr-3 items-center">
                    <FormField
                      control={form.control}
                      name={`capacity.${language.suffix}`}
                      render={({ field }) => (
                        <FormItem className='col-span-4'>
                          <FormLabel>Sig'imi</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            <div className="grid grid-cols-4 ml-2 mr-3 items-center">
              <FormField
                control={form.control}
                name={`mass`}
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className='col-span-4'>
                    <FormLabel>Og'irligi</FormLabel>
                    <FormControl>
                      <Input type='number' onChange={event => onChange(+event.target.value)} {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 ml-2 mr-3 items-center">
              <FormField
                control={form.control}
                name={`pure_mass`}
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className='col-span-4'>
                    <FormLabel>Sof Og'irligi</FormLabel>
                    <FormControl>
                      <Input type='number' onChange={event => onChange(+event.target.value)} {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 ml-2 mr-3 items-center">
              <FormField
                control={form.control}
                name={`total_mass`}
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className='col-span-4'>
                    <FormLabel>Umumiy Og'irligi</FormLabel>
                    <FormControl>
                      <Input type='number' onChange={event => onChange(+event.target.value)} {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 ml-2 mr-3 items-center">
              <FormField
                control={form.control}
                name={`expiration_date`}
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className='col-span-4'>
                    <FormLabel>Saqlash Muddati</FormLabel>
                    <FormControl>
                      <Input type='number' onChange={event => onChange(+event.target.value)} {...fieldProps} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 ml-2 mr-3 items-center">
              <FormField
                control={form.control}
                name={`volume`}
                render={({ field }) => (
                  <FormItem className='col-span-4'>
                    <FormLabel>Hajmi</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 ml-2 mr-3 items-center">
              <FormField
                control={form.control}
                name="published"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-4 my-3">
                    <FormLabel>E'lon qilinganmi</FormLabel>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-4 ml-2 mr-3 items-center">
              <FormField
                control={form.control}
                name="image"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem className='col-span-4'>
                    <FormLabel>Rasm</FormLabel>
                    <FormControl>
                      <Input
                        {...fieldProps}
                        type="file"
                        accept="image/*"
                        onChange={(event) => {
                          handleImage(event, onChange)
                        }}
                      />
                    </FormControl>
                    {preview && (
                      <div className='col-span-4 h-[200px] bg-gray-100 mt-1'>
                        <img className='w-full h-full object-contain' src={preview} alt='image preview' />
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </ScrollArea>
        </div>
        <SheetFooter>
          <Button disabled={form.formState.isLoading || !form.formState.isDirty || !form.formState.isValid} type="submit">Saqlash</Button>
        </SheetFooter>
      </form>
    </Form>
  )
}