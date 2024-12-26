import { TableBody, TableCell } from "@/components/ui/table";
import { Table, TableHead, TableRow, TableHeader } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
  CardHeader,
} from "@/components/ui/card";
import { MoreHorizontal } from "lucide-react";

import DatePickerWithRange from "@/components/filters/date-range";
import { formatNumberComma } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  endOfDay,
  endOfMonth,
  format,
  startOfDay,
  startOfMonth,
} from "date-fns";
import {
  Dialog,
  DialogDescription,
  DialogHeader,
  DialogContent,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import usePayments from "./usePayments";
import { DateRange } from "react-day-picker";
import { Payment } from "./payments.type";
import EditPayment from "./edit-payment";

const WomanTab = () => {
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());

  const [editPayment, setEditPayment] = useState<Payment | undefined>();
  const [deleteModal, setDeleteModal] = useState<string | null>(null);
  const [date, setDate] = useState<{ from_date: string; to_date: string }>({
    from_date: format(currentMonthStart, "yyyy-MM-dd HH:mm:ss"),
    to_date: format(currentMonthEnd, "yyyy-MM-dd HH:mm:ss"),
  });

  const { deletePaymentMutation, getAllPaymentsQuery } = usePayments();

  const deletePayment = deletePaymentMutation(
    deleteModal ? Number(deleteModal) : null,
  );

  const { data: payments, isLoading: loadingPayments } = getAllPaymentsQuery({
    from_date: date.from_date,
    to_date: date.to_date,
    gender: "woman",
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDate((prev) => ({
      ...prev,
      from_date: range?.from
        ? format(startOfDay(range.from), "yyyy-MM-dd HH:mm:ss")
        : "",
      to_date: range?.to
        ? format(endOfDay(range.to), "yyyy-MM-dd HH:mm:ss")
        : "",
    }));
  };

  const handleDelete = () => {
    deletePayment.mutateAsync().then(() => {
      setDeleteModal(null);
    });
  };

  if (loadingPayments) return <>Loading...</>

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Ayollar oylik to'lovlari</CardTitle>
          <CardDescription>
            Ayollar oylik to'lovlarini bu yerdan boshqaring.
          </CardDescription>
        </div>
        <div className="space-x-2">
          <DatePickerWithRange onChange={handleDateChange} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Ismi</TableHead>
              <TableHead>Summa</TableHead>
              <TableHead className="hidden md:table-cell">
                To'langan sana
              </TableHead>
              <TableHead>
                <span className="sr-only">Harakatlar</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments?.data?.map((payment, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {payment.woman
                    ? payment.woman.name
                    : ""}
                </TableCell>
                <TableCell>{formatNumberComma(payment.amount_paid)}</TableCell>
                <TableCell className="hidden md:table-cell">
                  {payment.date}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Harakatlar</DropdownMenuLabel>
                      <DropdownMenuItem
                        className="focus:bg-blue-100 focus:text-blue-800"
                        onClick={() => setEditPayment(payment)}
                      >
                        O'zgartirish
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="focus:bg-red-100 focus:text-red-800"
                        onClick={() => setDeleteModal(payment.id.toString())}
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

      <EditPayment open={!!editPayment} setOpen={() => setEditPayment(undefined)} payment={editPayment} />

      <Dialog
        open={deleteModal ? true : false}
        onOpenChange={() => setDeleteModal(null)}
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
  );
};

export default WomanTab;
