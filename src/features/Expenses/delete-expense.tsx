import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useExpenses from "@/hooks/useExpenses";

interface DeleteExpenseProps {
  expenseId: number | undefined;
  setExpenseId: (id: number | undefined) => void;
}

const DeleteExpense: React.FC<DeleteExpenseProps> = ({ expenseId, setExpenseId }) => {
  const { deleteExpenseMutation } = useExpenses();
  const deleteExpense = deleteExpenseMutation(expenseId);

  const handleDelete = async () => {
    await deleteExpense.mutateAsync().then(() => {
      setExpenseId(undefined);
    });
  };

  return (
    <Dialog
      open={expenseId !== undefined}
      onOpenChange={() => setExpenseId(undefined)}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Siz ushbu harajatni o'chirmoqchimisiz?
          </DialogTitle>
          <DialogDescription>
            Harajatni o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={deleteExpense.isPending}
            variant="destructive"
            onClick={handleDelete}
          >
            O'chirish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteExpense; 