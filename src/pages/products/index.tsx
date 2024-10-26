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
import useProducts from "@/hooks/useProducts"
import AddProductWarehouse from "@/features/ProductWarehouses/add-warehouse"
import AddProduct from "@/features/Products/add-product"
import ProductTable from "@/features/Products/product-table"

const Products = () => {
  const [openSheet, setOpenSheet] = useState<boolean>(false)
  const [addWarehouseSheet, setAddWarehouseSheet] = useState<boolean>(false)

  const { getAllProductsQuery } = useProducts()

  const { data, isLoading, isError } = getAllProductsQuery()

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
              <CardTitle>Mahsulotlar</CardTitle>
              <CardDescription>
                Mahsulotni bu yerdan boshqaring.
              </CardDescription>
            </div>
            <div>
              <Button onClick={() => setAddWarehouseSheet(true)} size="sm" variant="ghost" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                Sklad qo'shish
              </Button>
              <Button onClick={() => setOpenSheet(true)} size="sm" variant="ghost" className="gap-1">
                <PlusCircle className="h-3.5 w-3.5" />
                Mahsulot qo'shish
              </Button>
            </div>
          </CardHeader >
          <CardContent>
            <ProductTable />
          </CardContent>
        </Card>
      ) : (
        <NoItems setOpen={setOpenSheet} setOpenWarehouse={setAddWarehouseSheet}/>
      )}
      {openSheet && (
        <AddProduct open={openSheet} setOpen={setOpenSheet} />
      )}
      <AddProductWarehouse open={addWarehouseSheet} setOpen={setAddWarehouseSheet} />
    </>
  )
}

export default Products