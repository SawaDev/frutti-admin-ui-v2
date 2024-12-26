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
import { endOfMonth, format, parse, startOfMonth } from "date-fns";
import { DateRange } from "react-day-picker";
import DatePickerWithRange from "@/components/filters/date-range";
import { useRouterState } from "@/hooks/custom/useRouterState";
import useMonthlyPayments from "@/features/MonthlyPayments/useMonthlyPayments";
import AddMonthlyPayment from "@/features/MonthlyPayments/add-montly-payment";
import MonthlyPaymentsTable from "@/features/MonthlyPayments/monthly-payments-table";

const MonthlyPayments = () => {
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());

  const [date, setDate] = useRouterState<{ from_date: string; to_date: string }>("dates", {
    from_date: format(currentMonthStart, "yyyy-MM-dd"),
    to_date: format(currentMonthEnd, "yyyy-MM-dd"),
  })

  const [addMonthlyPayment, setAddMonthlyPayment] = useState<boolean>(false);

  const { getMonthlyPaymentsQuery } = useMonthlyPayments();

  const { data, isLoading, isError } = getMonthlyPaymentsQuery({
    from_date: date.from_date,
    to_date: date.to_date,
  });

  const handleDateChange = (range: DateRange | undefined) => {
    setDate((prev) => ({
      ...prev,
      from_date: range?.from ? format(range.from, "yyyy-MM-dd") : "",
      to_date: range?.to ? format(range.to, "yyyy-MM-dd") : "",
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
      {data?.data ? (
        <Card className="m-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Oylik to'lovlar</CardTitle>
              <CardDescription>
                Oylik to'lovlarini bu yerdan boshqaring.
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <div className="pr-4">
                <DatePickerWithRange
                  onChange={handleDateChange}
                  date={{
                    from: date.from_date
                      ? parse(date.from_date, "yyyy-MM-dd", new Date())
                      : undefined,
                    to: date.to_date
                      ? parse(date.to_date, "yyyy-MM-dd", new Date())
                      : undefined,
                  }}
                />
              </div>
              <Button
                onClick={() => setAddMonthlyPayment(true)}
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
            <MonthlyPaymentsTable data={data} />
          </CardContent>
        </Card>
      ) : (
        <NoItems setOpen={setAddMonthlyPayment} />
      )}
      <AddMonthlyPayment open={addMonthlyPayment} setOpen={setAddMonthlyPayment} />
    </>
  );
};

export default MonthlyPayments;
