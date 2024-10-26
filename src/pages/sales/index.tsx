import { PlusCircle } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import NoItems from "@/features/NoItems";
import AddSale from "@/features/Sales/add-sale";
import useSales from "@/hooks/useSales";
import { Skeleton } from "@/components/ui/skeleton";
import SaleTable from "@/features/Sales/sale-table";

const Sales = () => {
  const [openSheet, setOpenSheet] = useState<boolean>(false);

  const { getAllSalesQuery } = useSales();

  const { data, isLoading, isError } = getAllSalesQuery();

  if (isLoading) {
    return (
      <div className="flex w-full flex-col">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="h-[20px] w-full" />
        ))}
      </div>
    );
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
              <CardTitle>Sotuvlar</CardTitle>
              <CardDescription>
                Sotuvlarni bu yerdan boshqaring.
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
            <SaleTable data={data} />
          </CardContent>
        </Card>
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      {openSheet && <AddSale open={openSheet} setOpen={setOpenSheet} />}
    </>
  );
};

export default Sales;
