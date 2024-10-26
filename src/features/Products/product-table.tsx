import { FC, useState } from "react"
import { flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"

import useProducts from "@/hooks/useProducts"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { productColumns } from "./columns"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import AddProduct from "./add-product"
import { Product } from "@/types/products"

interface ProductTableType { }

const ProductTable: FC<ProductTableType> = () => {
  const [deleteModal, setDeleteModal] = useState<number>()
  const [openSheet, setOpenSheet] = useState<Product | null>(null)

  const {
    getAllProductsQuery,
    deleteProductMutation
  } = useProducts()

  const { data: products, isLoading: loadingProducts, isError: errorProducts } = getAllProductsQuery()

  const deleteProduct = deleteProductMutation(deleteModal)

  const handleDelete = async () => {
    await deleteProduct.mutateAsync().then(() => {
      setDeleteModal(undefined)
    })
  }

  const productsTable = useReactTable({
    data: products?.data ?? [],
    columns: productColumns(setDeleteModal, setOpenSheet),
    getCoreRowModel: getCoreRowModel(),
  })

  if (loadingProducts) {
    return <Skeleton className="w-full h-[600px]" />
  }

  if (errorProducts) return <>Error</>

  return (
    <Table>
      <TableHeader>
        {productsTable.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  <div className="w-full flex items-center justify-between pr-2 border-r-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    }
                  </div>
                </TableHead>
              )
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {productsTable.getRowModel().rows?.length ? (
          productsTable.getRowModel().rows.map((row) => (
            <TableRow key={row.id}            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext()
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={99}
              className="h-24 text-center"
            >
              Hech narsa yo'q.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
      {openSheet && (
        <AddProduct open={!!openSheet} setOpen={() => setOpenSheet(null)} edit={openSheet}/>
      )}
      {deleteModal !== undefined && (
        <Dialog open={deleteModal ? true : false} onOpenChange={() => setDeleteModal(undefined)}>
          <DialogContent>
            <DialogTitle>
              Mahsulotni o'chirish
            </DialogTitle>
            <DialogDescription>
              Mahsulotni o'chirganingizdan so'ng uni qayta tiklab bo'lmaydi
            </DialogDescription>
            <DialogFooter>
              <Button variant={"outline"} onClick={() => setDeleteModal(undefined)}>
                Bekor qilish
              </Button>
              <Button disabled={deleteProduct.isPending} variant={"destructive"} onClick={handleDelete}>
                O'chirish
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Table >
  )
}

export default ProductTable