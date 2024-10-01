import { useParams } from "react-router-dom"

import useWarehouses from "@/hooks/useWarehouses"
import WarehouseDetails from "@/features/Warehouses/warehouse-details"

export default function EditWarehouse() {
  const params = useParams()

  const { getSingleWarehouseQuery } = useWarehouses()

  const { data, isLoading, error } = getSingleWarehouseQuery(params.id)

  if (isLoading) {
    return <>Loading...</>
  }

  if (error) {
    return <>Error</>
  }

  return (
    <div className="max-w-7xl mx-auto my-12 grid flex-1 auto-rows-max gap-4">
      {data?.success && (
        <WarehouseDetails data={data.data} />
      )}
    </div>
  )
}