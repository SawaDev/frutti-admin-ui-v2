import {
  ExtendedIngredient,
  UpdateIngredientPurchaseType,
} from "@/types/ingredients";
import React, { useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateIngredientPurchaseSchema } from "@/schema/ingredients";
import { purchaseOptions } from "@/constants/options";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/ui/button";
import useIngredients from "@/hooks/useIngredients";
import { FormInput } from "@/components/form/FormInput";

interface PurchaseIngredientTableType {
  editable?: boolean;
  data: ExtendedIngredient[] | undefined;
  purchaseId: number;
  handleClose: () => void;
}

const PurchaseIngredientTable: React.FC<PurchaseIngredientTableType> = ({
  editable,
  data,
  purchaseId,
  handleClose,
}) => {
  const { updateIngredientPurchaseMutation } = useIngredients();

  const updateIngredientPurchase = updateIngredientPurchaseMutation(purchaseId);

  const form = useForm<UpdateIngredientPurchaseType>({
    resolver: zodResolver(updateIngredientPurchaseSchema),
    defaultValues: {
      status: "finished",
      ingredients: [],
    },
  });

  useEffect(() => {
    data?.forEach((ingredient, index) => {
      form.setValue(`ingredients.${index}`, {
        id: ingredient.id,
        cost_per_unit: ingredient.purchase_cost_per_unit,
      });
    });
  }, [data]);

  const onSubmit = async (values: UpdateIngredientPurchaseType) => {
    await updateIngredientPurchase
      .mutateAsync(values)
      .then(() => handleClose());
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-3"
      >
        {editable && (
          <div className="flex items-center justify-around gap-3">
            <FormSelect
              control={form.control}
              name="status"
              options={purchaseOptions}
            />
            <Button>Saqlash</Button>
          </div>
        )}
        <Table>
          <ScrollArea
            className={`${data && data?.length > 10 ? "h-[80vh]" : ""} relative`}
          >
            <TableHeader className="sticky top-0 bg-white">
              <TableRow>
                <TableHead className="border-r-2 last:border-none">
                  Nomi
                </TableHead>
                <TableHead className="border-r-2 last:border-none">
                  Miqdori
                </TableHead>
                <TableHead className="border-r-2 last:border-none">
                  Narxi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.map((ingredient, index) => (
                <TableRow key={ingredient.id}>
                  <TableCell>{ingredient.name}</TableCell>
                  <TableCell>{ingredient.purchase_quantity}</TableCell>
                  <TableCell>
                    <FormInput
                      name={`ingredients.${index}.cost_per_unit`}
                      type="number"
                      control={form.control}
                      step={0.01}
                    />
                  </TableCell>
                </TableRow>
              ))}
              {data?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={99} className="h-24 text-center">
                    Hech narsa yo'q.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </ScrollArea>
        </Table>
      </form>
    </FormProvider>
  );
};

export default PurchaseIngredientTable;
