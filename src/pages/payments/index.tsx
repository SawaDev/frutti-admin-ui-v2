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
// import NoItems from "@/features/NoItems";
import { format } from "date-fns";
// import { formatNumberComma } from "@/lib/utils";
import usePayments from "@/hooks/usePayments";
// import AddPayment from "@/features/Payments/add-payment";

const Payments = () => {
  const [open, setOpen] = useState<number | undefined>(undefined);
  // const [openSheet, setOpenSheet] = useState<boolean>(false);

  const navigate = useNavigate();

  const { getAllPaymentsQuery, deletePaymentMutation } = usePayments();

  const { data, isLoading, isError } = getAllPaymentsQuery();
  const deletePayment = deletePaymentMutation(open);

  const handleDelete = async () => {
    await deletePayment.mutateAsync().then(() => {
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
              <CardTitle>To'lovlar</CardTitle>
              <CardDescription>
                To'lovlarni bu yerdan boshqaring.
              </CardDescription>
            </div>
            <Button
              // onClick={() => setOpenSheet(true)}
              size="sm"
              variant="outline"
              className="gap-1"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Qo'shish
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>To'lov Raqami</TableHead>
                  <TableHead>Summa</TableHead>
                  <TableHead>To'lov Turi</TableHead>
                  <TableHead className="hidden md:table-cell">Sana</TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((payment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{payment.id}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {/* {formatNumberComma(payment.amount)} */}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>{payment.type}</TableCell> */}
                    <TableCell className="hidden md:table-cell">
                      {format(payment.created_at, "dd-MM-yyyy hh:mm")}
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
                            onClick={() => navigate(`/payments/${payment.id}`)}
                          >
                            O'zgartirish
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="focus:bg-red-100 focus:text-red-800"
                            onClick={() => setOpen(payment.id)}
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
                <DialogTitle>Siz ushbu to'lovni o'chirmoqchimisiz?</DialogTitle>
                <DialogDescription>
                  To'lovni o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  disabled={deletePayment.isPending}
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
        // <NoItems setOpen={setOpenSheet} />
        <></>
      )}
      {/* <AddPayment open={openSheet} setOpen={setOpenSheet} /> */}
    </>
  );
};

export default Payments;
