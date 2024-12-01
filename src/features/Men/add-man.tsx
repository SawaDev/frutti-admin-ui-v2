import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { FormInput } from "@/components/form/FormInput";
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
import { createManSchema } from "@/schema/man";
import { SheetType } from "@/types/other";
import { CreateManType } from "@/types/man";
import useMen from "@/hooks/useMen";
import { FormSelect } from "@/components/form/FormSelect";

const AddMan: React.FC<SheetType> = ({ open, setOpen }) => {
  const { createMenMutation } = useMen();

  const createMan = createMenMutation();

  const form = useForm<CreateManType>({
    resolver: zodResolver(createManSchema),
    defaultValues: {
      hours_per_day: 12,
    },
  });

  const salaryType = form.watch("salary_type");

  const onSubmit = (values: CreateManType) => {
    createMan.mutateAsync(values).then(() => {
      setOpen(false);
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Yangi erkakni yaratish</SheetTitle>
              <SheetDescription>
                Bu yerda siz yangi erkakni qo'sha olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="ml-2 mr-3 mt-3 grid grid-rows-1 items-center gap-3">
                  <FormInput
                    control={form.control}
                    name="name"
                    label="Ismi"
                    placeholder="Ismi"
                    className="mx-1"
                  />
                  <FormInput
                    control={form.control}
                    name="balance"
                    label="Balans"
                    placeholder="Balans"
                    className="mx-1"
                    type="number"
                    step={0.01}
                  />
                  <FormSelect
                    control={form.control}
                    name="salary_type"
                    label="To'lov turi"
                    placeholder="To'lov turi"
                    className="mx-1"
                    options={[
                      { label: "Oylik", value: "monthly" },
                      { label: "Kunlik", value: "daily" },
                      { label: "Mahsulot bo'yicha", value: "by_product" },
                    ]}
                  />
                  {salaryType !== "by_product" && (
                    <>
                      <FormInput
                        control={form.control}
                        name="hours_per_day"
                        label="Kunlik ish soati"
                        placeholder="Kunlik ish soati"
                        className="mx-1"
                        type="number"
                      />
                      <FormInput
                        control={form.control}
                        name="payment_per_day"
                        label="Kunlik to'lov summasi"
                        placeholder="Kunlik to'lov summasi"
                        className="mx-1"
                        type="number"
                        step={0.01}
                      />
                    </>
                  )}
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

export default AddMan;
