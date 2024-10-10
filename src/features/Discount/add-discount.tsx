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
import { SheetType } from "@/types/other";
import useDiscounts from "@/hooks/useDiscounts";
import { FormSelect } from "@/components/form/FormSelect";
import { discountTypeOptions } from "@/constants/options";
import { FormInput } from "@/components/form/FormInput";
import { CreateDiscountType } from "@/types/discounts";
import { createDiscountSchema } from "@/schema/disocunts";
import useClients from "@/hooks/useClients";
import { FormDatePicker } from "@/components/form/FormDatePicker";

const AddDiscount: React.FC<SheetType> = ({ open, setOpen }) => {
  const { createDiscountMutation } = useDiscounts();
  const { getAllClientsQuery } = useClients();

  const { data: clients, isLoading: loadingClients } = getAllClientsQuery();

  const createDiscount = createDiscountMutation();

  const form = useForm<CreateDiscountType>({
    mode: "onChange",
    resolver: zodResolver(createDiscountSchema),
    defaultValues: {
      type: "amount",
    },
  });

  const discountType = form.watch("type");

  const onSubmit = (values: CreateDiscountType) => {
    createDiscount.mutateAsync(values).then(() => {
      form.reset();
      setOpen(false);
    });
  };

  if (loadingClients) {
    return "Loading...";
  }
  console.log("errors", form.formState.errors);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Yangi chegirmani yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi chegirmani qo'sha olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="ml-2 mr-3 mt-3 grid grid-rows-1 items-center gap-3">
                  <FormSelect
                    control={form.control}
                    name="client_id"
                    label="Klientlar"
                    placeholder="Klientlar"
                    options={
                      clients
                        ? clients?.data.map((item) => ({
                            label: item.name,
                            value: item.id.toString(),
                          }))
                        : []
                    }
                  />
                  <FormSelect
                    control={form.control}
                    name="type"
                    label="Chegirma turi"
                    placeholder="Chegirma turi"
                    options={discountTypeOptions}
                  />
                  <FormInput
                    control={form.control}
                    name="value"
                    label="Miqdori"
                    placeholder="Miqdori"
                    type="number"
                    className="mx-1"
                  />
                  {discountType === "percentage" && (
                    <FormDatePicker
                      control={form.control}
                      name="from_date"
                      className="mx-1"
                      label="Qaysi kundan"
                    />
                  )}
                  {discountType === "percentage" && (
                    <FormDatePicker
                      control={form.control}
                      name="to_date"
                      className="mx-1"
                      label="Qaysi kungacha"
                    />
                  )}
                </div>
              </ScrollArea>
            </div>
            <SheetFooter>
              <Button disabled={form.formState.isLoading || createDiscount.isPending} type="submit">
                Saqlash
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default AddDiscount;
