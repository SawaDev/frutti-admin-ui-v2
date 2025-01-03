import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import useIngredients from "@/hooks/useIngredients";
import { useEffect } from "react";

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Kategoriya nomi 2 ta belgidan kam bo'lmasligi kerak",
  }),
});

interface EditCategoryProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: {
    id: number;
    name: string;
  } | undefined;
}

const EditCategory = ({ open, setOpen, category }: EditCategoryProps) => {
  const { updateIngredientCategoryMutation } = useIngredients();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  useEffect(() => {
    if (category) {
      form.reset({
        name: category.name,
      });
    }
  }, [category]);

  const updateCategory = updateIngredientCategoryMutation();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!category) return;
    
    await updateCategory.mutateAsync({
      id: category.id,
      ...values,
    }).then(() => {
      setOpen(false);
      form.reset();
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Kategoriyani tahrirlash</SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomi</FormLabel>
                  <FormControl>
                    <Input placeholder="Kategoriya nomi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={updateCategory.isPending} type="submit">
              Saqlash
            </Button>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
};

export default EditCategory;