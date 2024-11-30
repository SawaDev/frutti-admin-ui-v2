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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import NoItems from "@/features/NoItems";
import useExpenses from "@/hooks/useExpenses";
import { format } from "date-fns";
import AddCategory from "@/features/ExpenseCategories/add-category";
import { ExpenseCategory } from "@/types/expenses";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import DeleteCategory from "@/features/ExpenseCategories/delete-category";

const ExpenseCategories = () => {
  const [addCategory, setAddCategory] = useState<boolean>(false);
  const [editCategory, setEditCategory] = useState<ExpenseCategory | undefined>(
    undefined,
  );
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | undefined>(
    undefined,
  );

  const { getAllExpenseCategoriesQuery } = useExpenses();
  const { data, isLoading, isError } = getAllExpenseCategoriesQuery();

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
              <CardTitle>Harajat turlari</CardTitle>
              <CardDescription>
                Harajat turlarini bu yerdan boshqaring.
              </CardDescription>
            </div>
            <div>
              <Button
                onClick={() => setAddCategory(true)}
                size="sm"
                variant="outline"
                className="gap-1"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Kategoriya qo'shish
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nomi</TableHead>
                  <TableHead>Yaratilgan sana</TableHead>
                  <TableHead className="sr-only">Amallar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data.map((expenseCategory) => (
                  <TableRow key={expenseCategory.id}>
                    <TableCell>{expenseCategory.name}</TableCell>
                    <TableCell>
                      {format(expenseCategory.created_at, "dd-MM-yyyy")}
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
                            className="focus:bg-blue-100 focus:text-blue-800"
                            onClick={() => setEditCategory(expenseCategory)}
                          >
                            O'zgartirish
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="focus:bg-red-100 focus:text-red-800"
                            onClick={() =>
                              setDeleteCategoryId(Number(expenseCategory.id))
                            }
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
        </Card>
      ) : (
        <NoItems setOpen={setAddCategory} />
      )}
      <AddCategory open={addCategory} setOpen={setAddCategory} />
      <AddCategory
        open={!!editCategory}
        setOpen={() => setEditCategory(undefined)}
        category={editCategory}
      />
      <DeleteCategory
        open={deleteCategoryId}
        setOpen={() => setDeleteCategoryId(undefined)}
      />
    </>
  );
};

export default ExpenseCategories;
