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
import { paymentMethodOptions, questionOptions } from "@/constants/options";
import useClients from "@/hooks/useClients";
import useProducts from "@/hooks/useProducts";
import useSales from "@/hooks/useSales";
import useWallets from "@/hooks/useWallets";
import { formatNumberComma } from "@/lib/utils";
import { createSaleSchema } from "@/schema/sales";
import { Client } from "@/types/clients";
import { SheetType } from "@/types/other";
import { CreateSaleType } from "@/types/sales";
import { Wallet } from "@/types/wallets";
import { zodResolver } from "@hookform/resolvers/zod";
import { InfoIcon } from "lucide-react";
import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const AddSale: FC<SheetType> = ({ open, setOpen }) => {
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [wallet, setWallet] = useState<Wallet | undefined>(undefined);

  const { createSaleMutation, getLastSaleQuery } = useSales();
  const { getAllWalletsQuery } = useWallets();
  const { getAllClientsQuery } = useClients();
  const { getAllProductsQuery } = useProducts();

  const createSale = createSaleMutation();

  const form = useForm<CreateSaleType>({
    resolver: zodResolver(createSaleSchema),
    defaultValues: {
      is_free: "false",
      transaction_type: "cash",
      payment_received: 0,
    },
  });

  const { data: wallets, isLoading: loadingWallets } = getAllWalletsQuery();
  const { data: clients, isLoading: loadingClients } = getAllClientsQuery();
  const { data: products, isLoading: loadingProducts } = getAllProductsQuery();
  const { data: lastSale } = getLastSaleQuery(form.getValues("client_id"));

  useEffect(() => {
    if (products) {
      products.data.forEach((product, index) => {
        form.setValue(`products.${index}.product_id`, product.id);
        form.setValue(`products.${index}.price`, product.price);
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
    if (form.getValues("client_id")) {
      const foundClient = clients?.data.find(
        (client) => client.id.toString() === form.getValues("client_id"),
      );

      setClient(foundClient);
    }
  }, [form.getValues("client_id")]);

  useEffect(() => {
    if (form.getValues("wallet_id")) {
      const foundWallet = wallets?.data.find(
        (wallet) => wallet.id.toString() === form.getValues("wallet_id"),
      );

      setWallet(foundWallet);
    }
  }, [form.getValues("wallet_id")]);

  const onSubmit = (values: CreateSaleType) => {
    const filteredProducts = values.products.filter(
      (product) => product?.quantity,
    );

    const data = {
      ...values,
      is_free: values.is_free === "true" ? true : false,
      client_id: Number(values.client_id),
      wallet_id: Number(values.wallet_id),
      products: filteredProducts,
    };

    createSale.mutateAsync(data).then(() => {
      form.reset({});
      setOpen(false);
    });
  };

  if (loadingWallets || loadingClients || loadingProducts) {
    return <Skeleton className="h-[360px] w-full" />;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="sm:max-w-[80vw]">
        <ScrollArea className="z-[9999] h-[96vh]">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Yangi sotuvni kiritish</CardTitle>
                  <CardDescription>
                    Bu yerda siz yangi sotuv ma'lumotlarni kiritishingiz mumkin
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
                  options={questionOptions}
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
                              step={0.01}
                              name={`products.${productIndex}.quantity`}
                              min={0}
                              max={product.quantity}
                            />
                          </TableCell>
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
