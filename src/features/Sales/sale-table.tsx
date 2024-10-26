import React, { useState } from "react";
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
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { formatNumberComma } from "@/lib/utils";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useSales from "@/hooks/useSales";
import { format } from "date-fns";
import { GetAllSalesResponse } from "@/types/sales";
import AddSale from "./add-sale";

interface SaleTableType {
  data: GetAllSalesResponse | undefined;
}

const SaleTable: React.FC<SaleTableType> = ({ data }) => {
  const [deleteModal, setDeleteModal] = useState<number>();
  const [editSheet, setEditSheet] = useState<number | undefined>(undefined);

  const { deleteSaleMutation } = useSales();

  const deleteSale = deleteSaleMutation(deleteModal);

  const handleDelete = async () => {
    await deleteSale.mutateAsync().then(() => {
      setDeleteModal(undefined);
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Klient</TableHead>
          <TableHead>To'langan Summa</TableHead>
          <TableHead>Mahsulotning Summasi</TableHead>
          <TableHead>Kassa</TableHead>
          <TableHead>To'lov turi</TableHead>
          <TableHead>Aksiyami</TableHead>
          <TableHead>Savdo qilingan sana</TableHead>
          <TableHead>Yaratilingan sana</TableHead>
          <TableHead>
            <span className="sr-only">Harakatlar</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.data ? (
          data.data.map((sale, saleIndex) => (
            <Collapsible key={saleIndex} asChild>
              <>
                <CollapsibleTrigger asChild>
                  <TableRow>
                    <TableCell>{sale.client?.name}</TableCell>
                    <TableCell>
                      {formatNumberComma(sale.transaction?.amount ?? null)}
                    </TableCell>
                    <TableCell>
                      {formatNumberComma(sale.total_price ?? null)}
                    </TableCell>
                    <TableCell>{sale.transaction?.wallet.name}</TableCell>
                    <TableCell>
                      {sale.transaction?.type === "cash"
                        ? "Naqd pul"
                        : sale.transaction?.type === "card"
                          ? "Karta"
                          : ""}
                    </TableCell>
                    <TableCell className="p-2 px-4">
                      {sale.is_free ? "Ha" : "Yo'q"}
                    </TableCell>
                    <TableCell>{sale.date}</TableCell>
                    <TableCell>
                      {format(sale.created_at, "dd-MM-yyyy HH:mm:ss")}
                    </TableCell>
                    <TableCell className="w-16">
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
                            className="focus:bg-blue-100 focus:text-blue-800"
                            onClick={() => setEditSheet(sale.id)}
                          >
                            O'zgartirish
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="focus:bg-red-100 focus:text-red-800"
                            onClick={() => setDeleteModal(sale.id)}
                          >
                            O'chirish
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  {data?.data[saleIndex]?.products &&
                    data?.data[saleIndex]?.products?.length && (
                      <TableRow className="hover:bg-inherit">
                        <TableCell className="p-0 pl-6" colSpan={99}>
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>
                                  <div className="flex w-full items-center justify-between border-r-2 pr-2">
                                    Nomi
                                  </div>
                                </TableHead>
                                <TableHead>
                                  <div className="flex w-full items-center justify-between border-r-2 pr-2">
                                    Soni
                                  </div>
                                </TableHead>
                                <TableHead>
                                  <div className="flex w-full items-center justify-between border-r-2 pr-2">
                                    Narxi
                                  </div>
                                </TableHead>
                                <TableHead>
                                  <div className="flex w-full items-center justify-between border-r-2 pr-2">
                                    Umumiy Narx
                                  </div>
                                </TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {data?.data[saleIndex]?.products?.map(
                                (product) => {
                                  return (
                                    <TableRow className="p-0" key={product.id}>
                                      <TableCell className="p-2 px-4">
                                        {product.name}
                                      </TableCell>
                                      <TableCell className="p-2 px-4">
                                        {formatNumberComma(
                                          product.sale_quantity,
                                        )}
                                      </TableCell>
                                      <TableCell className="p-2 px-4">
                                        {formatNumberComma(product.sale_price)}
                                      </TableCell>
                                      <TableCell className="p-2 px-4">
                                        {formatNumberComma(
                                          product.sale_price *
                                            product.sale_quantity,
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  );
                                },
                              )}
                            </TableBody>
                          </Table>
                        </TableCell>
                      </TableRow>
                    )}
                </CollapsibleContent>
              </>
            </Collapsible>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={99} className="h-24 text-center">
              Hech narsa yo'q.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {deleteModal !== undefined && (
        <Dialog
          open={deleteModal ? true : false}
          onOpenChange={() => setDeleteModal(undefined)}
        >
          <DialogContent>
            <DialogTitle>Sotuvni o'chirish</DialogTitle>
            <DialogDescription>
              Sotuvni o'chirganingizdan so'ng uni qayta tiklab bo'lmaydi
            </DialogDescription>
            <DialogFooter>
              <Button
                variant={"outline"}
                onClick={() => setDeleteModal(undefined)}
              >
                Bekor qilish
              </Button>
              <Button variant={"destructive"} onClick={handleDelete}>
                O'chirish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <AddSale open={!!editSheet} setOpen={() => setEditSheet(undefined)} edit={editSheet}/>
    </Table>
  );
};

export default SaleTable;
