import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { createAdvanceSchema } from "@/schema/advances";
import { SheetType } from "@/types/other";
import { CreateAdvanceType } from "@/types/advances";
import useAdvances from "@/hooks/useAdvances";
import useWomen from "@/hooks/useWomen";
import useMen from "@/hooks/useMen";
import { FormSelect } from "@/components/form/FormSelect";
import { paymentMethodOptions } from "@/constants/options";
import { FormTextarea } from "@/components/form/FormTextarea";
import { FormInput } from "@/components/form/FormInput";
import useWallets from "@/hooks/useWallets";
import useExpenses from "@/hooks/useExpenses";

const AddAdvance: React.FC<SheetType> = ({ open, setOpen }) => {
  const { createAdvanceMutation } = useAdvances();
  const { getAllWomenQuery } = useWomen();
  const { getAllMenQuery } = useMen();
  const { getAllWalletsQuery } = useWallets();
  const { getAllExpenseCategoriesQuery } = useExpenses();

  const { data: men, isLoading: loadingMen } = getAllMenQuery({});
  const { data: women, isLoading: loadingWomen } = getAllWomenQuery();
  const { data: wallets, isLoading: loadingWallets } = getAllWalletsQuery();
  const { data: categories, isLoading: loadingCategories } =
    getAllExpenseCategoriesQuery();

  const createAdvance = createAdvanceMutation();

  const form = useForm<CreateAdvanceType>({
    resolver: zodResolver(createAdvanceSchema),
    defaultValues: {
      method: "cash",
    },
  });

  const onSubmit = (values: CreateAdvanceType) => {
    createAdvance.mutateAsync(values).then(() => {
      form.reset();
      setOpen(false);
    });
  };

  if (loadingMen || loadingWomen || loadingWallets || loadingCategories) {
    return "Loading";
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Yangi avansni yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi avansni qo'sha olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="ml-2 mr-3 mt-3 grid grid-rows-1 items-center gap-3">
                  <FormSelect
                    control={form.control}
                    name="man_id"
                    label="Erkaklar"
                    placeholder="Erkaklar"
                    disabled={!!form.getValues("woman_id")}
                    options={
                      men
                        ? men?.data.map((item) => ({
                            label: item.name,
                            value: item.id.toString(),
                          }))
                        : []
                    }
                  />
                  <FormSelect
                    control={form.control}
                    name="woman_id"
                    label="Ayollar"
                    placeholder="Ayollar"
                    disabled={!!form.getValues("man_id")}
                    options={
                      women
                        ? women?.data.map((item) => ({
                            label: item.name,
                            value: item.id.toString(),
                          }))
                        : []
                    }
                  />
                  <FormInput
                    control={form.control}
                    name="amount"
                    label="Summa"
                    placeholder="Summa"
                    type="number"
                    className="mx-1"
                  />
                  <FormSelect
                    control={form.control}
                    name="expense_category_id"
                    label="Xarajat turi"
                    placeholder="Xarajat turi"
                    className="mx-1"
                    options={
                      categories
                        ? categories?.data.map((item) => ({
                            label: item.name,
                            value: item.id.toString(),
                          }))
                        : []
                    }
                  />
                  <FormSelect
                    control={form.control}
                    name="wallet_id"
                    label="Kassa"
                    placeholder="Kassa"
                    className="mx-1"
                    options={
                      wallets
                        ? wallets?.data.map((item) => ({
                            label: item.name,
                            value: item.id.toString(),
                          }))
                        : []
                    }
                  />
                  <FormSelect
                    control={form.control}
                    name="method"
                    label="To'lov turi"
                    placeholder="To'lov turi"
                    className="mx-1"
                    options={paymentMethodOptions}
                  />
                  <FormTextarea
                    control={form.control}
                    name="comment"
                    label="Kommentariya"
                    placeholder="Kommentariya"
                    className="mx-1"
                  />
                </div>
              </ScrollArea>
            </div>
            <SheetFooter>
              <Button
                disabled={
                  !form.formState.isValid ||
                  !form.formState.isDirty ||
                  form.formState.isLoading
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

export default AddAdvance;
