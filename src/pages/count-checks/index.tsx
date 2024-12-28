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
import useCountChecks from "@/features/CountChecks/useCountChecks";
import AddCountCheck from "@/features/CountChecks/add-count-check";

const CountChecks = () => {
  const [addCountCheck, setAddCountCheck] = useState<string | undefined>();

  const { getCountChecksQuery } = useCountChecks();

  const { data, isLoading, isError } = getCountChecksQuery();

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
              <CardTitle>Son tekshiruvi</CardTitle>
              <CardDescription>
                Son tekshiruvlarini bu yerdan boshqaring.
              </CardDescription>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setAddCountCheck("ingredient")}
                size="sm"
                variant="outline"
                className="gap-1 py-4"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Siryolar tekshiruvi
              </Button>
              <Button
                onClick={() => setAddCountCheck("product")}
                size="sm"
                variant="outline"
                className="gap-1 py-4"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Mahsulotlar tekshiruvi
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {/* <MonthlyPaymentsTable data={data} /> */}
          </CardContent>
        </Card>
      ) : (
        <NoItems setOpen={() => setAddCountCheck("product")} />
      )}
      <AddCountCheck
        open={!!addCountCheck}
        setOpen={() => setAddCountCheck(undefined)}
        item_type={addCountCheck as "product" | "ingredient"}
      />
    </>
  );
};

export default CountChecks;
