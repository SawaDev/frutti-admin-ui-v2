import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AmountDiscounts from "@/features/Discount/amount-discounts";
import ProductDiscounts from "@/features/Discount/product-discounts";

const Discounts = () => {
  return (
    <div className="h-[calc(100vh-4rem)] w-full">
      <Tabs defaultValue="amount" className="h-full w-full p-4">
        <TabsList className="grid w-1/3 grid-cols-2">
          <TabsTrigger value="amount">Foiz / Summa</TabsTrigger>
          <TabsTrigger value="product">Mahsulot</TabsTrigger>
        </TabsList>

        <TabsContent value="amount" className="mt-2 h-[calc(100%-3rem)] w-full">
          <AmountDiscounts />
        </TabsContent>
        <TabsContent
          value="product"
          className="mt-2 h-[calc(100%-3rem)] w-full"
        >
          <ProductDiscounts />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Discounts;
