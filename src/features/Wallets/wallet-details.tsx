import { FormInput } from "@/components/form/FormInput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog"
import { Form } from "@/components/ui/form"
import useWallets from "@/hooks/useWallets"
import { updateWalletSchema } from "@/schema/wallets"
import { GetSingleWalletResponse, UpdateWalletType } from "@/types/wallets"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChevronLeft } from "lucide-react"
import React from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import WalletTable from "./wallet-table"

interface WalletDetailsProps {
  data: GetSingleWalletResponse["data"]
}

const WalletDetails: React.FC<WalletDetailsProps> = ({ data }) => {
  const params = useParams()
  const { updateWalletMutation, deleteWalletMutation } = useWallets()

  const updateWallet = updateWalletMutation(params.id)
  const deleteWallet = deleteWalletMutation(params.id)

  const navigate = useNavigate()

  const formDefaults = {
    name: data.name || "",
    balance: data.balance || 0,
  };

  const form = useForm<UpdateWalletType>({
    resolver: zodResolver(updateWalletSchema),
    defaultValues: formDefaults
  })

  const onSubmit = async (values: UpdateWalletType) => {
    await updateWallet.mutateAsync(values)
  }

  const handleDelete = () => {
    deleteWallet.mutateAsync()
      .then(() => navigate("/wallets"))
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate("/wallets")} variant="outline" size="icon" className="h-7 w-7">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Kassa Ma'lumotlari
            </h1>
          </div>
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger>
                <Button
                  size="sm"
                  variant={"destructive"}
                  type="button"
                >
                  O'chirish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogDescription>
                  Kassa o'chgandan so'ng unga bog'liq barcha ma'lumotlar ham yo'q bo'ladi va ularni tiklab bo'lmaydi!
                </DialogDescription>
                <DialogFooter>
                  <DialogClose>
                    <Button>Bekor qilish</Button>
                  </DialogClose>
                  <DialogClose>
                    <Button
                      variant={"destructive"}
                      type="button"
                      onClick={handleDelete}
                    >
                      O'chirish
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              disabled={form.formState.isLoading || !form.formState.isDirty || updateWallet.isPending}
              type="submit"
              size="sm"
            >
              Saqlash
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Kassa haqida</CardTitle>
                <CardDescription>
                  Bu yerda siz ushbu kassa haqidagi asosiy ma'lumotlarni o'zgartirishingiz mumkin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5">
                  <FormInput
                    control={form.control}
                    name="name"
                    label="Nomi"
                  />
                  <FormInput
                    name="balance"
                    control={form.control}
                    label="Balans"
                    disabled
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <Card className="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8 scrollbar-hidden pt-1">
            <WalletTable id={params.id ?? ""} />
          </Card>
        </div>
      </form>
    </Form>
  )
}

export default WalletDetails