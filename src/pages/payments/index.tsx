import { useState } from "react";
// import { formatNumberComma } from "@/lib/utils";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import AddPayment from "@/features/Payments/add-payment";
import MenPayments from "@/features/Payments/MenPayments";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const Payments = () => {
  const [tab, setTab] = useState<"man" | "woman">("man");
  // const [addWoman, setAddWoman] = useState<boolean>(false);

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
              // onClick={() => setAddWoman(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Qo'shish
            </Button>
          )}
        </div>
        <TabsContent value={"man"} className="h-[calc(100vh-10em)]">
          <MenPayments/>
        </TabsContent>
        <TabsContent value={"woman"}>
          <></>
        </TabsContent>
      </Tabs>

      {/* <AddPayment open={openSheet} setOpen={setOpenSheet} /> */}
    </>
  );
};

export default Payments;
