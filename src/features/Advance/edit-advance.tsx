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
import { updateAdvanceSchema } from "@/schema/advances";
import { Advance, UpdateAdvanceType } from "@/types/advances";
import useAdvances from "@/hooks/useAdvances";
import { FormInput } from "@/components/form/FormInput";

interface EditAdvanceProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  advance?: Advance;
}

const EditAdvance: React.FC<EditAdvanceProps> = ({ open, setOpen, advance }) => {
  const { updateAdvanceMutation } = useAdvances();

  const updateAdvance = updateAdvanceMutation(advance?.id);

  const form = useForm<UpdateAdvanceType>({
    resolver: zodResolver(updateAdvanceSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (advance) {
      form.reset({
        amount: advance.amount,
      });
    }
  }, [advance, form]);

  const onSubmit = (values: UpdateAdvanceType) => {
    updateAdvance.mutateAsync(values).then(() => {
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
              <SheetTitle>Avansni tahrirlash</SheetTitle>
              <SheetDescription>
                Bu yerda siz avansni tahrirlay olasiz
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
                  updateAdvance.isPending
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

export default EditAdvance;
