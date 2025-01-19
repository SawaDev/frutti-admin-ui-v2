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
import { CountCheck, CountCheckParams } from "./count-checks.type";
import useProducts from "@/hooks/useProducts";
import useCountChecks from "./useCountChecks";
import useIngredients from "@/hooks/useIngredients";
import { z } from "zod";

const UpdateCountCheck: React.FC<
  SheetType & { data: (CountCheckParams & { data: CountCheck[] }) }
> = ({ open, setOpen, data }) => {
  const { getAllProductsQuery } = useProducts();
  const { getAllIngredientsQuery } = useIngredients();
  const { updateCountCheckMutation } = useCountChecks();

  const updateCountCheck = updateCountCheckMutation();

  const { data: products, isLoading: loadingProducts } = getAllProductsQuery(
    data.item_type === "product",
  );
  const { data: ingredients, isLoading: loadingIngredients } =
    getAllIngredientsQuery(data.item_type === "ingredient");

  const formSchema = z.object({
    data: z.array(
      z.object({
        item_id: z.number(),
        actual_quantity: z.number().optional(),
        total_price: z.number().optional(),
      })
    ),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      data: [],
    },
  });

  useEffect(() => {
    if (products) {
      const newProducts = [];

      for (const product of products.data) {
        newProducts.push({
          item_id: product.id,
          actual_quantity: data.data.find(item => item.item_id === product.id)?.actual_quantity,
          total_price: data.data.find(item => item.item_id === product.id)?.total_price,
        });
      }

      form.reset({
        data: newProducts,
      });
    } else if (ingredients) {
      const newIngredients = [];

      for (const ingredient of ingredients.data) {
        newIngredients.push({
          item_id: ingredient.id,
          actual_quantity: data.data.find(item => item.item_id === ingredient.id)?.actual_quantity,
          total_price: data.data.find(item => item.item_id === ingredient.id)?.total_price,
        });
      }

      form.reset({
        data: newIngredients,
      });
    }
  }, [products, ingredients]);

  const onSubmit = (values: FormValues) => {
    const filteredProducts = values.data
      .filter((item) => item.actual_quantity && item.item_id)
      .map((item) => ({
        id: item.item_id,
        count: Number(item.actual_quantity),
        total_price: Number(item.total_price),
      }));

    updateCountCheck
      .mutateAsync({
        date: data.date,
        item_type: data.item_type,
        data: filteredProducts
      })
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
                <SheetTitle>Mahsulotlar sonini tekshiruvini o'zgartirish</SheetTitle>
                <SheetDescription>
                  Bu yerda siz mahsulotlar sonini tekshiruvini o'zgartirishingiz mumkin
                </SheetDescription>
              </SheetHeader>

              <div className="grid gap-2 py-4">
                <ScrollArea className="h-[calc(100vh-250px)]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableCell className="max-w-[200px]">
                          Mahsulotlar
                        </TableCell>
                        <TableCell>Hozirgi Soni</TableCell>
                        <TableCell>O'zgargan Soni</TableCell>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.item_type === "product"
                        ? products?.data.map((product, productIndex) => (
                            <TableRow key={productIndex} className="">
                              <TableCell>{product.name}</TableCell>
                              <TableCell>{product.quantity}</TableCell>
                              <TableCell>
                                <FormInput
                                  control={form.control}
                                  type="number"
                                  name={`data.${productIndex}.actual_quantity`}
                                  onChange={(value) => {
                                    form.setValue(
                                      `data.${productIndex}.actual_quantity`,
                                      Number(value),
                                    );
                                    form.setValue(
                                      `data.${productIndex}.total_price`,
                                      Number(value) * product.price,
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
                                <TableCell>{ingredient.quantity}</TableCell>
                                <TableCell>
                                  <FormInput
                                    control={form.control}
                                    type="number"
                                    name={`data.${ingredientIndex}.actual_quantity`}
                                    onChange={(value) => {
                                      form.setValue(
                                        `data.${ingredientIndex}.actual_quantity`,
                                        Number(value),
                                      );
                                      form.setValue(
                                        `data.${ingredientIndex}.total_price`,
                                        Number(value) * ingredient.cost,
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

export default UpdateCountCheck;
