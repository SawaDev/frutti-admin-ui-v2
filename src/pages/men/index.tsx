import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import NoItems from "@/features/NoItems";
import { format } from "date-fns";
import { formatNumberComma } from "@/lib/utils";
import useMen from "@/hooks/useMen";
import AddMan from "@/features/Men/add-man";
import AddWorkDay from "@/features/Men/add-work-day";
import AddMonthlyPayment from "@/features/Men/add-montly-payment";

const Men = () => {
  const [open, setOpen] = useState<number | undefined>(undefined);
  const [addWorkDay, setAddWorkDay] = useState<boolean>(false);
  const [addMonthlyPayment, setAddMonthlyPayment] = useState<boolean>(false);
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const navigate = useNavigate();

  const { getAllMenQuery, deleteManMutation } = useMen();

  const { data, isLoading, isError } = getAllMenQuery({});
  const deleteMan = deleteManMutation(open);

  const handleDelete = async () => {
    await deleteMan.mutateAsync().then(() => {
      setOpen(undefined);
    });
  };

  if (isLoading) {
    return <>Loading...</>;
  }

  if (isError) {
    return <>Error</>;
  }

  return (
    <>
      {data?.data.length ? (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Erkaklar</CardTitle>
              <CardDescription>
                Erkaklarni bu yerdan boshqaring.
              </CardDescription>
            </div>
            <div className="space-x-2">
              <Button
                onClick={() => setAddMonthlyPayment(true)}
                size="sm"
                variant="outline"
                className="gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Oylikni qo'shish
              </Button>
              <Button
                onClick={() => setAddWorkDay(true)}
                size="sm"
                variant="outline"
                className="gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Ish kunini qo'shish
              </Button>
              <Button
                onClick={() => setOpenSheet(true)}
                size="sm"
                variant="outline"
                className="gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Erkak Qo'shish
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ismi</TableHead>
                  <TableHead>Balans</TableHead>
                  <TableHead>Oylik turi</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Yaratilingan Sana
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((man, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{man.name}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          man.balance > 0
                            ? "success"
                            : man.balance == 0
                              ? "outline"
                              : "destructive"
                        }
                      >
                        {formatNumberComma(man.balance)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {man.salary_type === "monthly"
                        ? "Oylik"
                        : man.salary_type === "daily"
                          ? "Kunlik"
                          : "Mahsulot bo'yicha"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(man.created_at, "dd-MM-yyyy hh:mm")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            aria-haspopup="true"
                            size="icon"
                            variant="ghost"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => navigate(`/men/${man.id}`)}
                          >
                            O'zgartirish
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="focus:bg-red-100 focus:text-red-800"
                            onClick={() => setOpen(man.id)}
                          >
                            O'chirish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <Dialog
            open={open ? true : false}
            onOpenChange={() => setOpen(undefined)}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Siz ushbu erkakni o'chirmoqchimisiz?</DialogTitle>
                <DialogDescription>
                  Erkakni o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  disabled={deleteMan.isPending}
                  variant={"destructive"}
                  onClick={handleDelete}
                >
                  O'chirish
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </Card>
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddMan open={openSheet} setOpen={setOpenSheet} />
      <AddWorkDay open={addWorkDay} setOpen={setAddWorkDay} />
      <AddMonthlyPayment open={addMonthlyPayment} setOpen={setAddMonthlyPayment} />
    </>
  );
};

export default Men;
