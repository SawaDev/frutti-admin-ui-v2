import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import useProductWarehouses from "@/hooks/useProductWarehouses";
import useProducts from "@/hooks/useProducts";
import AddProductWarehouseDialog from "../ProductWarehouses/add-warehouse-dialog";
import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetType } from "@/types/other";
import { FormSearchInput } from "@/components/form/FormSearchInput";
import { CreateProductType } from "@/types/products";
import { createProductSchema } from "@/schema/products";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Product } from "@/types/products";

const AddProduct: FC<SheetType & { edit?: Product }> = ({
  open,
  setOpen,
  edit,
}) => {
  const [addWarehouse, setAddWarehouse] = useState(false);

  const { createProductMutation, updateProductMutation } = useProducts();
  const { getAllProductWarehousesQuery } = useProductWarehouses();

  const createProduct = createProductMutation();
  const updateProduct = updateProductMutation(
    edit?.id ? edit.id.toString() : undefined,
  );

  const { data: warehouses, isLoading: loadingWarehouses } =
    getAllProductWarehousesQuery();

  const form = useForm<CreateProductType>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      quantity: 0
    },
  });

  useEffect(() => {
    if (edit) {
      form.reset({
        ...edit,
        warehouse_id: edit.warehouse_id.toString(),
        bag_distribution: edit.bag_distribution ?? undefined,
      });
    } else {
      form.reset({});
    }
  }, [edit]);

  const onSubmit = (values: CreateProductType) => {
    const data = {
      ...values,
      warehouse_id: values.warehouse_id,
    };

    if (edit) {
      updateProduct.mutateAsync(data).then(() => {
        setOpen(false);
        form.reset();
      });
    } else {
      createProduct.mutateAsync(data).then(() => {
        setOpen(false);
        form.reset();
      });
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-[80vw]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <SheetHeader>
              <SheetTitle>
                {edit
                  ? "Mahsulot ma'lumotlarini o'zgratirish"
                  : "Yangi mahsulotni yaratish"}
              </SheetTitle>
              <SheetDescription>
                {edit
                  ? "Bu yerda siz mavjud mahsulot ma'lumotlarini o'zgaritira olasiz"
                  : "Bu yerda siz yangi mahsulot qo'sha olasiz"}
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-2 py-4">
              <ScrollArea className="mb-2 h-[calc(100vh-190px)]">
                <div className="ml-2 mr-3 mt-3 grid grid-rows-1 sm:grid-cols-2 items-center gap-3">
                  <FormInput
                    control={form.control}
                    name="name"
                    label={"Nomi"}
                  />
                  {!loadingWarehouses && warehouses?.data && (
                    <FormSearchInput
                      control={form.control}
                      name="warehouse_id"
                      options={warehouses?.data.map((warehouse) => ({
                        value: warehouse.id.toString(),
                        label: warehouse.name,
                      }))}
                      label="Sklad"
                      handleNew={() => setAddWarehouse(true)}
                      handleChange={(value) =>
                        form.setValue("warehouse_id", value)
                      }
                    />
                  )}
                  <FormInput
                    control={form.control}
                    name="quantity"
                    type="number"
                    label="Miqdori"
                  />
                  <FormInput
                    control={form.control}
                    name="price"
                    type="number"
                    label={"Narxi"}
                  />
                  <FormInput
                    control={form.control}
                    name="price_in_dollar"
                    type="number"
                    label={"Dollardagi narxi"}
                  />
                  <FormInput
                    control={form.control}
                    name="pure_price"
                    type="number"
                    label={"Tan narxi"}
                  />
                  <FormInput
                    control={form.control}
                    name="production_cost"
                    type="number"
                    label={"Ishlab chiqarish narxi"}
                  />
                  <FormInput
                    control={form.control}
                    name="home_production_cost"
                    type="number"
                    label={"Uyda ishlab chiqarish narxi"}
                  />
                  <FormInput
                    control={form.control}
                    name="man_sale_cost"
                    type="number"
                    label={"Erkaklar sotuvdan ulush summasi"}
                  />
                  <FormInput
                    control={form.control}
                    name="bag_distribution"
                    type="number"
                    label="Hajmi"
                  />
                </div>
              </ScrollArea>
            </div>
            <SheetFooter>
              <Button
                disabled={
                  !form.formState.isDirty ||
                  form.formState.isLoading ||
                  createProduct.isPending
                }
                type="submit"
              >
                Saqlash
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
      {addWarehouse && (
        <AddProductWarehouseDialog
          open={addWarehouse}
          setOpen={setAddWarehouse}
        />
      )}
    </Sheet>
  );
};

export default AddProduct;
