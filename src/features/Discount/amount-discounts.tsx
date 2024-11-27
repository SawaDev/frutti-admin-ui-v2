import { PlusCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NoItems from "@/features/NoItems";
import useDiscounts from "@/hooks/useDiscounts";
import DiscountTable from "./discount-table";
import DeleteDiscountDialog from "./delete-discount-dialog";
import AddDiscount from "./add-discount";

const AmountDiscounts = () => {
  const [open, setOpen] = useState<number | undefined>(undefined);
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const { getAllDiscountsQuery, deleteDiscountMutation } = useDiscounts();

  const { data, isLoading, isError } = getAllDiscountsQuery();
  const deleteDiscount = deleteDiscountMutation(open);

  const handleDelete = async () => {
    await deleteDiscount.mutateAsync().then(() => {
      setOpen(undefined);
    });
  };

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <>
      {data?.data.length ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Chegirmalar</CardTitle>
              <CardDescription>
                Chegirmalarni bu yerdan boshqaring.
              </CardDescription>
            </div>
            <div className="space-x-2">
              <Button
                onClick={() => setOpenSheet(true)}
                size="sm"
                variant="outline"
                className="gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Qo'shish
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <DiscountTable
              data={data.data}
              onDelete={(id) => setOpen(id)}
            />
          </CardContent>
          <DeleteDiscountDialog
            open={open ? true : false}
            onOpenChange={() => setOpen(undefined)}
            onDelete={handleDelete}
            isDeleting={deleteDiscount.isPending}
          />
        </Card>
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      {openSheet && <AddDiscount open={openSheet} setOpen={setOpenSheet} />}
    </>
  );
};

export default AmountDiscounts; 