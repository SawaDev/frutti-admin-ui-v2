import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import useMen from "@/hooks/useMen";
import useWorkDays from "@/hooks/useWorkDays";
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
import { createMonthlyPaymentSchema } from "./monthlyPayment.schema";
import { CreateMonthlyPaymentType } from "./monthlyPayment.type";

const AddMonthlyPayment: React.FC<SheetType> = ({ open, setOpen }) => {
  const { getAllMenQuery } = useMen();
  const { createMonthlyPaymentMutation } = useWorkDays();

  const { data: men, isLoading: loadingMen } = getAllMenQuery({
    salary_type: "monthly",
  });

  const createMonthlyPayment = createMonthlyPaymentMutation();

  const form = useForm<CreateMonthlyPaymentType>({
    resolver: zodResolver(createMonthlyPaymentSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (men) {
      const newMen = [];

      for (const man of men.data) {
        newMen.push({
          man_id: man.id,
          amount: undefined,
        });
      }

      form.reset({
        data: newMen,
      });
    }
  }, [men]);

  const onSubmit = (values: CreateMonthlyPaymentType) => {
    const filteredMen = values.data
      .filter((item) => item.amount)
      .map(item => ({
        man_id: item.man_id,
        amount: Number(item.amount)
      }));

    createMonthlyPayment.mutateAsync({ ...values, data: filteredMen }).then(() => {
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
                <SheetTitle>Ish kunini kiritish</SheetTitle>
                <SheetDescription>
                  Bu yerda siz yangi ish kunini qo'sha olasiz
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
                              name={`data.${manIndex}.amount`}
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

export default AddMonthlyPayment;
