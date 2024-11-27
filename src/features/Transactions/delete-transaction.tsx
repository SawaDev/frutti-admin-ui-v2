import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import useTransactions from "@/hooks/useTransactions";

interface DeleteTransactionProps {
  open: number | undefined;
  setOpen: (value: number | undefined) => void;
}

const DeleteTransaction: React.FC<DeleteTransactionProps> = ({ open, setOpen }) => {
  const { deleteTransactionMutation } = useTransactions();
  const deleteTransaction = deleteTransactionMutation(open);

  const handleDelete = async () => {
    await deleteTransaction.mutateAsync().then(() => {
      setOpen(undefined);
    });
  };

  return (
    <Dialog open={open ? true : false} onOpenChange={() => setOpen(undefined)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Siz ushbu pul o'tkazmani o'chirmoqchimisiz?</DialogTitle>
          <DialogDescription>
            Pul o'tkazma o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            disabled={deleteTransaction.isPending}
            variant={"destructive"}
            onClick={handleDelete}
          >
            O'chirish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteTransaction; 