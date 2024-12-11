import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";

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
import usePayments from "@/hooks/usePayments";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const MenPayments = () => {
  const [deletePayment, setDeletePayment] = useState<number | undefined>(
    undefined,
  );

  const navigate = useNavigate();

  const { getAllPaymentsQuery, deletePaymentMutation } = usePayments();

  const { data, isLoading, isError } = getAllPaymentsQuery();
  const deletePaymentFunction = deletePaymentMutation(deletePayment);

  const handleDelete = async () => {
    await deletePaymentFunction.mutateAsync().then(() => {
      setDeletePayment(undefined);
    });
  };

  if (isLoading) return <>Loading...</>;
  if (isError) return <>Error</>;

  return (
    <Tabs>
      <TabsList>
        <TabsTrigger value="daily">Kunlik</TabsTrigger>
        <TabsTrigger value="monthly"></TabsTrigger>
      </TabsList>
      <TabsContent value="daily">
        {data?.data.length ? (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Oyliklar</CardTitle>
                <CardDescription>
                  Oyliklarni bu yerdan boshqaring.
                </CardDescription>
              </div>
              <Button
                // onClick={() => setDeletePaymentSheet(true)}
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
                      <TableCell className="font-medium">
                        {payment.id}
                      </TableCell>
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
                              onClick={() =>
                                navigate(`/payments/${payment.id}`)
                              }
                            >
                              O'zgartirish
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="focus:bg-red-100 focus:text-red-800"
                              onClick={() => setDeletePayment(payment.id)}
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
              open={deletePayment ? true : false}
              onOpenChange={() => setDeletePayment(undefined)}
            >
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>
                    Siz ushbu oylikni o'chirmoqchimisiz?
                  </DialogTitle>
                  <DialogDescription>
                    Oylikni o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    disabled={deletePaymentFunction.isPending}
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
          <></>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default MenPayments;
