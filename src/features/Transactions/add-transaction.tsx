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
import { transactionOptions } from "@/constants/options";
import useClients from "@/hooks/useClients";
import useTransactions from "@/hooks/useTransactions";
import useWallets from "@/hooks/useWallets";
import { transactionSchema } from "@/schema/transactions";
import { SheetType } from "@/types/other";
import { Transaction, TransactionType } from "@/types/transactions";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";

const AddTransaction: React.FC<SheetType & { editData?: Transaction }> = ({
  open,
  setOpen,
  editData,
}) => {
  const { createTransactionMutation, updateTransactionMutation } =
    useTransactions();
  const { getAllWalletsQuery } = useWallets();
  const { getAllClientsQuery } = useClients();

  const createTransaction = createTransactionMutation();
  const updateTransaction = updateTransactionMutation(editData?.id);

  const { data: wallets, isLoading: loadingWallets } = getAllWalletsQuery();
  const { data: clients, isLoading: loadingClients } = getAllClientsQuery();

  const form = useForm<TransactionType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: "cash",
    },
  });

  useEffect(() => {
    if (editData) {
      form.reset({
        ...editData,
        wallet_id: editData.wallet.id.toString(),
        client_id: editData.client?.id?.toString(),
      });
    }
  }, [editData, form]);

  const onSubmit = (values: TransactionType) => {
    const data = {
      ...values,
      wallet_id: Number(values.wallet_id),
      ...(values.client_id
        ? { client_id: +values.client_id }
        : { client_id: null }),
    };

    const mutation = editData
      ? updateTransaction.mutateAsync({ ...data })
      : createTransaction.mutateAsync(data);

    mutation.then(() => {
      setOpen(false);
      form.reset();
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>
                {editData
                  ? "Pul o'tkazmasini tahrirlash"
                  : "Yangi pul o'tkazmasini yaratish"}
              </SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi pul o'tkazmasini qo'sha olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="ml-2 mr-3 mt-3 grid grid-rows-1 items-center gap-3">
                  {!loadingWallets && (
                    <FormSelect
                      control={form.control}
                      name="wallet_id"
                      options={wallets?.data.map((wallet) => ({
                        value: wallet.id.toString(),
                        label: wallet.name,
                      }))}
                      label="Kassa"
                    />
                  )}
                  {!loadingClients && (
                    <FormSelect
                      control={form.control}
                      name="client_id"
                      options={clients?.data.map((client) => ({
                        value: client.id.toString(),
                        label: client.name,
                      }))}
                      label="Haridor"
                    />
                  )}
                  <FormInput
                    control={form.control}
                    name="amount"
                    type="number"
                    label="Miqdor"
                  />
                  <FormSelect
                    control={form.control}
                    name="type"
                    options={transactionOptions}
                    label={"To'lov turi"}
                  />
                </div>
              </ScrollArea>
            </div>
            <SheetFooter>
              <Button
                disabled={!form.formState.isDirty || form.formState.isLoading}
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

export default AddTransaction;
