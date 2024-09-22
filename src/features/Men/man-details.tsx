import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Form } from "@/components/ui/form"
import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { ChevronLeft } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { FormInput } from "@/components/form/FormInput"
import { GetSingleManResponse, UpdateManType } from "@/types/man"
import { updateManSchema } from "@/schema/man"
import useMen from "@/hooks/useMen"

interface ManDetailsProps {
  data: GetSingleManResponse["data"]
}

export const ManDetails: React.FC<ManDetailsProps> = ({ data }) => {
  const params = useParams()
  const { updateManMutation } = useMen()

  const updateMan = updateManMutation(params.id)
  const navigate = useNavigate()

  const formDefaults = {
    name: data.name || "",
    hours_per_day: data.hours_per_day || undefined,
    payment_per_hour: data.payment_per_hour || undefined,
  };

  const form = useForm<UpdateManType>({
    resolver: zodResolver(updateManSchema),
    defaultValues: formDefaults
  })

  const onSubmit = async (values: UpdateManType) => {
    await updateMan.mutateAsync(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/men")} variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Erkak Ma'lumotlari
            </h1>
          </div>
          <Button
            disabled={form.formState.isLoading || !form.formState.isDirty || updateMan.isPending}
            type="submit"
            size="sm"
          >
            Saqlash
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Erkak haqida</CardTitle>
                <CardDescription>
                  Bu yerda siz ushbu erkak haqidagi asosiy ma'lumotlarni o'zgartirishingiz mumkin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5">
                  <FormInput
                    name="name"
                    control={form.control}
                    label="Nomi"
                  />
                  <FormInput
                    name="hours_per_day"
                    control={form.control}
                    label="Kunlik ish soat"
                  />
                  <FormInput
                    name="payment_per_hour"
                    control={form.control}
                    label="Soatbay to'lov summasi"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  )
}