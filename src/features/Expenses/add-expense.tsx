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
import useExpenses from "@/hooks/useExpenses";
import useWallets from "@/hooks/useWallets";
import { expenseSchema } from "@/schema/expenses";
import { Expense, ExpenseDataType } from "@/types/expenses";
import { SheetType } from "@/types/other";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import AddCategory from "../ExpenseCategories/add-category";

interface AddExpenseProps extends SheetType {
  expense?: Expense;
}

const AddExpense: React.FC<AddExpenseProps> = ({ open, setOpen, expense }) => {
  const [newCategory, setNewCategory] = useState(false);

  const {
    createExpenseMutation,
    updateExpenseMutation,
    getAllExpenseCategoriesQuery,
  } = useExpenses();
  const { getAllWalletsQuery } = useWallets();

  const createExpense = createExpenseMutation();
  const updateExpense = updateExpenseMutation(expense?.id);

  const { data: wallets, isLoading: loadingWallets } = getAllWalletsQuery();
  const { data: categories, isLoading: loadingCategories } =
    getAllExpenseCategoriesQuery();

  const form = useForm<ExpenseDataType>({
    resolver: zodResolver(expenseSchema),
    defaultValues: expense || {},
  });

  React.useEffect(() => {
    if (expense) {
      form.reset(expense);
    }
  }, [expense, form]);

  const onSubmit = (values: ExpenseDataType) => {
    const data = {
      ...values,
      wallet_id: Number(values.wallet_id),
      ...(values.category_id
        ? { category_id: Number(values.category_id) }
        : { category_id: null }),
    };

    const mutation = expense
      ? updateExpense.mutateAsync(data)
      : createExpense.mutateAsync(data);

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
                {expense ? "Harajatni tahrirlash" : "Yangi harajatni yaratish"}
              </SheetTitle>
              <SheetDescription>
                {expense
                  ? "Bu yerda siz harajatni tahrirlashingiz mumkin"
                  : "Bu yerda siz yangi harajatni qo'sha olasiz"}
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
                  {!loadingCategories && categories?.data && (
                    <FormSelect
                      control={form.control}
                      name="category_id"
                      options={categories?.data.map((categories) => ({
                        value: categories.id.toString(),
                        label: categories.name,
                      }))}
                      label="Kategoriya"
                      handleNew={() => setNewCategory(true)}
                    />
                  )}
                  <FormInput
                    control={form.control}
                    name="amount"
                    type="number"
                    label="Miqdor"
                  />
                  <FormInput
                    control={form.control}
                    name="comment"
                    label={"Kommentariya"}
                  />
                </div>
              </ScrollArea>
            </div>
            <SheetFooter>
              <Button
                disabled={
                  !form.formState.isDirty ||
                  form.formState.isLoading ||
                  createExpense.isPending ||
                  updateExpense.isPending
                }
                type="submit"
              >
                {expense ? "Yangilash" : "Saqlash"}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
      <AddCategory open={newCategory} setOpen={setNewCategory} />
    </Sheet>
  );
};

export default AddExpense;
