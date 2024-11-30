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
import { updateBonusSchema } from "@/schema/bonuses";
import { Bonus, UpdateBonusType } from "@/types/bonuses";
import useBonuses from "@/hooks/useBonuses";
import { FormInput } from "@/components/form/FormInput";

interface EditBonusProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  bonus?: Bonus;
}

const EditBonus: React.FC<EditBonusProps> = ({ open, setOpen, bonus }) => {
  const { updateBonusMutation } = useBonuses();

  const updateBonus = updateBonusMutation(bonus?.id);

  const form = useForm<UpdateBonusType>({
    resolver: zodResolver(updateBonusSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (bonus) {
      form.reset({
        amount: bonus.amount,
      });
    }
  }, [bonus, form]);

  const onSubmit = (values: UpdateBonusType) => {
    updateBonus.mutateAsync(values).then(() => {
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
              <SheetTitle>Bonusni tahrirlash</SheetTitle>
              <SheetDescription>
                Bu yerda siz bonusni tahrirlay olasiz
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
                  updateBonus.isPending
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

export default EditBonus;
