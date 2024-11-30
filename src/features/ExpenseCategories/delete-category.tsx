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

interface DeleteCategoryProps {
  open?: number;
  setOpen: (open: undefined) => void;
}

const DeleteCategory: React.FC<DeleteCategoryProps> = ({ open, setOpen }) => {
  const { deleteExpenseCategoryMutation } = useExpenses();
  const deleteCategory = deleteExpenseCategoryMutation(open);

  const handleDelete = () => {
    deleteCategory.mutateAsync().then(() => {
      setOpen(undefined);
    });
  };

  return (
    <Dialog open={!!open} onOpenChange={() => setOpen(undefined)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Kategoriyani o'chirish</DialogTitle>
          <DialogDescription>
            Haqiqatan ham ushbu kategoriyani o'chirmoqchimisiz?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant={"outline"} onClick={() => setOpen(undefined)}>
            Bekor qilish
          </Button>
          <Button
            onClick={handleDelete}
            disabled={deleteCategory.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteCategory.isPending ? "O'chirilmoqda..." : "O'chirish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCategory;
