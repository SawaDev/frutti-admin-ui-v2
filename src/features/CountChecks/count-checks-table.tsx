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

import { GetCountChecksResponse } from "./count-checks.type";
import useCountChecks from "./useCountChecks";
import { Badge } from "@/components/ui/badge";

interface CountChecksTableType {
  data: GetCountChecksResponse | undefined;
}

const CollapsedRows: React.FC<{
  data: GetCountChecksResponse["data"][0]["count_checks"][0];
}> = ({ data }) => {
  const price =
    (data.actual_quantity - data.expected_quantity) *
    (data.total_price / data.actual_quantity);

  return (
    <TableRow className="p-0" key={data.id}>
      <TableCell className="p-2 px-4">
        {formatNumberComma(data.expected_quantity)}
      </TableCell>
      <TableCell className="p-2 px-4">
        {formatNumberComma(data.actual_quantity)}
      </TableCell>
      <TableCell className="p-2 px-4">
        <Badge variant={price > 0 ? "success" : "destructive"}>
          {formatNumberComma(price)}
        </Badge>
      </TableCell>
    </TableRow>
  );
};

const CountChecksTable: React.FC<CountChecksTableType> = ({ data }) => {
  const [deleteModal, setDeleteModal] = useState<{
    date: string;
    item_type: "product" | "ingredient";
  } | null>(null);
  const [saveModal, setSaveModal] = useState<{
    date: string;
    item_type: "product" | "ingredient";
  } | null>(null);

  const { deleteCountCheckMutation, updateCountCheckMutation } =
    useCountChecks();

  const deleteCountCheck = deleteCountCheckMutation();
  const updateCountCheck = updateCountCheckMutation();

  const handleDelete = () => {
    deleteCountCheck.mutateAsync(deleteModal).then(() => {
      setDeleteModal(null);
    });
  };

  const handleSave = () => {
    updateCountCheck.mutateAsync(saveModal).then(() => {
      setSaveModal(null);
    });
  };

  return (
    <div className="max-h-[70vh] overflow-auto rounded-md border">
      <Table id="table-main" className="min-w-full">
        <TableHeader>
          <TableRow className="sticky top-0 z-[2] bg-white">
            <TableHead>Sana</TableHead>
            <TableHead>Turi</TableHead>
            <TableHead>Statusi</TableHead>
            <TableHead>
              <span className="sr-only">Harakatlar</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.data ? (
            data.data.map((item, dateIndex) => (
              <Collapsible key={dateIndex} asChild>
                <>
                  <CollapsibleTrigger asChild>
                    <TableRow className="p-0">
                      <TableCell className="p-2 px-4">{item.date}</TableCell>
                      <TableCell className="p-2 px-4">
                        {item.item_type === "product" ? "Mahsulot" : "Siryo"}
                      </TableCell>
                      <TableCell className="p-2 px-4">
                        {item.status === "done"
                          ? "Saqlangan"
                          : "Eslab qolingan"}
                      </TableCell>
                      <TableCell className="w-16">
                        {item.status === "pending" ? (
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
                                className="focus:bg-green-100 focus:text-green-800"
                                onClick={() =>
                                  setSaveModal({
                                    date: item.date,
                                    item_type: item.item_type,
                                  })
                                }
                              >
                                Saqlash
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="focus:bg-red-100 focus:text-red-800"
                                onClick={() =>
                                  setDeleteModal({
                                    date: item.date,
                                    item_type: item.item_type,
                                  })
                                }
                              >
                                O'chirish
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <></>
                        )}
                      </TableCell>
                    </TableRow>
                  </CollapsibleTrigger>
                  <CollapsibleContent asChild>
                    {data?.data[dateIndex]?.count_checks &&
                      data?.data[dateIndex]?.count_checks?.length && (
                        <TableRow className="hover:bg-inherit">
                          <TableCell className="p-0 pl-6" colSpan={99}>
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Kutilgan Soni</TableHead>
                                  <TableHead>Hozirgi Soni</TableHead>
                                  <TableHead>Narxi</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {data?.data[dateIndex]?.count_checks?.map(
                                  (countCheck, countCheckIndex) => {
                                    return (
                                      <CollapsedRows
                                        data={countCheck}
                                        key={countCheckIndex}
                                      />
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
        {!!deleteModal && (
          <Dialog
            open={deleteModal ? true : false}
            onOpenChange={() => setDeleteModal(null)}
          >
            <DialogContent>
              <DialogTitle>Oylik to'lovni o'chirish</DialogTitle>
              <DialogDescription>
                Oylik to'lovni o'chirganingizdan so'ng uni qayta tiklab
                bo'lmaydi
              </DialogDescription>
              <DialogFooter>
                <Button
                  variant={"outline"}
                  onClick={() => setDeleteModal(null)}
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

        {!!saveModal && (
          <Dialog
            open={saveModal ? true : false}
            onOpenChange={() => setSaveModal(null)}
          >
            <DialogContent>
              <DialogTitle>Mahsulotlar sonini saqlash</DialogTitle>
              <DialogDescription>
                Mahsulotlar sonini saqlashni istasangiz, saqlash tugmasini
                bosing
              </DialogDescription>
              <DialogFooter>
                <Button variant={"outline"} onClick={() => setSaveModal(null)}>
                  Bekor qilish
                </Button>
                <Button onClick={handleSave}>Saqlash</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </Table>
    </div>
  );
};

export default CountChecksTable;
