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
import { GetSingleClientResponse, ClientType } from "@/types/clients"
import useClients from "@/hooks/useClients"
import { updateClientSchema } from "@/schema/clients"

interface ClientDetailsProps {
  data: GetSingleClientResponse["data"]
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({ data }) => {
  const params = useParams()
  const { updateClientMutation } = useClients()

  const updateClient = updateClientMutation(params.id)
  const navigate = useNavigate()

  const formDefaults = {
    name: data.name || "",
  };

  const form = useForm<ClientType>({
    resolver: zodResolver(updateClientSchema),
    defaultValues: formDefaults
  })

  const onSubmit = async (values: ClientType) => {
    await updateClient.mutateAsync(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/clients")} variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Klient Ma'lumotlari
            </h1>
          </div>
          <Button
            disabled={form.formState.isLoading || !form.formState.isDirty || updateClient.isPending}
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
                <CardTitle>Klient haqida</CardTitle>
                <CardDescription>
                  Bu yerda siz ushbu klient haqidagi asosiy ma'lumotlarni o'zgartirishingiz mumkin
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
                    name="balance"
                    type="number"
                    defaultValue={data.balance}
                    control={form.control}
                    label="Balans"
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