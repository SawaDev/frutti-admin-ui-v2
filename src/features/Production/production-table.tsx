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
import { GetProductsProductionResponse } from "@/types/products";

interface ProductProductionTableType {
  data: GetProductsProductionResponse | undefined;
}

const CollapsedRows: React.FC<{
  data: GetProductsProductionResponse["data"][0]["products"][0];
}> = ({ data }) => {
  return (
    <Collapsible asChild>
      <>
        <CollapsibleTrigger asChild>
          <TableRow className="p-0" key={data.id}>
            <TableCell className="p-2 px-4">{data.name}</TableCell>
            <TableCell className="p-2 px-4">
              {formatNumberComma(data.total_count)}
            </TableCell>
            <TableCell className="p-2 px-4">
              {formatNumberComma(data.total_cost)}
            </TableCell>
            <TableCell className="p-2 px-4">
              {formatNumberComma(data.production_cost)}
            </TableCell>
          </TableRow>
        </CollapsibleTrigger>
        <CollapsibleContent asChild>
          <TableRow className="hover:bg-inherit">
            <TableCell className="p-0 pl-6" colSpan={99}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nomi</TableHead>
                    <TableHead>Soni</TableHead>
                    <TableHead>Summasi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.women?.map((woman, womanIndex) => {
                    return (
                      <TableRow key={womanIndex} className="p-0">
                        <TableCell className="p-2 px-4">{woman.name}</TableCell>
                        <TableCell className="p-2 px-4">
                          {formatNumberComma(woman.total_count)}
                        </TableCell>
                        <TableCell className="p-2 px-4">
                          {formatNumberComma(woman.total_cost)}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableCell>
          </TableRow>
        </CollapsibleContent>
      </>
    </Collapsible>
  );
};

const ProductProductionTable: React.FC<ProductProductionTableType> = ({
  data,
}) => {
  const [deleteModal, setDeleteModal] = useState<number>();

  const { deleteSaleMutation } = useSales();

  const deleteSale = deleteSaleMutation(deleteModal);

  const handleDelete = () => {
    deleteSale.mutateAsync().then(() => {
      setDeleteModal(undefined);
    });
  };

  return (
    <div className="max-h-[70vh] overflow-auto rounded-md border">
      <Table id="table-main" className="min-w-full">
        <TableHeader>
          <TableRow className="sticky top-0 z-[2] bg-white">
            <TableHead>Sana</TableHead>
            <TableHead>Umumiy Soni</TableHead>
            <TableHead>Umumiy Summasi</TableHead>
            <TableHead>
              <span className="sr-only">Harakatlar</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data ? (
            data.data.map((date, dateIndex) => (
              <Collapsible key={dateIndex} asChild>
                <>
                  <CollapsibleTrigger asChild>
                    <TableRow className="p-0">
                      <TableCell className="p-2 px-4">{date.date}</TableCell>
                      <TableCell className="p-2 px-4">
                        {formatNumberComma(date.total_count ?? null)}
                      </TableCell>
                      <TableCell className="p-2 px-4">
                        {formatNumberComma(date.total_cost ?? null)}
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
                              className="focus:bg-red-100 focus:text-red-800"
                              onClick={() => setDeleteModal(1)}
                            >
                              O'chirish
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  </CollapsibleTrigger>
                  <CollapsibleContent asChild>
                    {data?.data[dateIndex]?.products &&
                      data?.data[dateIndex]?.products?.length && (
                        <TableRow className="hover:bg-inherit">
                          <TableCell className="p-0 pl-6" colSpan={99}>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Nomi</TableHead>
                                  <TableHead>Soni</TableHead>
                                  <TableHead>Summasi</TableHead>
                                  <TableHead>Ishlab Chiqarish Narxi</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {data?.data[dateIndex]?.products?.map(
                                  (product, productIndex) => {
                                    return (
                                      <CollapsedRows
                                        data={product}
                                        key={productIndex}
                                      />
                                      // <Collapsible key={productIndex} asChild>
                                      //   <>
                                      //     <CollapsibleTrigger
                                      //       onClick={() => console.log("first")}
                                      //       asChild
                                      //     >
                                      //       <TableRow
                                      //         className="p-0"
                                      //       >
                                      //         <TableCell className="p-2 px-4">
                                      //           {product.name}
                                      //         </TableCell>
                                      //         <TableCell className="p-2 px-4">
                                      //           {formatNumberComma(
                                      //             product.total_count,
                                      //           )}
                                      //         </TableCell>
                                      //         <TableCell className="p-2 px-4">
                                      //           {formatNumberComma(
                                      //             product.total_cost,
                                      //           )}
                                      //         </TableCell>
                                      //         <TableCell className="p-2 px-4">
                                      //           {formatNumberComma(
                                      //             product.production_cost,
                                      //           )}
                                      //         </TableCell>
                                      //       </TableRow>
                                      //     </CollapsibleTrigger>
                                      //     <CollapsibleContent asChild>
                                      //       Hellloooo mather father
                                      //     </CollapsibleContent>
                                      //   </>
                                      // </Collapsible>
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
      </Table>
    </div>
  );
};

export default ProductProductionTable;
