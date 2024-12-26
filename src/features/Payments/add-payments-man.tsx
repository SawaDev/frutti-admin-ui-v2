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
import usePayments from "./usePayments";
import useMen from "@/hooks/useMen";

const AddPaymentMan: React.FC<SheetType & { salary_type: string }> = ({
  open,
  setOpen,
  salary_type,
}) => {
  const { getAllMenQuery } = useMen();
  const { createPaymentMutation } = usePayments();

  const { data: men, isLoading: loadingMen } = getAllMenQuery({
    salary_type: salary_type,
  });

  const createPayment = createPaymentMutation();

  const form = useForm<CreatePaymentType>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (men) {
      const newMen = [];

      for (const man of men.data) {
        newMen.push({
          man_id: man.id,
          amount_paid: undefined,
          bonus_amount: undefined,
        });
      }

      form.reset({
        data: newMen,
      });
    }
  }, [men]);

  const onSubmit = (values: CreatePaymentType) => {
    const filteredMen = values.data
      .filter((item) => item.amount_paid || item.bonus_amount)
      .map((item) => ({
        man_id: item.man_id,
        amount_paid: item.amount_paid ?? undefined,
        bonus_amount: item.bonus_amount ?? undefined,
      }));

    createPayment.mutateAsync({ ...values, data: filteredMen }).then(() => {
      setOpen(false);
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-[80vw]">
        {loadingMen ? (
          <div className="flex flex-col">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SheetHeader>
                <SheetTitle>Erkaklar oylik to'lovlari</SheetTitle>
                <SheetDescription>
                  Bu yerda siz yangi erkaklar oylik to'lovini qo'sha olasiz
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
                      {men?.data.map((man, manIndex) => (
                        <TableRow key={manIndex} className="">
                          <TableCell>{man.name}</TableCell>
                          <TableCell>
                            <FormInput
                              control={form.control}
                              type="number"
                              name={`data.${manIndex}.amount_paid`}
                            />
                          </TableCell>
                          <TableCell>
                            <FormInput
                              control={form.control}
                              type="number"
                              name={`data.${manIndex}.bonus_amount`}
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

export default AddPaymentMan;
