import React, { useEffect } from "react";
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
import { updateFeeSchema } from "@/schema/fees";
import { Fee, UpdateFeeType } from "@/types/fees";
import useFees from "@/hooks/useFees";
import { FormInput } from "@/components/form/FormInput";

interface EditFeeProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  fee?: Fee;
}

const EditFee: React.FC<EditFeeProps> = ({ open, setOpen, fee }) => {
  const { updateFeeMutation } = useFees();

  const updateFee = updateFeeMutation(fee?.id);

  const form = useForm<UpdateFeeType>({
    resolver: zodResolver(updateFeeSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (fee) {
      form.reset({
        amount: fee.amount,
      });
    }
  }, [fee, form]);

  const onSubmit = (values: UpdateFeeType) => {
    updateFee.mutateAsync(values).then(() => {
      form.reset();
      setOpen(false);
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>Jarimani tahrirlash</SheetTitle>
              <SheetDescription>
                Bu yerda siz jarimani tahrirlay olasiz
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="h-[calc(100vh-200px)]">
                <div className="ml-2 mr-3 mt-3 grid grid-rows-1 items-center gap-3">
                  <FormInput
                    control={form.control}
                    name="amount"
                    label="Summa"
                    placeholder="Summa"
                    type="number"
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
                  updateFee.isPending
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

export default EditFee; 