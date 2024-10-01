import { useParams } from "react-router-dom";

import useProductWarehouses from "@/hooks/useProductWarehouses";
import ProductWarehouseDetails from "@/features/ProductWarehouses/warehouse-details";

export default function EditProductWarehouse() {
  const params = useParams();

  const { getSingleProductWarehouseQuery } = useProductWarehouses();

  const { data, isLoading, error } = getSingleProductWarehouseQuery(params.id);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (error) {
    return <>Error</>;
  }

  return (
    <div className="mx-auto my-12 grid max-w-7xl flex-1 auto-rows-max gap-4">
      {data?.success && <ProductWarehouseDetails data={data.data} />}
    </div>
  );
}
