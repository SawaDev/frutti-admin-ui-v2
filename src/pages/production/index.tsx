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
import { Skeleton } from "@/components/ui/skeleton";
import NoItems from "@/features/NoItems";
import AddProduct from "@/features/Women/add-product";
import useProducts from "@/hooks/useProducts";
import { endOfMonth, format, parse, startOfMonth } from "date-fns";
import ProductProductionTable from "@/features/Production/production-table";
import { DateRange } from "react-day-picker";
import DatePickerWithRange from "@/components/filters/date-range";

const Production = () => {
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());

  const [openSheet, setOpenSheet] = useState<boolean>(false);
  const [date, setDate] = useState<{ from_date: string; to_date: string }>({
    from_date: format(currentMonthStart, "dd-MM-yyyy"),
    to_date: format(currentMonthEnd, "dd-MM-yyyy"),
  });

  const { getProductsProduction } = useProducts();

  const { data, isLoading, isError } = getProductsProduction(date);

  const handleDateChange = (range: DateRange | undefined) => {
    setDate((prev) => ({
      ...prev,
      from_date: range?.from ? format(range.from, "dd-MM-yyyy") : "",
      to_date: range?.to ? format(range.to, "dd-MM-yyyy") : "",
    }));
  };

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
              <CardTitle>Ishlab chiqarish</CardTitle>
              <CardDescription>
                Ishlab chiqarishni bu yerdan boshqaring.
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="pr-4">
                <DatePickerWithRange
                  onChange={handleDateChange}
                  date={{
                    from: date.from_date
                      ? parse(date.from_date, "dd-MM-yyyy", new Date())
                      : undefined,
                    to: date.to_date
                      ? parse(date.to_date, "dd-MM-yyyy", new Date())
                      : undefined,
                  }}
                />
              </div>
              <Button
                onClick={() => setOpenSheet(true)}
                size="sm"
                variant="outline"
                className="gap-1 py-4"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Qo'shish
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ProductProductionTable data={data} />
          </CardContent>
        </Card>
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <AddProduct open={openSheet} setOpen={setOpenSheet} />
    </>
  );
};

export default Production;
