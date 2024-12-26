import React, { useEffect } from "react";
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
import { SheetType } from "@/types/other";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { CreatePaymentType } from "./payments.type";
import { createPaymentSchema } from "./payments.schema";
import useWomen from "@/hooks/useWomen";
import usePayments from "./usePayments";

const AddPaymentWoman: React.FC<SheetType> = ({ open, setOpen }) => {
  const { getAllWomenQuery } = useWomen();
  const { createPaymentMutation } = usePayments();

  const { data: women, isLoading: loadingWomen } = getAllWomenQuery();

  const createPayment = createPaymentMutation();

  const form = useForm<CreatePaymentType>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (women) {
      const newWomen = [];

      for (const woman of women.data) {
        newWomen.push({
          woman_id: woman.id,
          amount_paid: undefined,
          bonus_amount: undefined,
        });
      }

      form.reset({
        data: newWomen,
      });
    }
  }, [women]);

  const onSubmit = (values: CreatePaymentType) => {
    const filteredWomen = values.data
      .filter((item) => item.amount_paid || item.bonus_amount)
      .map(item => ({
        woman_id: item.woman_id,
        amount_paid: item.amount_paid ?? undefined,
        bonus_amount: item.bonus_amount ?? undefined,
      }));

    createPayment.mutateAsync({ ...values, data: filteredWomen }).then(() => {
      setOpen(false);
    });
  };

  return ( 
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-[80vw]">
        {loadingWomen ? (
          <div className="flex flex-col">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SheetHeader>
                <SheetTitle>Ayollar oylik to'lovlari</SheetTitle>
                <SheetDescription>
                  Bu yerda siz yangi ayollar oylik to'lovini qo'sha olasiz
                </SheetDescription>
              </SheetHeader>
              <div className="mt-3 flex gap-3">
                <FormDatePicker
                  control={form.control}
                  name="date"
                  className="w-[300px]"
                />
              </div>
              <div className="grid gap-2 py-4">
                <ScrollArea className="h-[calc(100vh-250px)]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell className="max-w-[200px]">
                          Erkaklar
                        </TableCell>
                        <TableCell>Summa</TableCell>
                        <TableCell>Bonus Summa</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {women?.data.map((woman, womanIndex) => (
                        <TableRow key={womanIndex} className="">
                          <TableCell>{woman.name}</TableCell>
                          <TableCell>
                            <FormInput
                              control={form.control}
                              type="number"
                              name={`data.${womanIndex}.amount_paid`}
                            />
                          </TableCell>
                          <TableCell>
                            <FormInput
                              control={form.control}
                              type="number"
                              name={`data.${womanIndex}.bonus_amount`}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
        )}
      </SheetContent>
    </Sheet>
  );
};

export default AddPaymentWoman;
