import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouterState } from "@/hooks/custom/useRouterState";
import { useState } from "react";
import AddPaymentWoman from "@/features/Payments/add-payments-woman";
import WomanTab from "@/features/Payments/woman-tab";
import ManTab from "@/features/Payments/man-tab";

const Payments = () => {
  const [tab, setTab] = useRouterState<"man" | "woman">("tab", "man");

  const [addWoman, setAddWoman] = useState(false);

  const handleAdd = (type: "man" | "woman") => {
    if (type === "woman") {
      setAddWoman(true);
    }
  };

  return (
    <>
      <Tabs
        defaultValue={tab}
        className="m-4"
        onValueChange={(value) => setTab(value as "man" | "woman")}
      >
        <div className="flex justify-between">
          <TabsList className="grid w-[300px] grid-cols-2">
            <TabsTrigger value={"man"}>Erkaklar</TabsTrigger>
            <TabsTrigger value={"woman"}>Ayollar</TabsTrigger>
          </TabsList>
          {tab === "woman" && (
            <Button
              variant="outline"
              size={"sm"}
              className="gap-2"
              onClick={() => handleAdd("woman")}
            >
              <PlusCircle className="h-4 w-4" />
              Qo'shish
            </Button>
          )}
        </div>
        <TabsContent value={"man"} className="h-[calc(100vh-10em)]">
          <ManTab />
        </TabsContent>
        <TabsContent value={"woman"}>
          <WomanTab />
        </TabsContent>
      </Tabs>
      <AddPaymentWoman open={addWoman} setOpen={setAddWoman} />
      {/* <AddPayment open={openSheet} setOpen={setOpenSheet} /> */}
    </>
  );
};

export default Payments;
