import { FormInput } from "@/components/form/FormInput";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import useWarehouses from "@/hooks/useWarehouses";
import { createWarehouseSchema } from "@/schema/warehouses";
import {
  CreateWarehouse,
  GetSingleWarehouseResponse,
} from "@/types/warehouses";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumberComma, getUnit } from "@/lib/utils";

interface WarehouseDetailsProps {
  data: GetSingleWarehouseResponse["data"];
}

const WarehouseDetails: React.FC<WarehouseDetailsProps> = ({ data }) => {
  const params = useParams();
  const { updateWarehouseMutation, deleteWarehouseMutation } = useWarehouses();

  const updateWarehouse = updateWarehouseMutation(params.id);
  const deleteWarehouse = deleteWarehouseMutation(params.id);

  const navigate = useNavigate();

  const formDefaults = {
    name: data.name || "",
  };

  const form = useForm<CreateWarehouse>({
    resolver: zodResolver(createWarehouseSchema),
    defaultValues: formDefaults,
  });

  const onSubmit = async (values: CreateWarehouse) => {
    await updateWarehouse.mutateAsync(values);
  };

  const handleDelete = () => {
    deleteWarehouse.mutateAsync().then(() => navigate("/ingredient-warehouses"));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/ingredient-warehouses")}
              variant="outline"
              size="icon"
              className="h-7 w-7"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
              Sklad Ma'lumotlari
            </h1>
          </div>
          <div className="flex gap-3">
            <Dialog>
              <DialogTrigger>
                <Button size="sm" variant={"destructive"} type="button">
                  O'chirish
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogDescription>
                  Sklad o'chgandan so'ng unga bog'liq barcha ma'lumotlar ham
                  yo'q bo'ladi va ularni tiklab bo'lmaydi!
                </DialogDescription>
                <DialogFooter>
                  <DialogClose>
                    <Button>Bekor qilish</Button>
                  </DialogClose>
                  <DialogClose>
                    <Button
                      variant={"destructive"}
                      type="button"
                      onClick={handleDelete}
                    >
                      O'chirish
                    </Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button
              disabled={
                form.formState.isLoading ||
                !form.formState.isDirty ||
                updateWarehouse.isPending
              }
              type="submit"
              size="sm"
            >
              Saqlash
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Sklad haqida</CardTitle>
                <CardDescription>
                  Bu yerda siz ushbu sklad haqidagi asosiy ma'lumotlarni
                  o'zgartirishingiz mumkin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-5">
                  <FormInput control={form.control} name="name" label="Nomi" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        {(data.ingredients && data.ingredients.length > 0) && (
          <div className="mt-3 grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-3 lg:gap-8">
              <Card>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <div className="flex w-full items-center justify-between border-r-2 pr-2">
                            Nomi
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex w-full items-center justify-between border-r-2 pr-2">
                            Miqdori
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex w-full items-center justify-between border-r-2 pr-2">
                            Narxi
                          </div>
                        </TableHead>
                        <TableHead>
                          <div className="flex w-full items-center justify-between border-r-2 pr-2">
                            Pochkada
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.ingredients.map((ingredient) => (
                        <TableRow className="p-0" key={ingredient.id}>
                          <TableCell className="p-2 px-4">
                            {ingredient.name}
                          </TableCell>
                          <TableCell className="p-2 px-4">
                            {formatNumberComma(ingredient.quantity)}&nbsp;
                            {getUnit(ingredient.unit)}
                          </TableCell>
                          <TableCell className="p-2 px-4">
                            {formatNumberComma(ingredient.cost)}
                          </TableCell>
                          <TableCell className="p-2 px-4">
                            {formatNumberComma(ingredient.bags_count)} -{" "}
                            {formatNumberComma(
                              ingredient.bag_distribution ?? 0,
                            )}{" "}
                            dan
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
};

export default WarehouseDetails;
