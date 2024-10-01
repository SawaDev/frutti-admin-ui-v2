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

const Ingredients = () => {
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [addWarehouseSheet, setAddWarehouseSheet] = useState<boolean>(false)
  const [addIngredientCategory, setAddIngredientCategory] = useState<boolean>(false)

  const { getAllIngredientsQuery } = useIngredients()

  const { data, isLoading, isError } = getAllIngredientsQuery()

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
      {openSheet && (
        <AddIngredient open={openSheet} setOpen={setOpenSheet} />
      )}
      <AddWarehouse open={addWarehouseSheet} setOpen={setAddWarehouseSheet} />
      <AddCategory open={addIngredientCategory} setOpen={setAddIngredientCategory} />
    </>
  )
}

export default Ingredients