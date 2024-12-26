import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { debounce } from "lodash";

import useWomen from "@/hooks/useWomen";
import useProducts from "@/hooks/useProducts";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { womanProductsSchema } from "@/schema/woman";
import { SheetType } from "@/types/other";
import { Skeleton } from "@/components/ui/skeleton";
import { z } from "zod";
import { FormDatePicker } from "@/components/form/FormDatePicker";
import { format } from "date-fns";

const AddProduct: React.FC<SheetType> = ({ open, setOpen }) => {
  const [isRendering, setIsRendering] = useState(true);
  const { createWomanProductsMutation, getAllWomenQuery } = useWomen();
  const { getAllProductsQuery } = useProducts();

  const { data: women, isLoading: loadingWomen } = getAllWomenQuery();
  const { data: products, isLoading: loadingProducts } = getAllProductsQuery();

  const createWomanProducts = createWomanProductsMutation();

  const form = useForm<z.infer<typeof womanProductsSchema>>({
    resolver: zodResolver(womanProductsSchema),
    defaultValues: {
      date: format(new Date(), "dd-MM-yyyy"),
    },
  });
  const [totalQuantities, setTotalQuantities] = useState<
    Record<number, { [key: number]: number; total: number }>
  >({});

  const handleQuantityChange = React.useCallback(
    (womanIndex: number, productIndex: number, newValue: number) => {
      const productId = products?.data[productIndex]?.id;
      const womanId = women?.data[womanIndex]?.id;

      if (!productId || !womanId) return;

      const newValueNum = Number(newValue) || 0;

      setTotalQuantities((prev) => {
        const productQuantities = { ...prev[productId] } || {};
        const oldValue = productQuantities[womanId] || 0;
        productQuantities[womanId] = newValueNum;

        return {
          ...prev,
          [productId]: {
            ...productQuantities,
            total: (productQuantities.total || 0) + newValueNum - oldValue,
          },
        };
      });

      form.setValue(
        `women.${womanIndex}.products.${productIndex}.quantity`,
        newValueNum,
      );
    },
    [products, women, form],
  );

  const debouncedHandleQuantityChange = debounce(
    (womanIndex: number, productIndex: number, newValue: number) => {
      handleQuantityChange(womanIndex, productIndex, newValue);
    },
    300,
  );

  const initialFormState = React.useMemo(() => {
    if (!women || !products) return undefined;

    return {
      women: women.data.map((woman) => ({
        woman_id: woman.id,
        products: products.data.map((product) => ({
          product_id: product.id,
          quantity: undefined,
        })),
      })),
    };
  }, [women, products]);

  useEffect(() => {
    if (initialFormState) {
      form.reset(initialFormState);
    }
  }, [initialFormState]);

  const onSubmit = (values: z.infer<typeof womanProductsSchema>) => {
    const filteredWomen = [];

    if (!values.date && values.women?.length < 0) {
      return;
    }
    const finalDate = values.date
      ? format(values.date, "dd-MM-yyyy")
      : format(new Date(), "dd-MM-yyyy");

    for (let i = 0; i < values.women.length; i++) {
      const newProducts = values.women[i].products.filter(
        (product) => product.quantity,
      );

      if (newProducts.length > 0) {
        filteredWomen.push({
          woman_id: values.women[i].woman_id,
          products: newProducts,
        });
      }
    }

    const finalData = {
      date: finalDate,
      women: filteredWomen,
    };

    createWomanProducts.mutateAsync(finalData).then(() => {
      setOpen(false);
    });
  };

  const MemoizedFormInput = React.memo(FormInput);

  useEffect(() => {
    if (open) {
      setIsRendering(true);
      // Use requestAnimationFrame to check after the next render
      requestAnimationFrame(() => {
        setIsRendering(false);
      });
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[98vw] sm:max-w-[98vw]">
        {loadingProducts || loadingWomen || isRendering ? (
          <div className="flex flex-col gap-2">
            <SheetHeader>
              <SheetTitle>Chiqarilgan mahsulotlarni kiritish</SheetTitle>
              <SheetDescription>Ma'lumotlar yuklanmoqda...</SheetDescription>
            </SheetHeader>
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-4 w-full" />
            ))}
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <SheetHeader>
                <SheetTitle>Chiqarilgan mahsulotlarni kiritish</SheetTitle>
                <SheetDescription>
                  Bu yerda siz yangi chiqarilgan mahsulotlarni qo'sha olasiz
                </SheetDescription>
                <FormDatePicker
                  control={form.control}
                  name="date"
                  label="Kunni kiriting"
                  className="max-w-[300px]"
                />
              </SheetHeader>
              <div className="grid gap-2 py-4">
                <div className="relative">
                  <ScrollArea className="h-[calc(100vh-260px)] w-[110vw] whitespace-nowrap rounded-md border pr-[14vw]">
                    <div className="relative flex w-max flex-col">
                      <div className="sticky top-0 z-10 mb-1 flex gap-2 border-b bg-white transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <div className="sticky left-0 flex h-12 !w-[200px] min-w-[200px] items-center justify-start bg-white px-4 font-medium text-muted-foreground">
                          Ayollar
                        </div>
                        {products?.data.map((product, index) => (
                          <div
                            className="flex h-12 w-[220px] shrink-0 items-center justify-start text-ellipsis pr-4 font-medium text-muted-foreground"
                            key={index}
                          >
                            <p className="max-w-[130px] overflow-clip text-ellipsis">
                              {product.name}
                            </p>{" "}
                            (
                            <span className="text-[12px]">
                              {product.quantity}
                            </span>
                            {totalQuantities[product.id]?.total > 0 && (
                              <span className="text-[12px] text-green-600">
                                +{totalQuantities[product.id]?.total || 0}
                              </span>
                            )}
                            )
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col pb-3">
                        {women?.data.map((woman, womanIndex) => (
                          <div
                            className="relative flex flex-row gap-2 hover:bg-muted/50"
                            key={womanIndex}
                          >
                            <div className="sticky left-0 flex h-12 !w-[200px] min-w-[200px] items-center justify-start bg-white px-4 font-medium text-muted-foreground">
                              {woman.name}
                            </div>
                            {products?.data.map((_, productIndex) => (
                              <div
                                className="flex h-12 w-[220px] shrink-0 items-center justify-start font-medium text-muted-foreground"
                                key={productIndex}
                              >
                                <MemoizedFormInput
                                  control={form.control}
                                  type="number"
                                  name={`women.${womanIndex}.products.${productIndex}.quantity`}
                                  className="w-full"
                                  onChange={(e) =>
                                    debouncedHandleQuantityChange(
                                      womanIndex,
                                      productIndex,
                                      Number(e.target.value),
                                    )
                                  }
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                </div>
              </div>
              <SheetFooter>
                <Button disabled={createWomanProducts.isPending} type="submit">
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

export default AddProduct;
