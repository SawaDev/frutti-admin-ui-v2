import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import useIngredients from "@/hooks/useIngredients";

interface DeleteIngredientTransactionProps {
  open: number | undefined;
  onOpenChange: (open: number | undefined) => void;
}

const DeleteIngredientTransaction: React.FC<
  DeleteIngredientTransactionProps
> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const { deleteIngredientTransactionMutation } = useIngredients();
  
  const deleteIngredientTransactionMutate =
    deleteIngredientTransactionMutation(open);

  const handleDelete = async () => {
    if (!open) return;

    try {
      await deleteIngredientTransactionMutate.mutateAsync();
      toast({
        title: "Muvaffaqiyatli o'chirildi",
        description: "Ingredient transaction muvaffaqiyatli o'chirildi",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Xatolik yuz berdi",
        description: "Ingredient transactionni o'chirishda xatolik yuz berdi",
      });
    } finally {
      onOpenChange(undefined);
    }
  };

  return (
    <Dialog open={!!open} onOpenChange={() => onOpenChange(undefined)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ishlab chiqarishni o'chirish</DialogTitle>
          <DialogDescription>
            Haqiqatan ham bu ishlab chiqarishni o'chirmoqchimisiz?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(undefined)}>
            Bekor qilish
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={deleteIngredientTransactionMutate.isPending}
          >
            {deleteIngredientTransactionMutate.isPending
              ? "O'chirilmoqda..."
              : "O'chirish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteIngredientTransaction;
