import { Card, CardContent } from "@/components/ui/card"
import WarehouseCard from "@/components/warehouseCard"
import AddWarehouse from "@/features/Warehouses/add-warehouse"
import useWarehouses from "@/hooks/useWarehouses"
import { PlusCircleIcon } from "lucide-react"
import { useState } from "react"

const Warehouses = () => {
  const [open, setOpen] = useState<boolean>(false)

  const { getAllWarehousesQuery } = useWarehouses()

  const { data, isLoading, isError } = getAllWarehousesQuery()

  if (isLoading) {
    return <>Loading...</>
  }

  if (isError) {
    return <>Error</>
  }

  return (
    <div className="flex flex-row flex-wrap gap-10 mt-[100px] justify-center sm:mx-[100px]">
      {data?.data.map((warehouse, index) => (
        <WarehouseCard key={warehouse.id} warehouse={warehouse} order={index + 1} link={"ingredient-warehouses"}/>
      ))}
      <Card
        onClick={() => setOpen(true)}
        className="relative w-[300px] min-h-[80px] flex items-center justify-center cursor-pointer hover:bg-gray-200/10">
        <CardContent className="flex flex-col items-center gap-3">
          <PlusCircleIcon />
          <p>Yangi Siryo Skladini Qo'shish</p>
        </CardContent>
      </Card>
      <AddWarehouse open={open} setOpen={setOpen} />
    </div>
  )
}

export default Warehouses