import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { walletTypeOptions } from "@/constants/options";
import useWallets from "@/hooks/useWallets";
import { walletSchema } from "@/schema/wallets";
import { SheetType } from "@/types/other";
import { WalletType } from "@/types/wallets";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";

const AddWallet: React.FC<SheetType> = ({ open, setOpen }) => {
  const { createWalletMutation } = useWallets();

  const createWallet = createWalletMutation();

  const form = useForm<WalletType>({
    resolver: zodResolver(walletSchema),
    defaultValues: {
      type: "sum",
    },
  });

  const onSubmit = (values: WalletType) => {
    createWallet.mutateAsync(values).then(() => {
      setOpen(false);
      form.reset({
        type: "sum",
      });
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Yangi hamyon yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda yangi hamyonni qo'sha olasiz
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="grid h-[calc(100vh-200px)] gap-2 py-4">
              <div className="ml-2 mr-3 mt-3 grid grid-rows-1 items-center gap-3">
                <FormInput
                  control={form.control}
                  name="name"
                  label="Nomi"
                  className="mx-1"
                  placeholder="Nomi"
                />
                <FormInput
                  control={form.control}
                  name="balance"
                  label="Balans"
                  className="mx-1"
                  type="number"
                  step={0.0001}
                  placeholder="Balans"
                />
                <FormSelect
                  control={form.control}
                  name="type"
                  label="Valyuta"
                  className="mx-1"
                  placeholder="Balans"
                  options={walletTypeOptions}
                />
              </div>
            </ScrollArea>
            <SheetFooter>
              <Button
                disabled={
                  !form.formState.isValid ||
                  !form.formState.isDirty ||
                  form.formState.isLoading ||
                  createWallet.isPending
                }
                type="submit"
              >
                Saqlash
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddWallet;
