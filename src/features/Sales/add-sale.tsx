import { FormDatePicker } from "@/components/form/FormDatePicker";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  paymentMethodOptions,
  questionOptions,
  saleOptions,
} from "@/constants/options";
import useClients from "@/hooks/useClients";
import useProducts from "@/hooks/useProducts";
import useSales from "@/hooks/useSales";
import useWallets from "@/hooks/useWallets";
import { formatNumberComma } from "@/lib/utils";
import { createSaleSchema } from "@/schema/sales";
import { useCurrencyStore } from "@/store/currency";
import { Client } from "@/types/clients";
import { SheetType } from "@/types/other";
import { CreateSaleType } from "@/types/sales";
import { Wallet } from "@/types/wallets";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { InfoIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const AddSale: FC<SheetType & { edit?: number }> = ({
  open,
  setOpen,
  edit,
}) => {
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);

  const { activeCurrency } = useCurrencyStore();

  const {
    createSaleMutation,
    getLastSaleQuery,
    getSaleById,
    updateSaleMutation,
  } = useSales();
  const { getAllWalletsQuery } = useWallets();
  const { getAllClientsQuery } = useClients();
  const { getAllProductsQuery } = useProducts();

  const createSale = createSaleMutation();
  const updateSale = updateSaleMutation(edit);

  const form = useForm<CreateSaleType>({
    resolver: zodResolver(createSaleSchema),
    defaultValues: {
      is_free: "false",
      transaction_type: "cash",
      payment_received: 0,
      status: "finished",
    },
  });

  const clientId = form.watch("client_id");
  const walletId = form.watch("wallet_id");
  const is_free = form.watch("is_free") === "false" ? false : true;

  const { data: wallets, isLoading: loadingWallets } = getAllWalletsQuery();
  const { data: clients, isLoading: loadingClients } = getAllClientsQuery();
  const { data: products, isLoading: loadingProducts } = getAllProductsQuery();
  const { data: sale, isLoading: loadingSale } = getSaleById(
    edit ? edit.toString() : null,
  );
  const { data: lastSale } = getLastSaleQuery(edit ? null : clientId);

  useEffect(() => {
    if (products) {
      products.data.forEach((product, index) => {
        form.setValue(`products.${index}.product_id`, product.id);
      });
    }
  }, [products]);

  useEffect(() => {
    if (
      products &&
      lastSale &&
      lastSale.data.products &&
      lastSale.data.products.length > 0
    ) {
      products.data.forEach((product, index) => {
        lastSale.data.products?.forEach((innerProduct) => {
          if (innerProduct.id === product.id) {
            form.setValue(`products.${index}.price`, innerProduct.sale_price);
          }
        });
      });
    }
  }, [lastSale]);

  useEffect(() => {
    if (clientId) {
      const foundClient = clients?.data.find(
        (client) => client.id.toString() === clientId,
      );

      setClient(foundClient);
    }
  }, [clientId]);

  useEffect(() => {
    if (walletId) {
      const foundWallet = wallets?.data.find(
        (wallet) => wallet.id.toString() === walletId,
      );

      setWallet(foundWallet);
    }
  }, [walletId]);

  useEffect(() => {
    if (!loadingSale && edit && sale?.data && products) {
      form.reset({
        wallet_id: sale.data.transaction?.wallet_id
          ? sale.data.transaction?.wallet_id.toString()
          : undefined,
        client_id: sale.data.client_id
          ? sale.data.client_id.toString()
          : undefined,
        transaction_type: sale.data.transaction?.type ?? "cash",
        payment_received: sale.data.transaction?.amount ?? 0,
        currency_name: sale.data.currency_name ?? activeCurrency?.name,
        distribution: sale.data.distribution ?? activeCurrency?.distribution,
        is_free: sale.data.is_free ? "true" : "false",
        date: sale.data.date ?? undefined,
        status: sale.data.status,
      });

      products.data.forEach((product, index) => {
        sale.data.products?.forEach((innerProduct) => {
          if (innerProduct.id === product.id) {
            form.setValue(`products.${index}.price`, innerProduct.sale_price);
            if (sale.data.is_free) {
              form.setValue(
                `products.${index}.free_item`,
                innerProduct.sale_quantity,
              );
            } else {
              form.setValue(
                `products.${index}.quantity`,
                innerProduct.sale_quantity,
              );
            }
          }
        });
        form.setValue(`products.${index}.product_id`, product.id);
      });
    }
  }, [loadingSale, sale, edit, products]);

  const onSubmit = (values: CreateSaleType) => {
    const filteredProducts = values.products
      .map((item, index) => ({
        ...item,
        price: item?.price
          ? item.price
          : client?.currency === "USD"
            ? products?.data[index].price_in_dollar
            : products?.data[index].price,
      }))
      .filter(
        (product) => product?.quantity || (is_free && product?.free_item),
      );

    const data = {
      ...values,
      is_free: values.is_free === "true" ? true : false,
      client_id: Number(values.client_id),
      wallet_id: Number(values.wallet_id),
      products: filteredProducts,
      date: values.date
        ? format(values.date, "yyyy-MM-dd")
        : format(new Date(), "yyyy-MM-dd"),
    };

    if (edit) {
      updateSale.mutateAsync(data).finally(() => {
        form.reset({});
        setOpen(false);
      });
    } else {
      createSale.mutateAsync(data).finally(() => {
        form.reset({});
        setOpen(false);
      });
    }
  };

  if (loadingWallets || loadingClients || loadingProducts) {
    return <Skeleton className="h-[360px] w-full" />;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="w-[90vw] sm:max-w-[90vw]">
        <ScrollArea className="z-[9999] h-[96vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>
                    {edit
                      ? "Sotuv ma'lumotlarini o'zgartirish"
                      : "Yangi sotuvni kiritish"}
                  </CardTitle>
                  <CardDescription>
                    {edit
                      ? "Bu yerda siz sotuv ma'lumotlarni o'zgartirishingiz mumkin"
                      : "Bu yerda siz yangi sotuv ma'lumotlarni kiritishingiz mumkin"}
                  </CardDescription>
                </div>
                <div>
                  <Button
                    type="submit"
                    size="sm"
                    variant="default"
                    className="ml-3"
                    disabled={createSale.isPending}
                  >
                    Saqlash
                  </Button>
                </div>
              </CardHeader>
              <div className="my-5 grid grid-cols-5 gap-4">
                <FormSelect
                  control={form.control}
                  name="client_id"
                  label={
                    <div className="flex items-center justify-start gap-1 py-1">
                      Klientni tanlang{" "}
                      {client && (
                        <Popover>
                          <PopoverTrigger>
                            <InfoIcon className="h-4 w-4" />
                          </PopoverTrigger>
                          <PopoverContent>
                            <ul>
                              <li className="space-x-2">
                                <b>Ismi:</b>
                                <i>{client.name}</i>
                              </li>
                              <li className="space-x-2">
                                <b>Balans:</b>
                                <i>
                                  {formatNumberComma(client.balance)}{" "}
                                  {client.currency === "USD"
                                    ? "$"
                                    : client.currency}
                                </i>
                              </li>
                            </ul>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  }
                  options={clients?.data.map((client) => ({
                    label: client.name,
                    value: client.id.toString(),
                  }))}
                  disabled={!!edit}
                />
                <FormSelect
                  control={form.control}
                  name="wallet_id"
                  label={
                    <div className="flex items-center justify-start gap-1 py-1">
                      Kassani tanlang{" "}
                      {wallet && (
                        <Popover>
                          <PopoverTrigger>
                            <InfoIcon className="h-4 w-4" />
                          </PopoverTrigger>
                          <PopoverContent>
                            <ul>
                              <li className="space-x-2">
                                <b>Nomi:</b>
                                <i>{wallet.name}</i>
                              </li>
                              <li className="space-x-2">
                                <b>Balans:</b>
                                <i>
                                  {formatNumberComma(wallet.balance)}{" "}
                                  {wallet.type === "dollar" ? "$" : wallet.type}
                                </i>
                              </li>
                            </ul>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  }
                  options={wallets?.data.map((wallet) => ({
                    label: wallet.name,
                    value: wallet.id.toString(),
                  }))}
                  disabled={!!edit}
                />
                <FormInput
                  control={form.control}
                  name="payment_received"
                  label="Qilingan to'lov"
                  type="number"
                />
                <FormSelect
                  control={form.control}
                  name="transaction_type"
                  label="To'lov turi"
                  options={paymentMethodOptions}
                />
                <FormSelect
                  control={form.control}
                  name="is_free"
                  label="Aksiyami?"
                  disabled={!!edit}
                  options={questionOptions}
                />
                <FormSelect
                  control={form.control}
                  name="status"
                  label="Status"
                  options={saleOptions}
                />
                <FormDatePicker
                  control={form.control}
                  name="date"
                  label="Sotuv kuni"
                />
              </div>
              <Card>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mahsulotlar</TableHead>
                      <TableHead>Qancha bor</TableHead>
                      <TableHead>Narxi</TableHead>
                      <TableHead>Narxi (dollarda)</TableHead>
                      <TableHead>Yangilangan Narx</TableHead>
                      <TableHead>Soni</TableHead>
                      {is_free && <TableHead>Aksiyadagilar Soni</TableHead>}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products?.data.map((product, productIndex) => {
                      return (
                        <TableRow key={productIndex}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>{product.price}</TableCell>
                          <TableCell>{product.price_in_dollar}$</TableCell>
                          <TableCell>
                            <FormInput
                              control={form.control}
                              type="number"
                              step={0.01}
                              name={`products.${productIndex}.price`}
                              min={0}
                            />
                          </TableCell>
                          <TableCell>
                            <FormInput
                              control={form.control}
                              type="number"
                              name={`products.${productIndex}.quantity`}
                              min={0}
                              max={edit ? undefined : product.quantity}
                              disabled={!!edit && sale?.data.is_free}
                            />
                          </TableCell>
                          {is_free && (
                            <TableCell>
                              <FormInput
                                control={form.control}
                                type="number"
                                name={`products.${productIndex}.free_item`}
                                min={0}
                                max={edit ? undefined : product.quantity}
                                disabled={!!edit && !sale?.data.is_free}
                              />
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </form>
          </Form>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default AddSale;
