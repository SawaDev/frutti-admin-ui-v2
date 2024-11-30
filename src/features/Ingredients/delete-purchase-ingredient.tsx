import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useIngredients from "@/hooks/useIngredients";
import React from "react";

interface DeletePurchaseIngredientProps {
  open: number | undefined;
  setOpen: (value: number | undefined) => void;
}

const DeletePurchaseIngredient: React.FC<DeletePurchaseIngredientProps> = ({
  open,
  setOpen,
}) => {
  const { deletePurchaseIngredientMutation } = useIngredients();

  const deletePurchase = deletePurchaseIngredientMutation(open);

  return (
    <Dialog open={open ? true : false} onOpenChange={() => setOpen(undefined)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Siz ushbu ingredient haridini o'chirmoqchimisiz?</DialogTitle>
          <DialogDescription>
            Ingredient haridini o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={deletePurchase.isPending}
            variant={"destructive"}
            onClick={() => deletePurchase.mutateAsync()}
          >
            O'chirish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeletePurchaseIngredient;
