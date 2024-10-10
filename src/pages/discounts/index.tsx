import { MoreHorizontal, PlusCircle } from "lucide-react";
import { useState } from "react";

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
import useDiscounts from "@/hooks/useDiscounts";
import { Badge } from "@/components/ui/badge";
import AddDiscount from "@/features/Discount/add-discount";

const Discounts = () => {
  const [open, setOpen] = useState<number | undefined>(undefined);
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const { getAllDiscountsQuery, deleteDiscountMutation } = useDiscounts();

  const { data, isLoading, isError } = getAllDiscountsQuery();
  const deleteDiscount = deleteDiscountMutation(open);

  const handleDelete = async () => {
    await deleteDiscount.mutateAsync().then(() => {
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
              <CardTitle>Chegirmalar</CardTitle>
              <CardDescription>
                Chegirmalarni bu yerdan boshqaring.
              </CardDescription>
            </div>
            <div className="space-x-2">
              <Button
                onClick={() => setOpenSheet(true)}
                size="sm"
                variant="outline"
                className="gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Qo'shish
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Klient</TableHead>
                  <TableHead>Turi</TableHead>
                  <TableHead>Chegirma qiymati</TableHead>
                  <TableHead>Chegirmadan oldingi balans</TableHead>
                  <TableHead>Chegirmadan keyingi balans</TableHead>
                  <TableHead>Chegirma summasi</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Yaratilingan Sana
                  </TableHead>
                  <TableHead>
                    <span className="sr-only">Harakatlar</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.map((discount, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {discount.client?.name}
                    </TableCell>
                    <TableCell>
                      {discount.type === "percentage" ? (
                        <Badge variant={"success"}>Foiz</Badge>
                      ) : (
                        <Badge variant={"secondary"}>Summa</Badge>
                      )}
                    </TableCell>
                    <TableCell>{formatNumberComma(discount.value)}</TableCell>
                    <TableCell>
                      {formatNumberComma(discount.balance_before)}
                    </TableCell>
                    <TableCell>
                      {formatNumberComma(discount.balance_after)}
                    </TableCell>
                    <TableCell>
                      {formatNumberComma(
                        (discount.balance_after ?? 0) -
                          (discount.balance_before ?? 0),
                      )}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {format(discount.created_at, "dd-MM-yyyy hh:mm")}
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
                            className="focus:bg-red-100 focus:text-red-800"
                            onClick={() => setOpen(discount.id)}
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
                <DialogTitle>
                  Siz ushbu chegirmani o'chirmoqchimisiz?
                </DialogTitle>
                <DialogDescription>
                  Chegirma o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  disabled={deleteDiscount.isPending}
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
      {openSheet && <AddDiscount open={openSheet} setOpen={setOpenSheet} />}
    </>
  );
};

export default Discounts;
