import { Link } from "react-router-dom";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";

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
import useStatistics from "@/hooks/useStatistics";
import { Skeleton } from "@/components/ui/skeleton";
import { formatNumberComma } from "@/lib/utils";

const Daashboard = () => {
  const { getStatisticsQuery } = useStatistics();

  const {
    data: statistics,
    isLoading: laodingStatistics,
    isFetching: fetchingStatistics,
  } = getStatisticsQuery();

  if (laodingStatistics || fetchingStatistics) {
    return (
      <div className="h-full w-full space-y-6 p-4">
        <div className="flex w-full flex-row gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[120px] w-full" />
          ))}
        </div>
        <div className="flex w-full flex-row gap-6">
          <Skeleton className="h-[60vh] basis-3/5" />
          <Skeleton className="h-[60vh] basis-2/5" />
        </div>
      </div>
    );
  }

  if (!statistics) {
    return "Something went wrong!";
  }

  const monthlyStats =
    statistics.data.monthly.length === 2
      ? {
          total_transactions: statistics.data.monthly[1]?.total_transactions,
          transactions_change:
            statistics.data.monthly[0]?.total_transactions === 0
              ? "+" + statistics.data.monthly[1]?.total_transactions
              : statistics.data.monthly[1]?.total_transactions /
                    statistics.data.monthly[0]?.total_transactions >
                  1
                ? "+" +
                  (
                    (statistics.data.monthly[1]?.total_transactions /
                      statistics.data.monthly[0]?.total_transactions -
                      1) *
                    100
                  ).toFixed(2)
                : "-" +
                  (
                    (1 -
                      statistics.data.monthly[1]?.total_transactions /
                        statistics.data.monthly[0]?.total_transactions) *
                    100
                  ).toFixed(2),
          total_net_profit: statistics.data.monthly[1]?.total_net_profit,
          net_profit_change:
            statistics.data.monthly[0]?.total_net_profit === 0
              ? "+" + statistics.data.monthly[1]?.total_net_profit
              : statistics.data.monthly[1]?.total_net_profit /
                    statistics.data.monthly[0]?.total_net_profit >
                  1
                ? "+" +
                  (
                    (statistics.data.monthly[1]?.total_net_profit /
                      statistics.data.monthly[0]?.total_net_profit -
                      1) *
                    100
                  ).toFixed(2)
                : "-" +
                  (
                    (1 -
                      statistics.data.monthly[1]?.total_net_profit /
                        statistics.data.monthly[0]?.total_net_profit) *
                    100
                  ).toFixed(2),
          total_product_quantity:
            statistics.data.monthly[1]?.total_product_quantity,
          product_quantity_change:
            statistics.data.monthly[0]?.total_product_quantity === 0
              ? "+" + statistics.data.monthly[1]?.total_product_quantity
              : statistics.data.monthly[1]?.total_product_quantity /
                    statistics.data.monthly[0]?.total_product_quantity >
                  1
                ? "+" +
                  (
                    (statistics.data.monthly[1]?.total_product_quantity /
                      statistics.data.monthly[0]?.total_product_quantity -
                      1) *
                    100
                  ).toFixed(2)
                : "-" +
                  (
                    (1 -
                      statistics.data.monthly[1]?.total_product_quantity /
                        statistics.data.monthly[0]?.total_product_quantity) *
                    100
                  ).toFixed(2),
          total_price: statistics.data.monthly[1]?.total_price,
          price_change:
            statistics.data.monthly[0]?.total_price === 0
              ? "+" + statistics.data.monthly[1]?.total_price
              : statistics.data.monthly[1]?.total_price /
                    statistics.data.monthly[0]?.total_price >
                  1
                ? "+" +
                  (
                    (statistics.data.monthly[1]?.total_price /
                      statistics.data.monthly[0]?.total_price -
                      1) *
                    100
                  ).toFixed(2)
                : "-" +
                  (
                    (1 -
                      statistics.data.monthly[1]?.total_price /
                        statistics.data.monthly[0]?.total_price) *
                    100
                  ).toFixed(2),
        }
      : {
          total_transactions: statistics.data.monthly[0]?.total_transactions,
          transactions_change: 0,
          total_net_profit: statistics.data.monthly[0]?.total_net_profit,
          net_profit_change: 0,
          total_product_quantity:
            statistics.data.monthly[0]?.total_product_quantity,
          product_quantity_change: 0,
          total_price: statistics.data.monthly[0]?.total_price,
          price_change: 0,
        };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Link to={"sales"}>
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sof Foyda</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumberComma(monthlyStats.total_net_profit)}
              </div>
              {monthlyStats.net_profit_change ? (
                <p className="text-xs text-muted-foreground">
                  {monthlyStats.net_profit_change}% Ohirgi oyga nisbatan
                </p>
              ) : (
                <></>
              )}
            </CardContent>
          </Card>
        </Link>

        <Link to={"sales"}>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Qilingan Savdo
              </CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumberComma(monthlyStats.total_price)}
              </div>
              <p className="text-xs text-muted-foreground">
                {monthlyStats.price_change}% Ohirgi oyga nisbatan
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to={"transactions"}>
          <Card x-chunk="dashboard-01-chunk-1">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pul O'tkazmalari
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumberComma(monthlyStats?.total_transactions)}
              </div>
              <p className="text-xs text-muted-foreground">
                {monthlyStats?.transactions_change}% Ohirgi oyga nisbatan
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link to={"sales"}>
          <Card x-chunk="dashboard-01-chunk-3">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Sotilgan Mahsulotlar
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumberComma(monthlyStats.total_product_quantity)}
              </div>
              <p className="text-xs text-muted-foreground">
                {monthlyStats.product_quantity_change}% Ohirgi oyga nisbatan
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-3 md:gap-8">
        <Link to={"clients"}>
          <Card x-chunk="dashboard-01-chunk-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Qarzlar</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="mt-2 flex w-full justify-between text-xl font-bold">
                <span>So'mda:</span>
                <span>
                  {formatNumberComma(statistics.data.debts["SUM"]?.total_debt)}
                </span>
              </div>
              <div className="flex w-full justify-between text-xl font-bold">
                <span>Dollarda:</span>
                <span>
                  ${formatNumberComma(statistics.data.debts.USD?.total_debt)}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to={"products"}>
          <Card x-chunk="dashboard-01-chunk-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mahsulotlar soni
              </CardTitle>
              <span className="text-lg font-bold">
                {formatNumberComma(
                  statistics.data.products_left.total_quantity,
                )}
              </span>
            </CardHeader>
            <CardContent>
              <div className="flex w-full justify-between text-xl font-bold">
                <span>So'mda:</span>
                <span>
                  {formatNumberComma(
                    statistics.data.products_left.total_cost_sum,
                  )}
                </span>
              </div>
              <div className="flex w-full justify-between text-xl font-bold">
                <span>Dollarda:</span>
                <span>
                  $
                  {formatNumberComma(
                    statistics.data.products_left.total_cost_dollar,
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Pul O'tkazmalari</CardTitle>
              <CardDescription>
                Ohirgi haftada amalga oshirilgan pul o'tkazmalari
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link to="/transactions">
                Barchasini ko'rishk
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[70vh] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead colSpan={99}>
                      <div className="flex w-full justify-between">
                        <div>Haridor</div>
                        <div>O'tkazma Kuni</div>
                        <div>To'lov</div>
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statistics.data.weekly.transactions.map(
                    (transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="font-medium">
                            {transaction.client.name}
                          </div>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                            {transaction.type === "cash"
                              ? "Naqd pul"
                              : transaction.type === "card"
                                ? "Karta"
                                : ""}
                          </div>
                        </TableCell>
                        <TableCell className="table-cell">
                          {transaction.date}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatNumberComma(transaction.amount)}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Ohirgi Sotuvlar</CardTitle>
            <CardDescription>
              Ohirgi hafta davomida qilingan sotuvlar
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="h-[70vh] space-y-2 divide-y-[1px] overflow-y-auto">
              {statistics.data.weekly.sales.map((sale, index) => (
                <div key={index} className="flex items-center gap-4 pt-2">
                  <div className="grid gap-1">
                    <p className="text-sm font-medium leading-none">
                      {sale.client.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{sale.date}</p>
                  </div>
                  <div className="ml-auto font-medium">
                    {sale.client.currency === "USD" && "$"}{" "}
                    {formatNumberComma(sale.total_price)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Daashboard;
