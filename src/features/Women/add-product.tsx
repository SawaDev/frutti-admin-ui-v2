import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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

const AddProduct: React.FC<SheetType> = ({ open, setOpen }) => {
  const { createWomanProductsMutation, getAllWomenQuery } = useWomen();
  const { getAllProductsQuery } = useProducts();

  const { data: women, isLoading: loadingWomen } = getAllWomenQuery();
  const { data: products, isLoading: loadingProducts } = getAllProductsQuery();

  const createWomanProducts = createWomanProductsMutation();

  const form = useForm<z.infer<typeof womanProductsSchema>>({
    resolver: zodResolver(womanProductsSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (women && products) {
      const newWomen = [];

      for (const woman of women.data) {
        const newProducts = [];

        for (const product of products.data) {
          newProducts.push({
            product_id: product.id,
            quantity: undefined,
          });
        }

        newWomen.push({
          woman_id: woman.id,
          products: newProducts,
        });
      }

      form.reset({
        women: newWomen,
      });
    }
  }, [women, products]);

  const onSubmit = (values: z.infer<typeof womanProductsSchema>) => {
    const filteredWomen = [];

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

    createWomanProducts.mutateAsync(filteredWomen).then(() => {
      setOpen(false);
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[98vw] sm:max-w-[98vw]">
        {loadingProducts || loadingWomen ? (
          <div className="flex flex-col">
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
              </SheetHeader>
              <div className="grid gap-2 py-4">
                <div className="relative">
                  {/* <div className="h-[calc(100vh-400px)] overflow-x-auto">
                    
                  </div> */}
                  <ScrollArea className="w-[110vw] h-[calc(100vh-180px)] whitespace-nowrap rounded-md border pr-[14vw]">
                    <div className="flex w-max flex-col relative">
                      <div className="flex gap-2 sticky top-0 border-b mb-1 z-10 bg-white transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <div className="!w-[200px] min-w-[200px] sticky left-0 h-12 px-4 flex justify-start items-center bg-white font-medium text-muted-foreground">Ayollar</div>
                        {products?.data.map((product, index) => (
                          <div
                            className="w-[140px] shrink-0 h-12 pr-4 flex justify-start items-center font-medium text-muted-foreground"
                            key={index}
                          >
                            {product.name} (
                            <span className="text-[12px] text-green-500">
                              {product.quantity}
                            </span>
                            )
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col pb-3">
                        {women?.data.map((woman, womanIndex) => (
                          <div className="flex flex-row relative gap-2 hover:bg-muted/50" key={womanIndex}>
                            <div className="!w-[200px] min-w-[200px] sticky left-0 h-12 px-4 flex justify-start items-center bg-white font-medium text-muted-foreground">
                              {woman.name}
                            </div>
                            {products?.data.map((_, productIndex) => (
                              <div
                                className="w-[140px] shrink-0 h-12 flex justify-start items-center font-medium text-muted-foreground"
                                key={productIndex}
                              >
                                <FormInput
                                  control={form.control}
                                  type="number"
                                  name={`women.${womanIndex}.products.${productIndex}.quantity`}
                                  className="w-full"
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

export default AddProduct;
