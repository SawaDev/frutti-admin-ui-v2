import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { endOfDay, endOfMonth, format, startOfDay, startOfMonth } from "date-fns"
import { DateRange } from "react-day-picker"

import NoItems from '@/features/NoItems'
import useIngredients from "@/hooks/useIngredients"
import PurchaseIngredientTable from "@/features/PurchaseIngredient/purchase-ingredient-table"
import DatePickerWithRange from "@/components/filters/date-range"
import IngredientPurchaseTable from "@/features/Ingredients/ingredient-purchase-table"


import { Button } from "@/components/ui/button"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewPurchase from "@/features/PurchaseIngredient/new-purchase"

const IngredientsPurchase = () => {
  const currentMonthStart = startOfMonth(new Date());
  const currentMonthEnd = endOfMonth(new Date());

  const [newPurchase, setNewPurchase] = useState<boolean>(false)
  const [purchaseIndex, setPurchaseIndex] = useState<number | undefined>()
  const [date, setDate] = useState<{ from_date: string, to_date: string }>({
    from_date: format(currentMonthStart, "yyyy-MM-dd HH:mm:ss"),
    to_date: format(currentMonthEnd, "yyyy-MM-dd HH:mm:ss")
  })

  const {
    getAllIngredientsQuery,
    getAllIngredientPurchasesQuery,
  } = useIngredients()

  const { data: ingredients, isLoading: loadingIngredients, isError: errorIngredients } = getAllIngredientsQuery()
  const { data: purchases, isLoading: loadingPurchases, isError: errorPurchases } = getAllIngredientPurchasesQuery({
    status: "finished",
    from_date: date.from_date,
    to_date: date.to_date
  })


  const handleDateChange = (range: DateRange | undefined) => {
    setDate((prev) => ({
      ...prev,
      from_date: range?.from ? format(startOfDay(range.from), "yyyy-MM-dd HH:mm:ss") : "",
      to_date: range?.to ? format(endOfDay(range.to), "yyyy-MM-dd HH:mm:ss") : ""
    }))
  }

  if (loadingIngredients || loadingPurchases) {
    return <>Loading...</>
  }

  if (errorIngredients || errorPurchases) {
    return <>Error</>
  }

  return (
    <>
      {ingredients?.data?.length ? (
        <>
          <Card className="mx-6 my-10 p-4">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Siryo Haridlari</CardTitle>
                <CardDescription>
                  Sotib olingan siryolarni bu yerdan boshqaring.
                </CardDescription>
              </div>
              <div className="space-x-3">
                <Button type="button" onClick={() => setNewPurchase(true)} size="sm" variant="outline" className="gap-1">
                  <PlusCircle className="h-3.5 w-3.5" />
                  Yangi harid
                </Button>
              </div>
            </CardHeader>
            <Tabs defaultValue="finished" className="w-full">
              <div className="flex items-center justify-between">
                <TabsList className="grid w-[500px] grid-cols-3">
                  <TabsTrigger value="finished">Tugatilgan</TabsTrigger>
                  <TabsTrigger value="waiting">Kutilayotgan</TabsTrigger>
                  <TabsTrigger value="on_way">Yo'lda</TabsTrigger>
                </TabsList>
                <div className="pr-4">
                  <DatePickerWithRange onChange={handleDateChange} />
                </div>
              </div>
              <TabsContent value="finished">
                <IngredientPurchaseTable status="finished" from_date={date.from_date} to_date={date.to_date} />
              </TabsContent>
              <TabsContent value="waiting">
                <IngredientPurchaseTable status="waiting" from_date={date.from_date} to_date={date.to_date} />
              </TabsContent>
              <TabsContent value="on_way">
                <IngredientPurchaseTable status="on_way" from_date={date.from_date} to_date={date.to_date} />
              </TabsContent>
            </Tabs>
          </Card >
        </>
      ) : (
        <NoItems setOpen={setNewPurchase} />
      )}

      <NewPurchase open={newPurchase} setOpen={setNewPurchase} />

      {purchaseIndex !== undefined && (
        <Dialog open={true} onOpenChange={() => setPurchaseIndex(undefined)}>
          <DialogContent className="py-3 px-2">
            <PurchaseIngredientTable
              data={purchases?.data[purchaseIndex ?? 0].ingredients}
              purchaseId={purchaseIndex}
              handleClose={() => setPurchaseIndex(undefined)}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default IngredientsPurchase