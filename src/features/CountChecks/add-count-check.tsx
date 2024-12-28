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
import { createCountCheckSchema } from "./count-check.schame";
import { CreateCountCheckType } from "./count-checks.type";
import useProducts from "@/hooks/useProducts";
import useCountChecks from "./useCountChecks";
import { FormSelect } from "@/components/form/FormSelect";
import useIngredients from "@/hooks/useIngredients";
import { format } from "date-fns";

const AddMonthlyPayment: React.FC<
  SheetType & { item_type: "product" | "ingredient" }
> = ({ open, setOpen, item_type }) => {
  const { getAllProductsQuery } = useProducts();
  const { getAllIngredientsQuery } = useIngredients();
  const { createCountCheckMutation } = useCountChecks();

  const createCountCheck = createCountCheckMutation();

  const { data: products, isLoading: loadingProducts } = getAllProductsQuery(
    item_type === "product",
  );
  const { data: ingredients, isLoading: loadingIngredients } =
    getAllIngredientsQuery(item_type === "ingredient");

  const form = useForm<CreateCountCheckType>({
    resolver: zodResolver(createCountCheckSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (products) {
      const newProducts = [];

      for (const product of products.data) {
        newProducts.push({
          item_id: product.id,
          actual_quantity: undefined,
          total_price: undefined,
        });
      }

      form.reset({
        data: newProducts,
        item_type,
        status: "done",
        date: format(new Date(), "yyyy-MM-dd"),
      });
    } else if (ingredients) {
      const newIngredients = [];

      for (const ingredient of ingredients.data) {
        newIngredients.push({
          item_id: ingredient.id,
          actual_quantity: undefined,
          total_price: undefined,
        });
      }

      form.reset({
        data: newIngredients,
        item_type,
        status: "done",
        date: format(new Date(), "yyyy-MM-dd"),
      });
    }
  }, [products, ingredients]);

  const onSubmit = (values: CreateCountCheckType) => {
    const filteredProducts = values.data
      .filter((item) => item.actual_quantity && item.item_id)
      .map((item) => ({
        item_type: values.item_type,
        status: values.status,
        item_id: item.item_id,
        actual_quantity: Number(item.actual_quantity),
        total_price: Number(item.total_price),
      }));

    createCountCheck
      .mutateAsync({ date: values.date, data: filteredProducts })
      .then(() => {
        setOpen(false);
        form.reset();
      });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-[80vw]">
        {loadingProducts || loadingIngredients ? (
          <div className="flex flex-col">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SheetHeader>
                <SheetTitle>Mahsulotlar sonini kiritish</SheetTitle>
                <SheetDescription>
                  Bu yerda siz mahsulotlar sonini kiritishingiz mumkin
                </SheetDescription>

                <div className="mt-3 flex gap-3">
                  <FormSelect
                    control={form.control}
                    name={`status`}
                    options={[
                      { label: "Saqlash", value: "done" },
                      { label: "Eslab qolish", value: "pending" },
                    ]}
                  />
                  <FormDatePicker
                    control={form.control}
                    name="date"
                    className="w-[300px]"
                  />
                </div>
              </SheetHeader>

              <div className="grid gap-2 py-4">
                <ScrollArea className="h-[calc(100vh-250px)]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell className="max-w-[200px]">
                          Mahsulotlar
                        </TableCell>
                        <TableCell>Soni</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {item_type === "product"
                        ? products?.data.map((product, productIndex) => (
                            <TableRow key={productIndex} className="">
                              <TableCell>{product.name}</TableCell>
                              <TableCell>
                                <FormInput
                                  control={form.control}
                                  type="number"
                                  name={`data.${productIndex}.actual_quantity`}
                                  onChange={(e) => {
                                    form.setValue(
                                      `data.${productIndex}.actual_quantity`,
                                      Number(e.target.value),
                                    );
                                    form.setValue(
                                      `data.${productIndex}.total_price`,
                                      Number(e.target.value) * product.price,
                                    );
                                  }}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        : ingredients?.data.map(
                            (ingredient, ingredientIndex) => (
                              <TableRow key={ingredientIndex} className="">
                                <TableCell>{ingredient.name}</TableCell>
                                <TableCell>
                                  <FormInput
                                    control={form.control}
                                    type="number"
                                    name={`data.${ingredientIndex}.actual_quantity`}
                                    onChange={(e) => {
                                      form.setValue(
                                        `data.${ingredientIndex}.total_price`,
                                        Number(e.target.value) *
                                          ingredient.cost,
                                      );
                                    }}
                                  />
                                </TableCell>
                              </TableRow>
                            ),
                          )}
                    </TableBody>
                  </Table>
                </ScrollArea>
              </div>
              <SheetFooter>
                <Button
                  disabled={
                    form.formState.isDirty &&
                    form.formState.isSubmitting &&
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
