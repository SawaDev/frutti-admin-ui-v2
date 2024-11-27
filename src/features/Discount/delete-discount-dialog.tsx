import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface DeleteDiscountDialogProps {
  open: boolean;
  onOpenChange: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

const DeleteDiscountDialog = ({
  open,
  onOpenChange,
  onDelete,
  isDeleting,
}: DeleteDiscountDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Siz ushbu chegirmani o'chirmoqchimisiz?</DialogTitle>
          <DialogDescription>
            Chegirma o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button disabled={isDeleting} variant={"destructive"} onClick={onDelete}>
            O'chirish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDiscountDialog; 