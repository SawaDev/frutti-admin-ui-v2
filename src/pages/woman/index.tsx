import { Download, MoreHorizontal, PlusCircle } from "lucide-react";
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
import useWomen from "@/hooks/useWomen";
import AddWoman from "@/features/Women/add-woman";
import { formatNumberComma } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const Women = () => {
  const [open, setOpen] = useState<number | undefined>(undefined);
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const navigate = useNavigate();

  const { getAllWomenQuery, deleteWomanMutation } = useWomen();

  const { data, isLoading, isError } = getAllWomenQuery();
  const deleteWoman = deleteWomanMutation(open);

  const handleDelete = async () => {
    await deleteWoman.mutateAsync().then(() => {
      setOpen(undefined);
    });
  };

  const handleDownload = async () => {
		try {
			window.open(`${import.meta.env.VITE_API_URL}/download/women`, '_blank')
		} catch (e) {
			console.error('Error while downloading excel file', e);
		}
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
              <CardTitle>Ayollar</CardTitle>
              <CardDescription>Ayollarni bu yerdan boshqaring.</CardDescription>
            </div>
            <div className="space-x-2">
              <Button onClick={handleDownload} size="sm" variant="outline" className="gap-1">
                <Download className="h-3.5 w-3.5" />
                Excelga yuklash
              </Button>
              <Button
                onClick={() => setOpenSheet(true)}
                size="sm"
                variant="outline"
                className="gap-1"
                >
                <PlusCircle className="h-3.5 w-3.5" />
                Ayol Qo'shish
              </Button>
            </div>
          </CardHeader>
          <CardContent className="m-3 rounded-lg border">
            <ScrollArea className="h-[calc(100vh-200px)]">
              <Table>
                <TableHeader className="sticky top-0 bg-white">
                  <TableRow>
                    <TableHead>Ismi</TableHead>
                    <TableHead>Balans</TableHead>
                    <TableHead>Ish joyi</TableHead>
                    <TableHead className="hidden md:table-cell">
                      Yaratilingan Sana
                    </TableHead>
                    <TableHead>
                      <span className="sr-only">Harakatlar</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.map((woman, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {woman.name}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            woman.balance > 0
                              ? "success"
                              : woman.balance == 0
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {formatNumberComma(woman.balance)}
                        </Badge>
                      </TableCell>
                      <TableCell>{woman.work_place === "work" ? "Ishxona" : "Uydan"}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        {format(woman.created_at, "dd-MM-yyyy HH:mm")}
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
                              onClick={() => navigate(`/women/${woman.id}`)}
                            >
                              O'zgartirish
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="focus:bg-red-100 focus:text-red-800"
                              onClick={() => setOpen(woman.id)}
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
            </ScrollArea>
          </CardContent>
          <Dialog
            open={open ? true : false}
            onOpenChange={() => setOpen(undefined)}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Siz ushbu ayolni o'chirmoqchimisiz?</DialogTitle>
                <DialogDescription>
                  Ayolni o'chirilgandan so'ng, ortga qaytarib bo'lmaydi!
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  disabled={deleteWoman.isPending}
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
      <AddWoman open={openSheet} setOpen={setOpenSheet} />
    </>
  );
};

export default Women;
