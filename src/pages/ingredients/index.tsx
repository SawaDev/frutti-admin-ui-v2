import { PlusCircle } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import NoItems from '@/features/NoItems'
import useIngredients from "@/hooks/useIngredients"
import IngredientTable from "@/features/Ingredients/ingredient-table"
import AddIngredient from "@/features/Ingredients/add-ingredient"
import AddWarehouse from "@/features/Warehouses/add-warehouse"
import AddCategory from "@/features/Ingredients/add-category"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DatePickerWithRange from "@/components/filters/date-range"
import IngredientPurchaseTable from "@/features/Ingredients/ingredient-purchase-table"
import { DateRange } from "react-day-picker"
import { endOfDay, format, startOfDay } from "date-fns"

const Ingredients = () => {
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [addWarehouseSheet, setAddWarehouseSheet] = useState<boolean>(false)
  const [addIngredientCategory, setAddIngredientCategory] = useState<boolean>(false)
  const [date, setDate] = useState<{ from_date: string, to_date: string }>({ from_date: "", to_date: "" })

  const { getAllIngredientsQuery } = useIngredients()

  const { data, isLoading, isError } = getAllIngredientsQuery()

  const handleDateChange = (range: DateRange | undefined) => {
    setDate((prev) => ({
      ...prev,
      from_date: range?.from ? format(startOfDay(range.from), "yyyy-MM-dd HH:mm:ss") : "",
      to_date: range?.to ? format(endOfDay(range.to), "yyyy-MM-dd HH:mm:ss") : ""
    }))
  }

  if (isLoading) {
    return <>Loading...</>
  }

  if (isError) {
    return <>Error</>
  }

  return (
    <>
      {data?.data.length ? (
        <Card className="my-4 mx-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Siryolar</CardTitle>
              <CardDescription>
                Siryoni bu yerdan boshqaring.
              </CardDescription>
            </div>
            <div>
              <Button onClick={() => setAddIngredientCategory(true)} size="sm" variant="ghost" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                Kategoriya qo'shish
              </Button>
              <Button onClick={() => setAddWarehouseSheet(true)} size="sm" variant="ghost" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                Sklad qo'shish
              </Button>
              <Button onClick={() => setOpenSheet(true)} size="sm" variant="ghost" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                Siryo qo'shish
              </Button>
            </div>
          </CardHeader >
          <CardContent>
            <IngredientTable />
          </CardContent>
        </Card>
      ) : (
        <NoItems setOpen={setOpenSheet} />
      )}
      <Card className="mx-6 mb-10">
        <CardTitle className="py-4 px-6">
          Buyurtma berilgan Siryolar
        </CardTitle>
        <CardContent>
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
        </CardContent>
      </Card>
      {openSheet && (
        <AddIngredient open={openSheet} setOpen={setOpenSheet} />
      )}
      <AddWarehouse open={addWarehouseSheet} setOpen={setAddWarehouseSheet} />
      <AddCategory open={addIngredientCategory} setOpen={setAddIngredientCategory} />
    </>
  )
}

export default Ingredients